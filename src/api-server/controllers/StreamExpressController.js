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
var Logger_1 = require("../../common/Logger");
var StreamService_1 = require("../../services/StreamService");
var StreamKafkaController_1 = require("../../kafka/controllers/StreamKafkaController");
var StreamExpressController = /** @class */ (function () {
    function StreamExpressController() {
        this.streamService = typedi_1["default"].get(StreamService_1["default"]);
        this.streamKafkaController = new StreamKafkaController_1["default"]();
    }
    StreamExpressController.prototype.register = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, params, serverId, result, response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.user['userId'];
                        params = req.body;
                        serverId = req.query['serverId'];
                        console.log(serverId);
                        Logger_1["default"].debug('Calling Register Stream endpoint with body: %o', params);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!serverId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.streamKafkaController.register(serverId, userId, params)];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.streamService.register(userId, params)];
                    case 4:
                        result = _a.sent();
                        console.log(result);
                        _a.label = 5;
                    case 5:
                        if (result) {
                            result = __assign({ streamId: result.streamData.streamId }, params);
                        }
                        response = {
                            type: result ? 201 : 400,
                            title: result ? 'Success' : 'Bad Request',
                            result: result ? result : 'Camera Not Registered | Stream Already Registered | Request Timeout'
                        };
                        return [2 /*return*/, res.status(response.type).json(response)];
                    case 6:
                        e_1 = _a.sent();
                        Logger_1["default"].error('error: %o', e_1);
                        return [2 /*return*/, next(e_1)];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    StreamExpressController.prototype.findOne = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var streamId, result, response, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        streamId = req.params.streamId;
                        Logger_1["default"].debug('Calling Find one Stream endpoint of stream id: %s', streamId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.streamService.findOne(streamId)];
                    case 2:
                        result = _a.sent();
                        response = {
                            type: result ? 200 : 404,
                            title: result ? 'Success' : 'Not Found',
                            result: result ? result : 'Stream Not Found'
                        };
                        return [2 /*return*/, res.status(response.type).json(response)];
                    case 3:
                        e_2 = _a.sent();
                        Logger_1["default"].error('error: %o', e_2);
                        return [2 /*return*/, next(e_2)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StreamExpressController.prototype.findAll = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var page, size, cameraId, result, response, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        page = +req.query.page;
                        size = +req.query.size;
                        cameraId = req.query.cameraId || null;
                        Logger_1["default"].debug('Calling Find all Stream endpoint');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.streamService.findAll(page, size, cameraId)];
                    case 2:
                        result = _a.sent();
                        response = {
                            type: 200,
                            title: 'Success',
                            results: result
                        };
                        return [2 /*return*/, res.status(response.type).json(response)];
                    case 3:
                        e_3 = _a.sent();
                        Logger_1["default"].error('error: %o', e_3);
                        return [2 /*return*/, next(e_3)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StreamExpressController.prototype["delete"] = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var streamId, serverId, result, response, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        streamId = req.params.streamId;
                        serverId = req.query['serverId'];
                        Logger_1["default"].debug('Calling Delete Stream endpoint of stream id: %s', streamId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!serverId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.streamKafkaController["delete"](serverId, streamId)];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.streamService["delete"](streamId)];
                    case 4:
                        result = _a.sent();
                        _a.label = 5;
                    case 5:
                        response = {
                            type: result ? 200 : 404,
                            title: result ? 'Success' : 'Not Found',
                            detail: result ? 'Stream deleted' : 'Stream Not Found | Request Timeout'
                        };
                        return [2 /*return*/, res.status(response.type).send(response)];
                    case 6:
                        e_4 = _a.sent();
                        Logger_1["default"].error('error: %o', e_4);
                        return [2 /*return*/, next(e_4)];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    StreamExpressController.prototype.getStatus = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var streamId, result, response, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        streamId = req.params.streamId;
                        Logger_1["default"].debug('Calling Stream status endpoint of stream id: %s', streamId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.streamService.getStatus(streamId)];
                    case 2:
                        result = _a.sent();
                        response = {
                            type: 200,
                            title: 'Success',
                            results: result
                        };
                        return [2 /*return*/, res.status(response.type).send(response)];
                    case 3:
                        e_5 = _a.sent();
                        Logger_1["default"].error('error: %o', e_5);
                        return [2 /*return*/, next(e_5)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StreamExpressController.prototype.streamRequest = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var streamId, requestType, data, response, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        streamId = req.params.streamId;
                        requestType = req.query.type || 'local';
                        console.log("Gopal Goyal");
                        Logger_1["default"].debug('Calling Stream Request endpoint of stream id: %s', streamId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.streamService.streamRequest(streamId, requestType)];
                    case 2:
                        data = _a.sent();
                        console.log(data);
                        response = {
                            type: 200,
                            title: 'Success',
                            data: data.apiResponse
                        };
                        if (!(!data.apiResponse.isPublishing && requestType === 'cloud')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.streamKafkaController.streamRequest(data.kafkaRequestData.serverId, data.kafkaRequestData.data)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, res.status(200).send(response)];
                    case 5:
                        e_6 = _a.sent();
                        Logger_1["default"].error('error: %o', e_6);
                        return [2 /*return*/, next(e_6)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return StreamExpressController;
}());
exports["default"] = StreamExpressController;
