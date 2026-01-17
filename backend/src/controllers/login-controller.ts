import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../config/db";

export const googleCallbackController = (req: Request, res: Response) => {
  const user = req.user as any;

  if (!user) {
    return res.status(401).json({ error: "Authentication failed" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: "JWT secret missing" });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.redirect(
    `http://localhost:5173/auth/callback?token=${token}`
  );
};

/**
 * GET /auth/me
 */
export async function getMe(req: Request, res: Response) {
  const userId = (req as any).user.userId;

  const { rows } = await db.query(
    "SELECT id, name, email, avatar_url FROM users WHERE id = $1",
    [userId]
  );

  if (rows.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(rows[0]);
}