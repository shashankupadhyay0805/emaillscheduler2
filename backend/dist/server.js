"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const email_router_1 = __importDefault(require("./routers/email-router"));
const db_1 = require("./config/db");
const passport_1 = __importDefault(require("./config/passport"));
const login_router_1 = __importDefault(require("./routers/login-router"));
const worker_1 = require("./config/worker");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://emaillscheduler2.vercel.app",
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.get("/", async (_req, res) => {
    const { rows } = await db_1.db.query("SELECT 'API running' AS msg");
    res.json(rows);
});
app.use("/emails", email_router_1.default);
app.use("/auth", login_router_1.default);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    (0, worker_1.startWorker)();
});
