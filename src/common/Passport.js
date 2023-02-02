"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var passport_1 = require("passport");
var passport_local_1 = require("passport-local");
var passport_jwt_1 = require("passport-jwt");
var passport_custom_1 = require("passport-custom");
var jsonwebtoken_1 = require("jsonwebtoken");
var uuid_1 = require("uuid");
var config_1 = require("../config");
var typedi_1 = require("typedi");
var UserRepo_1 = require("../repositories/UserRepo");
var Utility_1 = require("./Utility");
var AuthKafkaController_1 = require("../kafka/controllers/AuthKafkaController");
var UtilityService = typedi_1["default"].get(Utility_1["default"]);
var privateKey = UtilityService.getPrivateKey();
var authKafkaController = new AuthKafkaController_1["default"]();
passport_1["default"].use('signup', new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) { return __awaiter(void 0, void 0, void 0, function () {
    var verificationCode, userRepo, found, role, userId, userData, serverId, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                verificationCode = UtilityService.generateCode();
                userRepo = typedi_1["default"].get(UserRepo_1["default"]);
                return [4 /*yield*/, userRepo.findUser({ email: email })];
            case 1:
                found = _a.sent();
                if (found) {
                    return [2 /*return*/, done(new Error('User already exists'))];
                }
                role = req.body.role;
                if (!(role === 'consumer' || role === 'provider' || role === 'lms-admin')) {
                    return [2 /*return*/, done(new Error('Invalid role provided in request'))];
                }
                userId = uuid_1.v4();
                userData = { id: userId, name: req.body.name, email: email, password: password, verificationCode: verificationCode, verified: false, role: req.body.role };
                if (role === 'consumer') {
                    userData['approved'] = true;
                }
                serverId = req.query['serverId'];
                if (!serverId) return [3 /*break*/, 3];
                return [4 /*yield*/, authKafkaController.signUp(serverId, userData)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, userRepo.createUser(userData)];
            case 4:
                _a.sent();
                result = { verificationCode: verificationCode };
                if (role === 'lms-admin') {
                    result['userId'] = userId;
                }
                return [2 /*return*/, done(null, result)];
            case 5:
                error_1 = _a.sent();
                done(error_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); }));
passport_1["default"].use('token', new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) { return __awaiter(void 0, void 0, void 0, function () {
    var userRepo, user, validate, payload, token, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                userRepo = typedi_1["default"].get(UserRepo_1["default"]);
                return [4 /*yield*/, userRepo.findUser({ email: email })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, done(null, false, { message: 'User not found' })];
                }
                return [4 /*yield*/, userRepo.validatePassword({ email: email }, password)];
            case 2:
                validate = _a.sent();
                if (!validate) {
                    return [2 /*return*/, done(null, false, { message: 'Wrong Password' })];
                }
                if (!user.verified) {
                    return [2 /*return*/, done(null, false, { message: 'User is not verified' })];
                }
                if (!user.approved) {
                    return [2 /*return*/, done(null, false, { message: 'User registration not approved, contact admin' })];
                }
                payload = { userId: user.id, name: user.name, email: user.email, role: user.role };
                token = jsonwebtoken_1["default"].sign(payload, privateKey, {
                    algorithm: 'ES256',
                    expiresIn: config_1["default"].authConfig.jwtTokenExpiry
                });
                return [2 /*return*/, done(null, { token: token }, { message: 'Logged in Successfully' })];
            case 3:
                error_2 = _a.sent();
                return [2 /*return*/, done(error_2)];
            case 4: return [2 /*return*/];
        }
    });
}); }));
passport_1["default"].use('verify', new passport_custom_1.Strategy(function (req, done) { return __awaiter(void 0, void 0, void 0, function () {
    var code, userRepo, user, serverId, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                code = req.query.verificationCode;
                userRepo = typedi_1["default"].get(UserRepo_1["default"]);
                return [4 /*yield*/, userRepo.findUser({ verificationCode: code })];
            case 1:
                user = _a.sent();
                if (!(user && code === user.verificationCode)) return [3 /*break*/, 5];
                serverId = req.query['serverId'];
                if (!serverId) return [3 /*break*/, 3];
                return [4 /*yield*/, authKafkaController.verifyUser(serverId, { email: user.email })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, userRepo.updateUser({ email: user.email }, { verified: true })];
            case 4:
                _a.sent();
                return [2 /*return*/, done(null, { success: true, message: 'Verification successful' })];
            case 5: return [2 /*return*/, done(null, { success: false, message: 'Wrong verification code provided' })];
            case 6: return [3 /*break*/, 8];
            case 7:
                err_1 = _a.sent();
                return [2 /*return*/, done(err_1)];
            case 8: return [2 /*return*/];
        }
    });
}); }));
passport_1["default"].use(new passport_jwt_1.Strategy({
    secretOrKey: privateKey,
    algorithms: ['ES256'],
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    passReqToCallback: true
}, function (req, user, done) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            req.user = user;
            return [2 /*return*/, done(null, user)];
        }
        catch (error) {
            done(error);
        }
        return [2 /*return*/];
    });
}); }));
passport_1["default"].serializeUser(function (user, done) {
    done(null, user);
});
passport_1["default"].deserializeUser(function (user, done) {
    done(null, user);
});
exports["default"] = passport_1["default"];
