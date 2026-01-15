"use strict";
exports.__esModule = true;
exports.requireAuth = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
function requireAuth(req, res, next) {
    var header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ error: "No token" });
    }
    var token = header.split(" ")[1];
    try {
        var payload = jsonwebtoken_1["default"].verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    }
    catch (_a) {
        res.status(401).json({ error: "Invalid token" });
    }
}
exports.requireAuth = requireAuth;
