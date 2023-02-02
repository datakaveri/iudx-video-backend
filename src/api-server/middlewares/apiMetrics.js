"use strict";
exports.__esModule = true;
var Prometheus_1 = require("../../common/Prometheus");
var requestCounters = function (req, res, next) {
    if (req.path !== '/api/metrics/') {
        Prometheus_1["default"].numOfRequests.inc({
            method: req.method,
            route: req.path
        });
    }
    next();
};
var requestDetailsAndDuration = function (req, res, next) {
    if (req.path !== '/api/metrics/') {
        var endDuration_1 = Prometheus_1["default"].httpRequestDuration.startTimer({
            method: req.method,
            route: req.path
        });
        var endDetails_1 = Prometheus_1["default"].httpRequestDetails.startTimer({
            method: req.method,
            route: req.path
        });
        res.on('finish', function () {
            endDuration_1({ status: res.statusCode });
            endDetails_1({ status: res.statusCode });
        });
    }
    next();
};
exports["default"] = {
    requestCounters: requestCounters,
    requestDetailsAndDuration: requestDetailsAndDuration
};
