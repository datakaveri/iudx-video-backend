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
var Logger_1 = require("../../common/Logger");
var Constants_1 = require("../../common/Constants");
var Kafka_1 = require("../../managers/Kafka");
var StreamRepo_1 = require("../../repositories/StreamRepo");
var KafkaUtilService_1 = require("../../services/KafkaUtilService");
var StreamKafkaController = /** @class */ (function () {
    function StreamKafkaController() {
        this.kafkaManager = typedi_1.Container.get(Kafka_1["default"]);
        this.streamRepo = typedi_1.Container.get(StreamRepo_1["default"]);
        this.kafkaUtilService = typedi_1.Container.get(KafkaUtilService_1["default"]);
    }
    StreamKafkaController.prototype.register = function (serverId, userId, streamData) {
        return __awaiter(this, void 0, void 0, function () {
            var topic, message, messageId, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        topic = serverId + '.downstream';
                        message = { taskIdentifier: 'registerStream', data: { userId: userId, streamData: streamData } };
                        return [4 /*yield*/, this.kafkaManager.publish(topic, message, Constants_1.KafkaMessageType.HTTP_REQUEST)];
                    case 1:
                        messageId = (_a.sent()).messageId;
                        return [4 /*yield*/, this.kafkaUtilService.getKafkaMessageResponse(messageId)];
                    case 2:
                        result = _a.sent();
                        if (!result) return [3 /*break*/, 5];
                        result['streamData'].isPublishing = true;
                        result['rtmpStreamData'].isActive = true;
                        result['rtmpStreamData'].isStable = true;
                        return [4 /*yield*/, this.streamRepo.registerStream(result['streamData'])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.streamRepo.registerStream(result['rtmpStreamData'])];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, result];
                    case 6:
                        err_1 = _a.sent();
                        Logger_1["default"].error('error: %o', err_1);
                        throw err_1;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    StreamKafkaController.prototype["delete"] = function (serverId, streamId) {
        return __awaiter(this, void 0, void 0, function () {
            var topic, message, messageId, result, streams, _i, streams_1, stream, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        topic = serverId + '.downstream';
                        message = { taskIdentifier: 'deleteStream', data: { streamId: streamId } };
                        return [4 /*yield*/, this.kafkaManager.publish(topic, message, Constants_1.KafkaMessageType.HTTP_REQUEST)];
                    case 1:
                        messageId = (_a.sent()).messageId;
                        return [4 /*yield*/, this.kafkaUtilService.getKafkaMessageResponse(messageId)];
                    case 2:
                        result = _a.sent();
                        if (!result) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.streamRepo.getAllAssociatedStreams(streamId)];
                    case 3:
                        streams = _a.sent();
                        _i = 0, streams_1 = streams;
                        _a.label = 4;
                    case 4:
                        if (!(_i < streams_1.length)) return [3 /*break*/, 7];
                        stream = streams_1[_i];
                        return [4 /*yield*/, this.streamRepo.deleteStream({ streamId: stream.streamId })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/, result];
                    case 8:
                        err_2 = _a.sent();
                        Logger_1["default"].error('error: %o', err_2);
                        throw err_2;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    StreamKafkaController.prototype.streamRequest = function (serverId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var topic, message, messageId, result, isExistingStream, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        topic = serverId + '.downstream';
                        message = { taskIdentifier: 'requestStream', data: data };
                        return [4 /*yield*/, this.kafkaManager.publish(topic, message, Constants_1.KafkaMessageType.HTTP_REQUEST)];
                    case 1:
                        messageId = (_a.sent()).messageId;
                        return [4 /*yield*/, this.kafkaUtilService.getKafkaMessageResponse(messageId)];
                    case 2:
                        result = _a.sent();
                        isExistingStream = data.isExistingStream;
                        if (!(!isExistingStream && result)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.streamRepo.registerStream(result)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!result) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.streamRepo.updateStream({ streamId: result.streamId, destinationServerId: result.sourceServerId }, { isPublishing: true })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.streamRepo.updateStream({ streamId: result.streamId, destinationServerId: result.destinationServerId }, { isActive: true, isStable: true })];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_3 = _a.sent();
                        Logger_1["default"].error('error: %o', err_3);
                        throw err_3;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return StreamKafkaController;
}());
exports["default"] = StreamKafkaController;
