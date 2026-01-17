import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { db } from "../config/db";
import { emailQueue } from "../config/queue";

/**
 * POST /schedule
 */
export async function scheduleEmails(req: Request, res: Response) {
  try {
    const {
      senderEmail,
      subject,
      body,
      startTime,
      delayBetweenEmailsSeconds,
      recipients,
      hourlyLimit = 100,
    } = req.body;

    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ error: "No recipients provided" });
    }

    const userId = (req as any).user.userId;
    const batchId = randomUUID();

    // 1️⃣ Create batch
    await db.query(
      `
      INSERT INTO email_batches
      (id, user_id, sender_email, subject, body, start_time,
       delay_between_emails_seconds, hourly_limit, total_emails)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      `,
      [
        batchId,
        userId,
        senderEmail,
        subject,
        body,
        new Date(startTime),
        delayBetweenEmailsSeconds,
        hourlyLimit,
        recipients.length,
      ]
    );

    // 2️⃣ Create jobs + schedule BullMQ
    for (let i = 0; i < recipients.length; i++) {
      const jobId = randomUUID();

      const scheduledAt = new Date(
        new Date(startTime).getTime() +
          i * delayBetweenEmailsSeconds * 1000
      );

      await db.query(
        `
        INSERT INTO email_jobs
        (id, batch_id, recipient_email, scheduled_at)
        VALUES ($1,$2,$3,$4)
        `,
        [jobId, batchId, recipients[i], scheduledAt]
      );

      const delayMs = scheduledAt.getTime() - Date.now();

      const bullJob = await emailQueue.add(
        "send-email",
        { emailJobId: jobId },
        { delay: Math.max(delayMs, 0) }
      );

      await db.query(
        "UPDATE email_jobs SET bull_job_id = $1 WHERE id = $2",
        [bullJob.id, jobId]
      );
    }

    return res.json({
      message: "Emails scheduled",
      batchId,
      total: recipients.length,
    });
  } catch (err) {
    console.error("Schedule error:", err);
    res.status(500).json({ error: "Failed to schedule emails" });
  }
}

/**
 * GET /scheduled
 */
export async function getScheduledEmails(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;

    const { rows } = await db.query(
      `
      SELECT
        ej.id,
        ej.recipient_email,
        ej.scheduled_at,
        ej.status,
        eb.subject
      FROM email_jobs ej
      JOIN email_batches eb ON ej.batch_id = eb.id
      WHERE eb.user_id = $1
        AND ej.status = 'scheduled'
      ORDER BY ej.scheduled_at ASC
      `,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Fetch scheduled error:", err);
    res.status(500).json({ error: "Failed to fetch scheduled emails" });
  }
}

/**
 * GET /sent
 */
export async function getSentEmails(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;

    const { rows } = await db.query(
      `
      SELECT
        ej.id,
        ej.recipient_email,
        ej.sent_at,
        ej.status,
        eb.subject
      FROM email_jobs ej
      JOIN email_batches eb ON ej.batch_id = eb.id
      WHERE eb.user_id = $1
        AND ej.status = 'sent'
      ORDER BY ej.sent_at DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Fetch sent error:", err);
    res.status(500).json({ error: "Failed to fetch sent emails" });
  }
}

/**
 * GET /:id
 */
export async function getEmailById(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { id } = req.params;

  const { rows } = await db.query(
    `
    SELECT
      ej.id,
      ej.recipient_email,
      ej.status,
      ej.scheduled_at,
      ej.sent_at,
      eb.subject,
      eb.body
    FROM email_jobs ej
    JOIN email_batches eb ON ej.batch_id = eb.id
    WHERE ej.id = $1
      AND eb.user_id = $2
    `,
    [id, userId]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: "Email not found" });
  }

  res.json(rows[0]);
}
