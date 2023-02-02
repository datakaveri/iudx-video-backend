"use strict";
exports.__esModule = true;
var winston_1 = require("winston");
var config_1 = require("../config");
var transports = [];
var ENVIRONMENT = process.env.NODE_ENV;
if (ENVIRONMENT === 'development') {
    transports.push(new winston_1["default"].transports.Console({
        format: winston_1["default"].format.combine(winston_1["default"].format.cli(), winston_1["default"].format.splat())
    }));
}
else if (ENVIRONMENT === 'test') {
    transports.push(new winston_1["default"].transports.Console({
        silent: true
    }));
}
else {
    transports.push(new winston_1["default"].transports.Console());
}
var LoggerInstance = winston_1["default"].createLogger({
    level: config_1["default"].logs.level,
    levels: winston_1["default"].config.npm.levels,
    format: winston_1["default"].format.combine(winston_1["default"].format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), winston_1["default"].format.errors({ stack: true }), winston_1["default"].format.splat(), winston_1["default"].format.json()),
    transports: transports
});
exports["default"] = LoggerInstance;
