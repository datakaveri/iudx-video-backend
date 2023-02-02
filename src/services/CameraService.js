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
var Logger_1 = require("../common/Logger");
var Error_1 = require("../common/Error");
var UUID_1 = require("../common/UUID");
var config_1 = require("../config");
var CameraService = /** @class */ (function () {
    function CameraService(utilityService, cameraRepo, streamRepo, policyRepo, streamService) {
        this.utilityService = utilityService;
        this.cameraRepo = cameraRepo;
        this.streamRepo = streamRepo;
        this.policyRepo = policyRepo;
        this.streamService = streamService;
    }
    CameraService.prototype.register = function (userId, cameraData) {
        return __awaiter(this, void 0, void 0, function () {
            var namespace, cameraId, isDuplicateCamera, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        namespace = config_1["default"].host.type + 'Camera';
                        cameraId = new UUID_1["default"]().generateUUIDv5(namespace);
                        return [4 /*yield*/, this.cameraRepo.findCamera(cameraData)];
                    case 1:
                        isDuplicateCamera = _a.sent();
                        if (isDuplicateCamera) {
                            return [2 /*return*/, null];
                        }
                        cameraData = __assign({ cameraId: cameraId, userId: userId, serverId: config_1["default"].serverId }, cameraData);
                        return [4 /*yield*/, this.cameraRepo.registerCamera(cameraData)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, cameraData];
                    case 3:
                        e_1 = _a.sent();
                        Logger_1["default"].error(e_1);
                        throw new Error_1["default"]('Error Registering the data');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CameraService.prototype.findOne = function (cameraId) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.cameraRepo.findCamera({ cameraId: cameraId })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_2 = _a.sent();
                        Logger_1["default"].error(e_2);
                        throw new Error_1["default"]('Error fetching the data');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CameraService.prototype.listAssociatedStreams = function (cameraId) {
        return __awaiter(this, void 0, void 0, function () {
            var fields, streams, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        fields = [
                            'streamId',
                            'cameraId',
                            'provenanceStreamId',
                            'sourceServerId',
                            'destinationServerId',
                            'streamName',
                            'streamUrl',
                            'streamType',
                            'type',
                            'isPublic',
                        ];
                        return [4 /*yield*/, this.streamRepo.findAllStreams({ cameraId: cameraId }, fields)];
                    case 1:
                        streams = _a.sent();
                        if (streams.length === 0) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, streams];
                    case 2:
                        e_3 = _a.sent();
                        Logger_1["default"].error(e_3);
                        throw new Error_1["default"]('Error fetching the data');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CameraService.prototype.findAll = function (userId, role, page, size, serverId) {
        return __awaiter(this, void 0, void 0, function () {
            var fields, _a, limit, offset, data, _b, cameras, e_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 9, , 10]);
                        fields = ['cameraId', 'serverId', 'cameraName', 'cameraNum', 'cameraType', 'cameraUsage', 'cameraOrientation', 'city', 'junction', 'location'];
                        _a = this.utilityService.getPagination(page, size), limit = _a.limit, offset = _a.offset;
                        data = void 0;
                        _b = role;
                        switch (_b) {
                            case 'cms-admin': return [3 /*break*/, 1];
                            case 'lms-admin': return [3 /*break*/, 3];
                            case 'provider': return [3 /*break*/, 3];
                            case 'consumer': return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 1: return [4 /*yield*/, this.cameraRepo.listAllCameras(limit, offset, __assign({}, (serverId && { serverId: serverId })), fields)];
                    case 2:
                        data = _c.sent();
                        return [3 /*break*/, 8];
                    case 3: return [4 /*yield*/, this.cameraRepo.listAllCameras(limit, offset, __assign({ userId: userId }, (serverId && { serverId: serverId })), fields)];
                    case 4:
                        data = _c.sent();
                        return [3 /*break*/, 8];
                    case 5: return [4 /*yield*/, this.cameraRepo.listCamerasBasedOnUserPolicy(limit, offset, userId, __assign({}, (serverId && { serverId: serverId })), fields)];
                    case 6:
                        data = _c.sent();
                        return [3 /*break*/, 8];
                    case 7: throw new Error();
                    case 8:
                        cameras = this.utilityService.getPagingData(data, page, limit);
                        return [2 /*return*/, cameras];
                    case 9:
                        e_4 = _c.sent();
                        Logger_1["default"].error(e_4);
                        throw new Error_1["default"]('Error fetching the data');
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    CameraService.prototype.update = function (cameraId, cameraData) {
        return __awaiter(this, void 0, void 0, function () {
            var fields, _a, updated, result, e_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        fields = [
                            'cameraId',
                            'cameraName',
                            'cameraNum',
                            'cameraType',
                            'cameraUsage',
                            'cameraOrientation',
                            'city',
                            'junction',
                        ];
                        return [4 /*yield*/, this.cameraRepo.updateCamera(cameraData, { cameraId: cameraId }, fields)];
                    case 1:
                        _a = _b.sent(), updated = _a[0], result = _a[1];
                        if (!updated) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, result];
                    case 2:
                        e_5 = _b.sent();
                        Logger_1["default"].error(e_5);
                        throw new Error_1["default"]('Error updating the data');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CameraService.prototype["delete"] = function (cameraId) {
        return __awaiter(this, void 0, void 0, function () {
            var streams, _i, streams_1, stream, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.streamRepo.findAllStreams({ cameraId: cameraId, type: 'camera' })];
                    case 1:
                        streams = _a.sent();
                        _i = 0, streams_1 = streams;
                        _a.label = 2;
                    case 2:
                        if (!(_i < streams_1.length)) return [3 /*break*/, 5];
                        stream = streams_1[_i];
                        return [4 /*yield*/, this.streamService.deleteAssociatedStreams(stream.streamId)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [4 /*yield*/, this.policyRepo.removePolicyByCamera(cameraId)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.cameraRepo.deleteCamera({ cameraId: cameraId })];
                    case 7: return [2 /*return*/, _a.sent()];
                    case 8:
                        e_6 = _a.sent();
                        Logger_1["default"].error(e_6);
                        throw new Error_1["default"]('Error deleting the data');
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    CameraService = __decorate([
        typedi_1.Service()
    ], CameraService);
    return CameraService;
}());
exports["default"] = CameraService;
