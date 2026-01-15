import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import emailRoutes from "./routers/email_router";
import { db } from "./config/db";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (_req, res) => {
  const [rows] = await db.query("SELECT 'API running' AS msg");
  res.json(rows);
});

app.use(emailRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
