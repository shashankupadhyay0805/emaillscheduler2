import { Router } from "express";
import passport from "../config/passport";
import { googleCallbackController } from "../controllers/login-controller";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleCallbackController
);

export default router;
