"use strict";
exports.__esModule = true;
var express_1 = require("express");
var passport_1 = require("passport");
var PolicyExpressController_1 = require("../controllers/PolicyExpressController");
var Authorization_1 = require("../middlewares/Authorization");
var route = express_1.Router();
exports["default"] = (function (app) {
    var PolicyController = new PolicyExpressController_1["default"]();
    app.use('/policy', passport_1["default"].authenticate('jwt', { session: true }), Authorization_1.AuthorizeRole(['cms-admin', 'lms-admin', 'provider']), route);
    route.post('/', Authorization_1.ValidateCameraAccess, function (req, res, next) { return PolicyController.addPolicy(req, res, next); });
    route.get('/:userId', function (req, res, next) { return PolicyController.getPolicy(req, res, next); });
    route["delete"]('/', Authorization_1.ValidateCameraAccess, function (req, res, next) { return PolicyController.removePolicy(req, res, next); });
});
