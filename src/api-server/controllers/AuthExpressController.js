"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var typedi_1 = require("typedi");
var passport_1 = require("passport");
var Logger_1 = require("../../common/Logger");
var AuthService_1 = require("../../services/AuthService");
var AuthKafkaController_1 = require("../../kafka/controllers/AuthKafkaController");
var AuthExpressController = /** @class */ (function () {
    function AuthExpressController() {
        this.authService = typedi_1.Container.get(AuthService_1["default"]);
        this.authKafkaController = new AuthKafkaController_1["default"]();
    }
    AuthExpressController.prototype.signUp = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                Logger_1["default"].debug('Calling Sign-Up endpoint with body: %o', req.body);
                try {
                    passport_1["default"].authenticate('signup', function (err, result) { return __awaiter(_this, void 0, void 0, function () {
                        var error, response;
                        return __generator(this, function (_a) {
                            try {
                                if (err) {
                                    return [2 /*return*/, next(err)];
                                }
                                else if (!result.verificationCode) {
                                    error = new Error('An error occurred.');
                                    return [2 /*return*/, next(error)];
                                }
                                response = __assign(__assign({}, result.userId && { userId: result.userId }), { message: 'User account created, please verify your email' });
                                return [2 /*return*/, res.status(201).json(response)];
                            }
                            catch (error) {
                                return [2 /*return*/, next(error)];
                            }
                            return [2 /*return*/];
                        });
                    }); })(req, res, next);
                }
                catch (e) {
                    Logger_1["default"].error('error: %o', e);
                    return [2 /*return*/, next(e)];
                }
                return [2 /*return*/];
            });
        });
    };
    AuthExpressController.prototype.verify = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                Logger_1["default"].debug('Calling Verify endpoint');
                try {
                    passport_1["default"].authenticate('verify', function (err, result) {
                        try {
                            if (err) {
                                return next(err);
                            }
                            else if (!result) {
                                var error = new Error('An error occurred.');
                                return next(error);
                            }
                            if (!result.success) {
                                return res.status(400).json(result);
                            }
                            return res.status(200).json(result);
                        }
                        catch (error) {
                            return next(error);
                        }
                    })(req, res, next);
                }
                catch (e) {
                    Logger_1["default"].error('error: %o', e);
                    return [2 /*return*/, next(e)];
                }
                return [2 /*return*/];
            });
        });
    };
    AuthExpressController.prototype.token = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                Logger_1["default"].debug('Calling Token endpoint with body: %o', req.body);
                try {
                    passport_1["default"].authenticate('token', function (err, token, message) {
                        try {
                            if (err) {
                                return next(err);
                            }
                            else if (!token) {
                                var error = new Error(message.message);
                                return next(error);
                            }
                            return res.json(token);
                        }
                        catch (error) {
                            return next(error);
                        }
                    })(req, res, next);
                }
                catch (e) {
                    Logger_1["default"].error('error: %o', e);
                    return [2 /*return*/, next(e)];
                }
                return [2 /*return*/];
            });
        });
    };
    AuthExpressController.prototype.login = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                Logger_1["default"].debug('Calling Login endpoint');
                try {
                    passport_1["default"].authenticate('jwt', function (err, user) {
                        try {
                            if (err) {
                                return next(err);
                            }
                            else if (!user) {
                                var error = new Error('Invalid token provided');
                                return next(error);
                            }
                            req.login(user, { session: true }, function (error) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    if (error)
                                        return [2 /*return*/, next(error)];
                                    return [2 /*return*/, res.json(user)];
                                });
                            }); });
                        }
                        catch (error) {
                            return next(error);
                        }
                    })(req, res, next);
                }
                catch (e) {
                    Logger_1["default"].error('error: %o', e);
                    return [2 /*return*/, next(e)];
                }
                return [2 /*return*/];
            });
        });
    };
    AuthExpressController.prototype.logout = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                Logger_1["default"].debug('Calling Logout endpoint');
                try {
                    // @ts-ignore: arguments 1-2
                    req.logOut();
                    return [2 /*return*/, res.status(200).send()];
                }
                catch (e) {
                    Logger_1["default"].error('error: %o', e);
                    return [2 /*return*/, next(e)];
                }
                return [2 /*return*/];
            });
        });
    };
    AuthExpressController.prototype.rtmpTokenValidate = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                Logger_1["default"].debug('Calling rtmp token validate endpoint');
                try {
                    passport_1["default"].authenticate('jwt', function (err, user) {
                        try {
                            if (err) {
                                return next(err);
                            }
                            else if (!user) {
                                var error = new Error('Invalid token provided');
                                return next(error);
                            }
                            return res.status(201).send();
                        }
                        catch (error) {
                            return next(error);
                        }
                    })(req, res, next);
                }
                catch (e) {
                    Logger_1["default"].error('error: %o', e);
                    return [2 /*return*/, next(e)];
                }
                return [2 /*return*/];
            });
        });
    };
    AuthExpressController.prototype.approve = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var serverId, response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1["default"].debug('Calling user approval endpoint');
                        serverId = req.query['serverId'];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!serverId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.authKafkaController.approveUser(serverId, req.body.email, req.body.role)];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.authService.approve(req.body.email, req.body.role)];
                    case 4:
                        response = _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, res.status(200).send(response)];
                    case 6:
                        e_1 = _a.sent();
                        Logger_1["default"].error('error: %o', e_1);
                        return [2 /*return*/, next(e_1)];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return AuthExpressController;
}());
exports["default"] = AuthExpressController;
