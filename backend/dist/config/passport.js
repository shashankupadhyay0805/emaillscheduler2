"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const db_1 = require("./db");
const crypto_1 = require("crypto");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(new Error("Google account has no email"));
        }
        const name = profile.displayName;
        const avatar = profile.photos?.[0]?.value;
        const [rows] = await db_1.db.query("SELECT * FROM users WHERE google_id = ?", [googleId]);
        let user;
        if (rows.length === 0) {
            user = {
                id: (0, crypto_1.randomUUID)(),
                google_id: googleId,
                name,
                email,
                avatar_url: avatar,
            };
            await db_1.db.query(`INSERT INTO users (id, google_id, name, email, avatar_url)
             VALUES (?, ?, ?, ?, ?)`, [
                user.id,
                user.google_id,
                user.name,
                user.email,
                user.avatar_url,
            ]);
        }
        else {
            user = rows[0];
        }
        done(null, user);
    }
    catch (err) {
        done(err);
    }
}));
exports.default = passport_1.default;
