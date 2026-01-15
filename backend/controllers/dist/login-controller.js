"use strict";
exports.__esModule = true;
exports.googleCallbackController = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
exports.googleCallbackController = function (req, res) {
    var user = req.user;
    if (!user) {
        return res.status(401).json({ error: "Authentication failed" });
    }
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: "JWT secret missing" });
    }
    var token = jsonwebtoken_1["default"].sign({
        userId: user.id,
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({
        message: "Google login successful",
        token: token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar_url
        }
    });
};
