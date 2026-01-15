import { Router } from "express";
import { scheduleEmails } from "../controllers/email_controller";

const router = Router();

router.post("/emails/schedule", scheduleEmails);

export default router;
