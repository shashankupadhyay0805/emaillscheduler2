"use strict";
exports.__esModule = true;
exports.requireAuth = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
function requireAuth(req, res, next) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Missing token" });
    }
    var token = authHeader.split(" ")[1];
    try {
        var decoded = jsonwebtoken_1["default"].verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (_a) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
exports.requireAuth = requireAuth;
