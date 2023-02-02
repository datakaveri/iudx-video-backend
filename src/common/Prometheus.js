"use strict";
exports.__esModule = true;
var prom_client_1 = require("prom-client");
var numOfRequests = new prom_client_1["default"].Counter({
    name: 'num_of_requests',
    help: 'Number of requests made to the video server',
    labelNames: ['method', 'route']
});
var httpRequestDetails = new prom_client_1["default"].Summary({
    name: 'http_request_details',
    help: 'Details of HTTP requests to the video server',
    labelNames: ['method', 'route', 'status']
});
var httpRequestDuration = new prom_client_1["default"].Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests to the video server (in ms)',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.0025, 0.005, 0.025, 0.5, 1, 10, 100, 500, 1000, 5000]
});
exports["default"] = {
    numOfRequests: numOfRequests,
    httpRequestDetails: httpRequestDetails,
    httpRequestDuration: httpRequestDuration
};
