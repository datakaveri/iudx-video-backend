"use strict";
exports.__esModule = true;
var express_1 = require("express");
var cors_1 = require("cors");
var Logger_1 = require("../common/Logger");
var routes_1 = require("./routes");
var config_1 = require("../config");
var Passport_1 = require("../common/Passport");
var Error_1 = require("../common/Error");
var apiMetrics_1 = require("./middlewares/apiMetrics");
exports["default"] = (function () {
    var app = express_1["default"]();
    // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // It shows the real origin IP in the heroku or Cloudwatch logs
    app.enable('trust proxy');
    // The magic package that prevents frontend developers going nuts
    // Alternate description:
    // Enable Cross Origin Resource Sharing to all origins by default
    app.use(cors_1["default"]());
    // Middleware that transforms the raw string of req.body into json
    app.use(express_1["default"].json());
    // Load Passort JS
    app.use(Passport_1["default"].initialize());
    // Enable collection of API metrics
    app.use(apiMetrics_1["default"].requestCounters);
    app.use(apiMetrics_1["default"].requestDetailsAndDuration);
    // Load API routes
    app.use(config_1["default"].api.prefix, routes_1["default"]());
    /// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error_1["default"]('Resource Not Found');
        err['status'] = 404;
        err['title'] = 'Not Found';
        next(err);
    });
    /// error handlers
    app.use(function (err, req, res, next) {
        /**
         * Handle 401 thrown by express-jwt library
         */
        if (err.name === 'UnauthorizedError') {
            return res.status(err.status).send({ message: err.message }).end();
        }
        return next(err);
    });
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            type: err.status || 500,
            title: err.title || 'Internal Server Error',
            detail: err.message
        });
    });
    app.listen(config_1["default"].port, function () {
        Logger_1["default"].info("Server listening on port: " + config_1["default"].port);
    }).on('error', function (err) {
        Logger_1["default"].error(err);
        process.exit(1);
    });
});
