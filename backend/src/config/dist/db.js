"use strict";
exports.__esModule = true;
exports.db = void 0;
var pg_1 = require("pg");
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
exports.db = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
exports.db.on("connect", function () {
    console.log("PostgreSQL Connected");
});
