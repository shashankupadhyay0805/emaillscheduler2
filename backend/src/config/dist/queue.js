"use strict";
exports.__esModule = true;
exports.emailQueue = exports.redis = void 0;
var bullmq_1 = require("bullmq");
var ioredis_1 = require("ioredis");
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
exports.redis = new ioredis_1["default"](process.env.REDIS_URL, {
    maxRetriesPerRequest: null
});
exports.emailQueue = new bullmq_1.Queue("email-queue", {
    connection: exports.redis,
    defaultJobOptions: {
        removeOnComplete: false,
        removeOnFail: false
    }
});
