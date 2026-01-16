"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const queue_1 = require("./queue");
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailer_1 = require("./mailer");
dotenv_1.default.config();
const redis = new ioredis_1.default(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});
function getHourKey(senderEmail, date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    return `email_rate:${senderEmail}:${yyyy}-${mm}-${dd}-${hh}`;
}
function startOfNextHour(date) {
    const d = new Date(date);
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 1);
    return d;
}
new bullmq_1.Worker("email-queue", async (job) => {
    const { emailJobId } = job.data;
    // Fetch email job
    const [jobRows] = await db_1.db.query("SELECT * FROM email_jobs WHERE id = ?", [emailJobId]);
    if (jobRows.length === 0) {
        console.log("Email job not found, skipping");
        return;
    }
    const emailJob = jobRows[0];
    // Idempotency check
    if (emailJob.status !== "scheduled") {
        console.log("Job not in scheduled state, skipping:", emailJob.status);
        return;
    }
    // Fetch batch (sender + limit)
    const [batchRows] = await db_1.db.query("SELECT sender_email, hourly_limit FROM email_batches WHERE id = ?", [emailJob.batch_id]);
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
        await db_1.db.query("UPDATE email_jobs SET scheduled_at = ?, status = 'scheduled' WHERE id = ?", [nextRun, emailJob.id]);
        // Requeue job
        await queue_1.emailQueue.add("send-email", { emailJobId: emailJob.id }, {
            delay: Math.max(delayMs, 0),
            attempts: 3,
            backoff: { type: "exponential", delay: 2000 },
        });
        console.log("Hourly limit hit, rescheduled:", emailJob.id);
        return;
    }
    // Mark as processing
    const [lockResult] = await db_1.db.query(`
      UPDATE email_jobs
      SET status = 'processing'
      WHERE id = ? AND status = 'scheduled'
      `, [emailJob.id]);
    if (lockResult.affectedRows === 0) {
        console.log("Could not acquire job lock, skipping");
        return;
    }
    // SMTP
    try {
        const info = await mailer_1.transporter.sendMail({
            from: sender_email,
            to: emailJob.recipient_email,
            subject: "Scheduled Email",
            text: "Hello from Email Scheduler",
        });
        console.log("Email sent. Preview URL:", nodemailer_1.default.getTestMessageUrl(info));
        await db_1.db.query("UPDATE email_jobs SET status = 'sent', sent_at = NOW() WHERE id = ?", [emailJob.id]);
    }
    catch (err) {
        const attempts = job.attemptsMade + 1;
        if (attempts >= 3) {
            await db_1.db.query("UPDATE email_jobs SET status = 'failed', error_message = ? WHERE id = ?", [err.message, emailJob.id]);
        }
        throw err;
    }
}, {
    connection: redis,
    concurrency: 5,
});
