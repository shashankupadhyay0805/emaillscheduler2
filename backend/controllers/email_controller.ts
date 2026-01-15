import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { db } from "../config/db";
import { emailQueue } from "../config/queue";

export async function scheduleEmails(req: Request, res: Response) {
  const {
    senderEmail,
    subject,
    body,
    startTime,
    delayBetweenEmailsSeconds,
    recipients,
  } = req.body;

  if (!recipients || recipients.length === 0) {
    return res.status(400).json({ error: "No recipients provided" });
  }

  const batchId = randomUUID();
  const userId = "test-user"; // OAuth later

  // Create batch
  await db.query(
    `INSERT INTO email_batches
     (id, user_id, sender_email, subject, body, start_time,
      delay_between_emails_seconds, hourly_limit, total_emails)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      batchId,
      userId,
      senderEmail,
      subject,
      body,
      new Date(startTime),
      delayBetweenEmailsSeconds,
      100,
      recipients.length,
    ]
  );

  // Create jobs + schedule BullMQ
  for (let i = 0; i < recipients.length; i++) {
    const jobId = randomUUID();

    const scheduledAt = new Date(
      new Date(startTime).getTime() +
        i * delayBetweenEmailsSeconds * 1000
    );

    await db.query(
      `INSERT INTO email_jobs
       (id, batch_id, recipient_email, scheduled_at)
       VALUES (?, ?, ?, ?)`,
      [jobId, batchId, recipients[i], scheduledAt]
    );

    const delayMs = scheduledAt.getTime() - Date.now();

    const bullJob = await emailQueue.add(
      "send-email",
      { emailJobId: jobId },
      { delay: Math.max(delayMs, 0) }
    );

    await db.query(
      "UPDATE email_jobs SET bull_job_id = ? WHERE id = ?",
      [bullJob.id, jobId]
    );
  }

  res.json({
    message: "Emails scheduled",
    batchId,
    total: recipients.length,
  });
}
