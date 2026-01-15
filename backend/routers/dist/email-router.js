"use strict";
exports.__esModule = true;
var express_1 = require("express");
var email_controller_1 = require("../controllers/email-controller");
var auth_1 = require("../middleware/auth");
var router = express_1.Router();
router.post("/emails/schedule", auth_1.requireAuth, email_controller_1.scheduleEmails);
exports["default"] = router;
