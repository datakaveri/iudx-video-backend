"use strict";
exports.__esModule = true;
var express_1 = require("express");
var passport_1 = require("passport");
var StreamExpressController_1 = require("../controllers/StreamExpressController");
var Authorization_1 = require("../middlewares/Authorization");
var ValidateQuery_1 = require("../middlewares/ValidateQuery");
var route = express_1.Router();
exports["default"] = (function (app) {
    var StreamController = new StreamExpressController_1["default"]();
    app.use('/streams', passport_1["default"].authenticate('jwt', { session: true }), route);
    route.post('/', Authorization_1.AuthorizeRole(['cms-admin', 'lms-admin', 'provider']), function (req, res, next) { return StreamController.register(req, res, next); });
    route.get('/:streamId', function (req, res, next) { return StreamController.findOne(req, res, next); });
    route.get('/', ValidateQuery_1.validatePaginationQuery(['page', 'size']), function (req, res, next) { return StreamController.findAll(req, res, next); });
    route["delete"]('/:streamId', Authorization_1.AuthorizeRole(['cms-admin', 'lms-admin', 'provider']), Authorization_1.ValidateStreamAccess, function (req, res, next) { return StreamController["delete"](req, res, next); });
    route.get('/status/:streamId', function (req, res, next) { return StreamController.getStatus(req, res, next); });
    route.get('/request/:streamId', Authorization_1.ValidatePolicy, function (req, res, next) { return StreamController.streamRequest(req, res, next); });
});
