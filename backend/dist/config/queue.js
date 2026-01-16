"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailQueue = exports.redis = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.redis = new ioredis_1.default(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});
exports.emailQueue = new bullmq_1.Queue("email-queue", {
    connection: exports.redis,
    defaultJobOptions: {
        removeOnComplete: false,
        removeOnFail: false,
    },
});
