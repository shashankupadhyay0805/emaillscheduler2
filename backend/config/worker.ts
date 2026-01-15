import { Worker } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";
import { db } from "./db";
import { emailQueue } from "./queue";

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
    if (emailJob.status === "sent") {
      console.log("Already sent, skipping");
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
      { delay: delayMs }
    );

      console.log("Hourly limit hit, rescheduled:", emailJob.id);
      return;
    }

    // Mark as processing
    await db.query(
      "UPDATE email_jobs SET status = 'processing' WHERE id = ?",
      [emailJob.id]
    );

    console.log("Processing email job:", emailJob.id);

    // Simulate success (SMTP in Phase 5)
    await db.query(
      "UPDATE email_jobs SET status = 'sent', sent_at = NOW() WHERE id = ?",
      [emailJob.id]
    );
  },
  {
    connection: redis,
    concurrency: 5,
  }
);
