"use strict";
exports.__esModule = true;
var express_1 = require("express");
var passport_1 = require("../config/passport");
var login_controller_1 = require("../controllers/login-controller");
var router = express_1.Router();
router.get("/google", passport_1["default"].authenticate("google", {
    scope: ["profile", "email"]
}));
router.get("/google/callback", passport_1["default"].authenticate("google", {
    session: false,
    failureRedirect: "/login"
}), login_controller_1.googleCallbackController);
exports["default"] = router;
