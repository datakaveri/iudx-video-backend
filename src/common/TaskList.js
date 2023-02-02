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
var typedi_1 = require("typedi");
var config_1 = require("../config");
var Logger_1 = require("./Logger");
var Constants_1 = require("../common/Constants");
var Kafka_1 = require("../managers/Kafka");
var CameraService_1 = require("../services/CameraService");
var StreamService_1 = require("../services/StreamService");
var AuthService_1 = require("../services/AuthService");
var UserRepo_1 = require("../repositories/UserRepo");
var StreamRepo_1 = require("../repositories/StreamRepo");
var FfmpegService_1 = require("../services/FfmpegService");
var ServerRepo_1 = require("../repositories/ServerRepo");
exports.taskList = {
    // Auth related tasks
    signUp: function (payload, helpers) { return __awaiter(void 0, void 0, void 0, function () {
        var userRepo, kafkaManager, topic, messageId, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    userRepo = typedi_1.Container.get(UserRepo_1["default"]);
                    kafkaManager = typedi_1.Container.get(Kafka_1["default"]);
                    topic = config_1["default"].serverId + '.upstream';
                    messageId = payload.messageId, data = payload.data;
                    return [4 /*yield*/, userRepo.createUser(data)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, kafkaManager.publish(topic, { data: { created: true } }, Constants_1.KafkaMessageType.HTTP_RESPONSE, messageId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    Logger_1["default"].error('error: %o', err_1);
                    console.log(err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    verifyUser: function (payload, helpers) { return __awaiter(void 0, void 0, void 0, function () {
        var userRepo, kafkaManager, topic, messageId, data, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    userRepo = typedi_1.Container.get(UserRepo_1["default"]);
                    kafkaManager = typedi_1.Container.get(Kafka_1["default"]);
                    topic = config_1["default"].serverId + '.upstream';
                    messageId = payload.messageId, data = payload.data;
                    return [4 /*yield*/, userRepo.updateUser({ email: data.email }, { verified: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, kafkaManager.publish(topic, { data: { updated: true } }, Constants_1.KafkaMessageType.HTTP_RESPONSE, messageId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    Logger_1["default"].error('error: %o', err_2);
                    console.log(err_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    approveUser: function (payload, helpers) { return __awaiter(void 0, void 0, void 0, function () {
        var authService, kafkaManager, topic, messageId, data, result, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    authService = typedi_1.Container.get(AuthService_1["default"]);
                    kafkaManager = typedi_1.Container.get(Kafka_1["default"]);
                    topic = config_1["default"].serverId + '.upstream';
                    messageId = payload.messageId, data = payload.data;
                    return [4 /*yield*/, authService.approve(data.email, data.role)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, kafkaManager.publish(topic, { data: result }, Constants_1.KafkaMessageType.HTTP_RESPONSE, messageId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    Logger_1["default"].error('error: %o', err_3);
                    console.log(err_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // Camera related tasks
    registerCamera: function (payload, helpers) { return __awaiter(void 0, void 0, void 0, function () {
        var cameraService, kafkaManager, topic, messageId, data, result, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    cameraService = typedi_1.Container.get(CameraService_1["default"]);
                    kafkaManager = typedi_1.Container.get(Kafka_1["default"]);
                    topic = config_1["default"].serverId + '.upstream';
                    messageId = payload.messageId, data = payload.data;
                    return [4 /*yield*/, cameraService.register(data.userId, data.cameraData)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, kafkaManager.publish(topic, { data: result }, Constants_1.KafkaMessageType.HTTP_RESPONSE, messageId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_4 = _a.sent();
                    Logger_1["default"].error('error: %o', err_4);
                    console.log(err_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    updateCamera: function (payload, helpers) { return __awaiter(void 0, void 0, void 0, function () {
        var cameraService, kafkaManager, topic, messageId, data, result, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    cameraService = typedi_1.Container.get(CameraService_1["default"]);
                    kafkaManager = typedi_1.Container.get(Kafka_1["default"]);
                    topic = config_1["default"].serverId + '.upstream';
                    messageId = payload.messageId, data = payload.data;
                    return [4 /*yield*/, cameraService.update(data.cameraId, data.cameraData)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, kafkaManager.publish(topic, { data: result }, Constants_1.KafkaMessageType.HTTP_RESPONSE, messageId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_5 = _a.sent();
                    Logger_1["default"].error('error: %o', err_5);
                    console.log(err_5);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    deleteCamera: function (payload, helpers) { return __awaiter(void 0, void 0, void 0, function () {
        var cameraService, kafkaManager, topic, messageId, data, result, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    cameraService = typedi_1.Container.get(CameraService_1["default"]);
                    kafkaManager = typedi_1.Container.get(Kafka_1["default"]);
                    topic = config_1["default"].serverId + '.upstream';
                    messageId = payload.messageId, data = payload.data;
                    return [4 /*yield*/, cameraService["delete"](data.cameraId)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, kafkaManager.publish(topic, { data: result }, Constants_1.KafkaMessageType.HTTP_RESPONSE, messageId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_6 = _a.sent();
                    Logger_1["default"].error('error: %o', err_6);
                    console.log(err_6);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    // Stream related tasks
    registerStream: function (payload, helpers) { return __awaiter(void 0, void 0, void 0, function () {
        var streamService, kafkaManager, topic, messageId, data, result, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    streamService = typedi_1.Container.get(StreamService_1["default"]);
                    kafkaManager = typedi_1.Container.get(Kafka_1["default"]);
                    topic = config_1["default"].serverId + '.upstream';
                    messageId = payload.messageId, data = payload.data;
                    return [4 /*yield*/, streamService.register(data.userId, data.streamData)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, kafkaManager.publish(topic, { data: result }, Constants_1.KafkaMessageType.HTTP_RESPONSE, messageId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_7 = _a.sent();
                    Logger_1["default"].error('error: %o', err_7);
                    console.log(err_7);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    deleteStream: function (payload, helpers) { return __awaiter(void 0, void 0, void 0, function () {
        var streamService, kafkaManager, topic, messageId, data, result, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    streamService = typedi_1.Container.get(StreamService_1["default"]);
                    kafkaManager = typedi_1.Container.get(Kafka_1["default"]);
                    topic = config_1["default"].serverId + '.upstream';
                    messageId = payload.messageId, data = payload.data;
                    return [4 /*yield*/, streamService["delete"](data.streamId)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, kafkaManager.publish(topic, { data: result }, Constants_1.KafkaMessageType.HTTP_RESPONSE, messageId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_8 = _a.sent();
                    Logger_1["default"].error('error: %o', err_8);
                    console.log(err_8);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    updateStreamData: function (payload, helpers) { return __awaiter(void 0, void 0, void 0, function () {
        var streamRepo, data, err_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    streamRepo = typedi_1.Container.get(StreamRepo_1["default"]);
                    data = payload.data;
                    return [4 /*yield*/, streamRepo.updateStream(data.query, data.streamData)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_9 = _a.sent();
                    Logger_1["default"].error('error: %o', err_9);
                    console.log(err_9);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    requestStream: function (payload, helpers) { return __awaiter(void 0, void 0, void 0, function () {
        var streamService, kafkaManager, topic, messageId, data, cmsStreamData, err_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    streamService = typedi_1.Container.get(StreamService_1["default"]);
                    kafkaManager = typedi_1.Container.get(Kafka_1["default"]);
                    topic = config_1["default"].serverId + '.upstream';
                    messageId = payload.messageId, data = payload.data;
                    return [4 /*yield*/, streamService.publishStreamToCloud(data.cmsServerId, data.streamData, data.isExistingStream)];
                case 1:
                    cmsStreamData = _a.sent();
                    return [4 /*yield*/, kafkaManager.publish(topic, { data: cmsStreamData }, Constants_1.KafkaMessageType.HTTP_RESPONSE, messageId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_10 = _a.sent();
                    Logger_1["default"].error('error: %o', err_10);
                    console.log(err_10);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    unpublishStream: function (payload, helpers) { return __awaiter(void 0, void 0, void 0, function () {
        var streamRepo, ffmpegService, data, queryData, stream, isProcessRunning, err_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    streamRepo = typedi_1.Container.get(StreamRepo_1["default"]);
                    ffmpegService = typedi_1.Container.get(FfmpegService_1["default"]);
                    data = payload.data;
                    queryData = { streamId: data.streamId, destinationServerId: data.destinationServerId };
                    return [4 /*yield*/, streamRepo.findStream(queryData)];
                case 1:
                    stream = _a.sent();
                    if (!stream.processId) return [3 /*break*/, 4];
                    return [4 /*yield*/, ffmpegService.isProcessRunning(stream.processId)];
                case 2:
                    isProcessRunning = _a.sent();
                    if (!isProcessRunning) return [3 /*break*/, 4];
                    return [4 /*yield*/, ffmpegService.killProcess(stream.processId)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, streamRepo.updateStream(queryData, { isActive: false, isStable: false, lastActive: Date.now(), processId: null })];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_11 = _a.sent();
                    Logger_1["default"].error('error: %o', err_11);
                    console.log(err_11);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); },
    heartbeat: function (payload, helpers) { return __awaiter(void 0, void 0, void 0, function () {
        var serverRepo, data, err_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    serverRepo = typedi_1.Container.get(ServerRepo_1["default"]);
                    data = payload.data;
                    Logger_1["default"].info("Ping received from " + data.serverId);
                    return [4 /*yield*/, serverRepo.updateServerData({ serverId: data.serverId }, { lastPingTime: data.pingTime })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_12 = _a.sent();
                    Logger_1["default"].error('error: %o', err_12);
                    console.log(err_12);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
