"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const email_router_1 = __importDefault(require("./routers/email_router"));
const db_1 = require("./config/db");
dotenv_1.default.config();
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
app.get("/", async (_req, res) => {
    const [rows] = await db_1.db.query("SELECT 'API running' AS msg");
    res.json(rows);
});
app.use(email_router_1.default);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
