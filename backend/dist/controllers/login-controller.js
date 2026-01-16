"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleCallbackController = void 0;
exports.getMe = getMe;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const googleCallbackController = (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: "Authentication failed" });
    }
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: "JWT secret missing" });
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
    }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
};
exports.googleCallbackController = googleCallbackController;
async function getMe(req, res) {
    const userId = req.user.userId;
    const [rows] = await db_1.db.query("SELECT id, name, email, avatar_url FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json(rows[0]);
}
