import { Request, Response } from "express";
import jwt from "jsonwebtoken";

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

  return res.json({
    message: "Google login successful",
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar_url,
    },
  });
};
