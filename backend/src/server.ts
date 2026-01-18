import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import emailRoutes from "./routers/email-router";
import { db } from "./config/db";
import passport from "./config/passport";
import authRoutes from "./routers/login-router";
import { startWorker } from "./config/worker";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://emaillscheduler2.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use(passport.initialize());

app.get("/", async (_req, res) => {
  const { rows } = await db.query("SELECT 'API running' AS msg");
  res.json(rows);
});

app.use("/emails", emailRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  if (process.env.RUN_WORKER === "true") {
    try {
      console.log("BullMQ connected");
      await db.query("SELECT 1");
      startWorker();
    } catch (err) {
      console.error("❌ Worker not started — DB unavailable");
    }
  }
});
