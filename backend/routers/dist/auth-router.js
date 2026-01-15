"use strict";
exports.__esModule = true;
var express_1 = require("express");
var passport_1 = require("../config/passport");
var jsonwebtoken_1 = require("jsonwebtoken");
var router = express_1.Router();
// Step 1: Redirect to Google
router.get("/google", passport_1["default"].authenticate("google", {
    scope: ["profile", "email"]
}));
// Step 2: Google callback
router.get("/google/callback", passport_1["default"].authenticate("google", {
    session: false,
    failureRedirect: "/login"
}), function (req, res) {
    var user = req.user;
    // Create JWT
    var token = jsonwebtoken_1["default"].sign({
        userId: user.id,
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: "7d" });
    // Redirect to frontend with token
    res.json({
        message: "Google login successful",
        token: token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar_url
        }
    });
});
exports["default"] = router;
