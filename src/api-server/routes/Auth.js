"use strict";
exports.__esModule = true;
var express_1 = require("express");
var passport_1 = require("passport");
var AuthExpressController_1 = require("../controllers/AuthExpressController");
var Authorization_1 = require("../middlewares/Authorization");
var route = express_1.Router();
exports["default"] = (function (app) {
    var AuthController = new AuthExpressController_1["default"]();
    app.use('/auth', route);
    route.post('/signup', AuthController.signUp);
    route.get('/verify', AuthController.verify);
    route.post('/token', AuthController.token);
    route.get('/login', AuthController.login);
    route.get('/logout', AuthController.logout);
    route.get('/rtmp-token-verify', AuthController.rtmpTokenValidate);
    route.post('/approve', passport_1["default"].authenticate('jwt', { session: true }), Authorization_1.AuthorizeRole(['cms-admin']), function (req, res, next) { return AuthController.approve(req, res, next); });
});
