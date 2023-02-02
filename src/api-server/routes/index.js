"use strict";
exports.__esModule = true;
var express_1 = require("express");
var Auth_1 = require("./Auth");
var Camera_1 = require("./Camera");
var Policy_1 = require("./Policy");
var Stream_1 = require("./Stream");
var Monitor_1 = require("./Monitor");
var Server_1 = require("./Server");
exports["default"] = (function () {
    var app = express_1.Router();
    Auth_1["default"](app);
    Camera_1["default"](app);
    Stream_1["default"](app);
    Policy_1["default"](app);
    Monitor_1["default"](app);
    Server_1["default"](app);
    return app;
});
