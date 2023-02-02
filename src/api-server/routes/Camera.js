"use strict";
exports.__esModule = true;
var express_1 = require("express");
var passport_1 = require("passport");
var CameraExpressController_1 = require("../controllers/CameraExpressController");
var ValidateQuery_1 = require("../middlewares/ValidateQuery");
var Authorization_1 = require("../middlewares/Authorization");
var route = express_1.Router();
exports["default"] = (function (app) {
    var CameraController = new CameraExpressController_1["default"]();
    app.use('/cameras', passport_1["default"].authenticate('jwt', { session: true }), route);
    route.post('/', Authorization_1.AuthorizeRole(['cms-admin', 'lms-admin', 'provider']), function (req, res, next) { return CameraController.register(req, res, next); });
    route.get('/:cameraId', function (req, res, next) { return CameraController.findOne(req, res, next); });
    route.get('/:cameraId/streams', Authorization_1.AuthorizeRole(['cms-admin', 'lms-admin', 'provider']), function (req, res, next) { return CameraController.findAssociatedStreams(req, res, next); });
    route.get('/', ValidateQuery_1.validatePaginationQuery(['page', 'size']), function (req, res, next) { return CameraController.findAll(req, res, next); });
    route.put('/:cameraId', Authorization_1.AuthorizeRole(['cms-admin', 'lms-admin', 'provider']), function (req, res, next) { return CameraController.update(req, res, next); });
    route["delete"]('/:cameraId', Authorization_1.AuthorizeRole(['cms-admin', 'lms-admin', 'provider']), function (req, res, next) { return CameraController["delete"](req, res, next); });
});
