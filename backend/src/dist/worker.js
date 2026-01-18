"use strict";
exports.__esModule = true;
var dotenv_1 = require("dotenv");
var worker_1 = require("./config/worker");
dotenv_1["default"].config();
console.log("🟢 Starting email worker...");
worker_1.startWorker();
