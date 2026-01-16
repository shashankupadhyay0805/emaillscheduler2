"use strict";
exports.__esModule = true;
var express_1 = require("express");
var email_controller_1 = require("../controllers/email_controller");
var router = express_1.Router();
router.post("/emails/schedule", email_controller_1.scheduleEmails);
exports["default"] = router;
