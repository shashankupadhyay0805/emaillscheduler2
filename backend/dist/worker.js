"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const worker_1 = require("./config/worker");
dotenv_1.default.config();
console.log("🟢 Starting email worker...");
(0, worker_1.startWorker)();
