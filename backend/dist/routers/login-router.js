"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("../config/passport"));
const login_controller_1 = require("../controllers/login-controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/google", passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
}));
router.get("/google/callback", passport_1.default.authenticate("google", {
    session: false,
    failureRedirect: "/login",
}), login_controller_1.googleCallbackController);
router.get("/me", auth_1.requireAuth, login_controller_1.getMe);
exports.default = router;
