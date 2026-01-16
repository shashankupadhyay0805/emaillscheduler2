import { Worker } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";
import { db } from "./db";
import { emailQueue } from "./queue";
import nodemailer from "nodemailer";
import { transporter } from "./mailer";

dotenv.config();

const redis = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

function getHourKey(senderEmail: string, date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  return `email_rate:${senderEmail}:${yyyy}-${mm}-${dd}-${hh}`;
}

function startOfNextHour(date: Date) {
  const d = new Date(date);
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return d;
}

new Worker(
  "email-queue",
  async job => {
    const { emailJobId } = job.data;

    // Fetch email job
    const [jobRows]: any = await db.query(
      "SELECT * FROM email_jobs WHERE id = ?",
      [emailJobId]
    );

    if (jobRows.length === 0) {
      console.log("Email job not found, skipping");
      return;
    }

    const emailJob = jobRows[0];

    // Idempotency check
    if (emailJob.status !== "scheduled") {
      console.log(
        "Job not in scheduled state, skipping:",
        emailJob.status
      );
      return;
    }
    
    // Fetch batch (sender + limit)
    const [batchRows]: any = await db.query(
      "SELECT sender_email, hourly_limit FROM email_batches WHERE id = ?",
      [emailJob.batch_id]
    );

    if (batchRows.length === 0) {
      console.log("Batch not found, skipping");
      return;
    }

    const { sender_email, hourly_limit } = batchRows[0];

    // Rate limiting
    const now = new Date();
    const hourKey = getHourKey(sender_email, now);

    const currentCount = await redis.incr(hourKey);
    if (currentCount === 1) {
      await redis.expire(hourKey, 3600);
    }

    if (currentCount > hourly_limit) {
      const nextRun = startOfNextHour(now);
      const delayMs = nextRun.getTime() - Date.now();

      // Update DB
      await db.query(
        "UPDATE email_jobs SET scheduled_at = ?, status = 'scheduled' WHERE id = ?",
        [nextRun, emailJob.id]
      );

      // Requeue job
      await emailQueue.add(
      "send-email",
      { emailJobId: emailJob.id },
      {
        delay: Math.max(delayMs, 0),
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
      }
    );

      console.log("Hourly limit hit, rescheduled:", emailJob.id);
      return;
    }

    // Mark as processing
    const [lockResult]: any = await db.query(
      `
      UPDATE email_jobs
      SET status = 'processing'
      WHERE id = ? AND status = 'scheduled'
      `,
      [emailJob.id]
    );

    if (lockResult.affectedRows === 0) {
      console.log("Could not acquire job lock, skipping");
      return;
    }

    // SMTP
    try {
      const info = await transporter.sendMail({
      from: sender_email,
      to: emailJob.recipient_email,
      subject: "Scheduled Email",
      text: "Hello from Email Scheduler",
    });

    console.log(
      "Email sent. Preview URL:",
      nodemailer.getTestMessageUrl(info)
    );

    await db.query(
      "UPDATE email_jobs SET status = 'sent', sent_at = NOW() WHERE id = ?",
      [emailJob.id]
    );
  } catch (err: any) {
    const attempts = job.attemptsMade + 1;

    if (attempts >= 3) {
      await db.query(
        "UPDATE email_jobs SET status = 'failed', error_message = ? WHERE id = ?",
        [err.message, emailJob.id]
      );
    }

    throw err;
  }
  },
  {
    connection: redis,
    concurrency: 5,
  }
);
