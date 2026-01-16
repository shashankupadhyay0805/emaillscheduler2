"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default("redis://localhost:6379");
(async () => {
    await redis.set("test", "ok");
    const value = await redis.get("test");
    console.log(value);
    process.exit(0);
})();
