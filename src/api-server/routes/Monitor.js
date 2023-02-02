"use strict";
exports.__esModule = true;
var express_1 = require("express");
var MonitoringExpressController_1 = require("../controllers/MonitoringExpressController");
var route = express_1.Router();
exports["default"] = (function (app) {
    var monitoringController = new MonitoringExpressController_1["default"]();
    app.use('/metrics', route);
    route.get('/', function (req, res, next) { return monitoringController.getPromMetrics(req, res, next); });
});
