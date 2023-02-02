"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var sequelize_1 = require("sequelize");
var PolicyRepo = /** @class */ (function () {
    function PolicyRepo() {
    }
    PolicyRepo.prototype.addPolicy = function (policyData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.policyModel.create(policyData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PolicyRepo.prototype.findPolicy = function (userId, cameraId) {
        return __awaiter(this, void 0, void 0, function () {
            var policy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.policyModel.findOne({
                            where: {
                                userId: userId,
                                cameraId: cameraId
                            }
                        })];
                    case 1:
                        policy = _a.sent();
                        if (!policy) {
                            throw new Error();
                        }
                        return [2 /*return*/, policy];
                }
            });
        });
    };
    PolicyRepo.prototype.findPolicyByConstraints = function (userId, cameraId, accessType) {
        return __awaiter(this, void 0, void 0, function () {
            var policy;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.policyModel.findOne({
                            where: {
                                userId: userId,
                                cameraId: cameraId,
                                constraints: (_a = {},
                                    _a[sequelize_1.Op.contains] = {
                                        accessType: [accessType]
                                    },
                                    _a)
                            }
                        })];
                    case 1:
                        policy = _b.sent();
                        return [2 /*return*/, policy];
                }
            });
        });
    };
    PolicyRepo.prototype.findAllUserPolicy = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var policies;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.policyModel.findAll({
                            where: {
                                userId: userId
                            }
                        })];
                    case 1:
                        policies = _a.sent();
                        if (!policies) {
                            throw new Error();
                        }
                        return [2 /*return*/, policies];
                }
            });
        });
    };
    PolicyRepo.prototype.removePolicy = function (userId, cameraId) {
        return __awaiter(this, void 0, void 0, function () {
            var deleted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.policyModel.destroy({
                            where: {
                                userId: userId,
                                cameraId: cameraId
                            }
                        })];
                    case 1:
                        deleted = _a.sent();
                        if (!deleted) {
                            throw new Error();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PolicyRepo.prototype.removePolicyByCamera = function (cameraId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.policyModel.destroy({
                            where: {
                                cameraId: cameraId
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        typedi_1.Inject('PolicyModel')
    ], PolicyRepo.prototype, "policyModel");
    PolicyRepo = __decorate([
        typedi_1.Service()
    ], PolicyRepo);
    return PolicyRepo;
}());
exports["default"] = PolicyRepo;
