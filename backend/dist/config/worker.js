"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWorker = startWorker;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const queue_1 = require("./queue");
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailer_1 = require("./mailer");
dotenv_1.default.config();
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
function startWorker() {
    const redis = new ioredis_1.default(process.env.REDIS_URL, {
        maxRetriesPerRequest: null,
    });
    const worker = new bullmq_1.Worker("email-queue", async (job) => {
        const { emailJobId } = job.data;
        console.log("👷 Processing job:", emailJobId);
        const { rows: jobRows } = await db_1.db.query("SELECT * FROM email_jobs WHERE id = $1", [emailJobId]);
        if (jobRows.length === 0)
            return;
        const emailJob = jobRows[0];
        if (emailJob.status !== "scheduled")
            return;
        const { rows: batchRows } = await db_1.db.query("SELECT sender_email, hourly_limit FROM email_batches WHERE id = $1", [emailJob.batch_id]);
        if (batchRows.length === 0)
            return;
        const { sender_email, hourly_limit } = batchRows[0];
        const now = new Date();
        const hourKey = getHourKey(sender_email, now);
        const currentCount = await redis.incr(hourKey);
        if (currentCount === 1)
            await redis.expire(hourKey, 3600);
        if (currentCount > hourly_limit) {
            const nextRun = startOfNextHour(now);
            await db_1.db.query("UPDATE email_jobs SET scheduled_at = $1 WHERE id = $2", [nextRun, emailJob.id]);
            await queue_1.emailQueue.add("send-email", { emailJobId: emailJob.id }, { delay: nextRun.getTime() - Date.now() });
            return;
        }
        const lock = await db_1.db.query(`UPDATE email_jobs
         SET status = 'processing'
         WHERE id = $1 AND status = 'scheduled'`, [emailJob.id]);
        if (lock.rowCount === 0)
            return;
        const info = await mailer_1.transporter.sendMail({
            from: sender_email,
            to: emailJob.recipient_email,
            subject: "Scheduled Email",
            text: "Hello from Email Scheduler",
        });
        console.log("✅ Sent:", nodemailer_1.default.getTestMessageUrl(info));
        await db_1.db.query("UPDATE email_jobs SET status = 'sent', sent_at = NOW() WHERE id = $1", [emailJob.id]);
    }, {
        connection: redis,
        concurrency: 5,
    });
    worker.on("failed", (job, err) => {
        console.error("❌ Job failed:", job?.id, err.message);
    });
    console.log("🚀 Worker started");
}
