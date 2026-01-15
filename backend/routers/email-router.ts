import { Router } from "express";
import { scheduleEmails } from "../controllers/email-controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/emails/schedule", requireAuth, scheduleEmails);

export default router;
