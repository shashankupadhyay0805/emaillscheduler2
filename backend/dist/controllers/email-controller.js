"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleEmails = scheduleEmails;
exports.getScheduledEmails = getScheduledEmails;
exports.getSentEmails = getSentEmails;
exports.getEmailById = getEmailById;
const crypto_1 = require("crypto");
const db_1 = require("../config/db");
const queue_1 = require("../config/queue");
/**
 * POST /schedule
 */
async function scheduleEmails(req, res) {
    try {
        const { senderEmail, subject, body, startTime, delayBetweenEmailsSeconds, recipients, hourlyLimit = 100, } = req.body;
        if (!recipients || recipients.length === 0) {
            return res.status(400).json({ error: "No recipients provided" });
        }
        const userId = req.user.userId;
        const batchId = (0, crypto_1.randomUUID)();
        // 1️⃣ Create batch
        await db_1.db.query(`
      INSERT INTO email_batches
      (id, user_id, sender_email, subject, body, start_time,
       delay_between_emails_seconds, hourly_limit, total_emails)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      `, [
            batchId,
            userId,
            senderEmail,
            subject,
            body,
            new Date(startTime),
            delayBetweenEmailsSeconds,
            hourlyLimit,
            recipients.length,
        ]);
        // 2️⃣ Create jobs + schedule BullMQ
        for (let i = 0; i < recipients.length; i++) {
            const jobId = (0, crypto_1.randomUUID)();
            const scheduledAt = new Date(new Date(startTime).getTime() +
                i * delayBetweenEmailsSeconds * 1000);
            await db_1.db.query(`
        INSERT INTO email_jobs
        (id, batch_id, recipient_email, scheduled_at)
        VALUES ($1,$2,$3,$4)
        `, [jobId, batchId, recipients[i], scheduledAt]);
            const delayMs = scheduledAt.getTime() - Date.now();
            const bullJob = await queue_1.emailQueue.add("send-email", { emailJobId: jobId }, { delay: Math.max(delayMs, 0) });
            await db_1.db.query("UPDATE email_jobs SET bull_job_id = $1 WHERE id = $2", [bullJob.id, jobId]);
        }
        return res.json({
            message: "Emails scheduled",
            batchId,
            total: recipients.length,
        });
    }
    catch (err) {
        console.error("Schedule error:", err);
        res.status(500).json({ error: "Failed to schedule emails" });
    }
}
/**
 * GET /scheduled
 */
async function getScheduledEmails(req, res) {
    try {
        const userId = req.user.userId;
        const { rows } = await db_1.db.query(`
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
      `, [userId]);
        res.json(rows);
    }
    catch (err) {
        console.error("Fetch scheduled error:", err);
        res.status(500).json({ error: "Failed to fetch scheduled emails" });
    }
}
/**
 * GET /sent
 */
async function getSentEmails(req, res) {
    try {
        const userId = req.user.userId;
        const { rows } = await db_1.db.query(`
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
      `, [userId]);
        res.json(rows);
    }
    catch (err) {
        console.error("Fetch sent error:", err);
        res.status(500).json({ error: "Failed to fetch sent emails" });
    }
}
/**
 * GET /:id
 */
async function getEmailById(req, res) {
    const userId = req.user.userId;
    const { id } = req.params;
    const { rows } = await db_1.db.query(`
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
    `, [id, userId]);
    if (rows.length === 0) {
        return res.status(404).json({ error: "Email not found" });
    }
    res.json(rows[0]);
}
