"use strict";
exports.__esModule = true;
var events_1 = require("events");
var eventEmitter = new events_1.EventEmitter();
eventEmitter.on('error', function (err) { return console.log(err); });
exports["default"] = eventEmitter;
