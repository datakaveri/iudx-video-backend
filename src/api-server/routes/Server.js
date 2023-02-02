"use strict";
exports.__esModule = true;
var express_1 = require("express");
var passport_1 = require("passport");
var ServerExpressController_1 = require("../controllers/ServerExpressController");
var Authorization_1 = require("../middlewares/Authorization");
var route = express_1.Router();
exports["default"] = (function (app) {
    var ServerController = new ServerExpressController_1["default"]();
    app.use('/server', passport_1["default"].authenticate('jwt', { session: true }), route);
    route.post('/', Authorization_1.AuthorizeRole(['lms-admin']), function (req, res, next) { return ServerController.registerServer(req, res, next); });
    route.get('/', function (req, res, next) { return ServerController.listAllServers(req, res, next); });
});
