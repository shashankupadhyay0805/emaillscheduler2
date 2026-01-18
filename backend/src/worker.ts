import dotenv from "dotenv";
import { startWorker } from "./config/worker";

dotenv.config();

console.log("🟢 Starting email worker...");
startWorker();