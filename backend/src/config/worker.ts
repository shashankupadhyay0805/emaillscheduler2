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

    // 1️⃣ Fetch email job
    const { rows: jobRows } = await db.query(
      "SELECT * FROM email_jobs WHERE id = $1",
      [emailJobId]
    );

    if (jobRows.length === 0) {
      console.log("Email job not found, skipping");
      return;
    }

    const emailJob = jobRows[0];

    // 2️⃣ Idempotency check
    if (emailJob.status !== "scheduled") {
      console.log("Job not scheduled, skipping:", emailJob.status);
      return;
    }

    // 3️⃣ Fetch batch info
    const { rows: batchRows } = await db.query(
      "SELECT sender_email, hourly_limit FROM email_batches WHERE id = $1",
      [emailJob.batch_id]
    );

    if (batchRows.length === 0) {
      console.log("Batch not found, skipping");
      return;
    }

    const { sender_email, hourly_limit } = batchRows[0];

    // 4️⃣ Rate limiting
    const now = new Date();
    const hourKey = getHourKey(sender_email, now);

    const currentCount = await redis.incr(hourKey);
    if (currentCount === 1) {
      await redis.expire(hourKey, 3600);
    }

    if (currentCount > hourly_limit) {
      const nextRun = startOfNextHour(now);
      const delayMs = nextRun.getTime() - Date.now();

      await db.query(
        "UPDATE email_jobs SET scheduled_at = $1 WHERE id = $2",
        [nextRun, emailJob.id]
      );

      await emailQueue.add(
        "send-email",
        { emailJobId: emailJob.id },
        { delay: Math.max(delayMs, 0) }
      );

      console.log("Hourly limit hit, rescheduled:", emailJob.id);
      return;
    }

    // 5️⃣ Atomic lock (CRITICAL)
    const lockResult = await db.query(
      `
      UPDATE email_jobs
      SET status = 'processing'
      WHERE id = $1 AND status = 'scheduled'
      `,
      [emailJob.id]
    );

    if (lockResult.rowCount === 0) {
      console.log("Could not acquire lock, skipping");
      return;
    }

    // 6️⃣ Send email
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
        "UPDATE email_jobs SET status = 'sent', sent_at = NOW() WHERE id = $1",
        [emailJob.id]
      );
    } catch (err: any) {
      await db.query(
        "UPDATE email_jobs SET status = 'failed', error_message = $1 WHERE id = $2",
        [err.message, emailJob.id]
      );
      throw err;
    }
  },
  {
    connection: redis,
    concurrency: 5,
  }
);
