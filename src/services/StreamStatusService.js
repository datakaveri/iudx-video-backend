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
var got_1 = require("got");
var Logger_1 = require("../common/Logger");
var config_1 = require("../config");
var Error_1 = require("../common/Error");
var Constants_1 = require("../common/Constants");
var StreamStatusService = /** @class */ (function () {
    function StreamStatusService(ffmpegService, streamRepo, utilityService, streamReviveService, kafkaManager) {
        this.ffmpegService = ffmpegService;
        this.streamRepo = streamRepo;
        this.utilityService = utilityService;
        this.streamReviveService = streamReviveService;
        this.kafkaManager = kafkaManager;
    }
    StreamStatusService.prototype.getStatus = function (streamId) {
        return __awaiter(this, void 0, void 0, function () {
            var streams, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.streamRepo.getAllAssociatedStreams(streamId)];
                    case 1:
                        streams = _a.sent();
                        streams = streams.map(function (stream) {
                            return {
                                streamId: stream.streamId,
                                cameraId: stream.cameraId,
                                provenanceStreamId: stream.provenanceStreamId,
                                streamName: stream.streamName,
                                streamUrl: stream.streamUrl,
                                type: stream.type,
                                isActive: stream.isActive
                            };
                        });
                        return [2 /*return*/, streams];
                    case 2:
                        e_1 = _a.sent();
                        Logger_1["default"].error(e_1);
                        throw new Error_1["default"]('Error Getting the stream status');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StreamStatusService.prototype.updateStatus = function (streamId, destinationServerId, isActive, isStable) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.streamRepo.updateStream({ streamId: streamId, destinationServerId: destinationServerId }, __assign(__assign({ isActive: isActive,
                                isStable: isStable }, (!isActive && { processId: null })), (isActive && { lastActive: Date.now() })))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_2 = _a.sent();
                        Logger_1["default"].error(e_2);
                        throw new Error_1["default"]('Error Updating the stream status');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StreamStatusService.prototype.updateStats = function (stream) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!stream) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.streamRepo.updateStream({ streamId: stream.streamId, destinationServerId: config_1["default"].serverId }, __assign({ totalClients: stream.nClients, activeTime: parseInt(stream.time), bandwidthIn: BigInt(stream.bwIn), bandwidthOut: BigInt(stream.bwOut), bytesIn: BigInt(stream.bytesIn), bytesOut: BigInt(stream.bytesOut) }, (stream.active && {
                                codec: stream.metaVideo.codec + " " + stream.metaVideo.profile + " " + stream.metaVideo.level,
                                resolution: stream.metaVideo.width + "x" + stream.metaVideo.height,
                                frameRate: parseInt(stream.metaVideo.frameRate)
                            })))];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        e_3 = _a.sent();
                        Logger_1["default"].error(e_3);
                        throw new Error_1["default"]('Error Updating the stream stats');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StreamStatusService.prototype.getNginxRtmpStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, streamsStats, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, got_1["default"].get(config_1["default"].rtmpServerConfig.statUrl)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, this.utilityService.parseNginxRtmpStat(response)];
                    case 2:
                        streamsStats = _a.sent();
                        return [2 /*return*/, streamsStats];
                    case 3:
                        err_1 = _a.sent();
                        Logger_1["default"].error(err_1);
                        throw new Error(err_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StreamStatusService.prototype.publishStreamUpdates = function (streamId, destinationServerId) {
        return __awaiter(this, void 0, void 0, function () {
            var streamData, topic, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.streamRepo.findStream({ streamId: streamId, destinationServerId: destinationServerId })];
                    case 1:
                        streamData = _a.sent();
                        topic = config_1["default"].serverId + '.upstream';
                        message = {
                            taskIdentifier: 'updateStreamData',
                            data: { query: { streamId: streamId, destinationServerId: destinationServerId }, streamData: streamData }
                        };
                        return [4 /*yield*/, this.kafkaManager.publish(topic, message, Constants_1.KafkaMessageType.DB_REQUEST)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StreamStatusService.prototype.unpublishIfStreamIdle = function (oldStreamData, newStreamData) {
        return __awaiter(this, void 0, void 0, function () {
            var currentTime, streamToUnpublish, disconnectInterval, topic, lastAccessed, message, message, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (config_1["default"].host.type === 'LMS' || newStreamData.nClients > 0)
                            return [2 /*return*/, false];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        currentTime = Date.now();
                        streamToUnpublish = { streamId: newStreamData.streamId, destinationServerId: config_1["default"].serverId };
                        disconnectInterval = 60000 * config_1["default"].schedulerConfig.statusCheck.streamDisconnectInterval;
                        topic = oldStreamData.sourceServerId + '.downstream';
                        lastAccessed = oldStreamData.lastAccessed;
                        if (!(oldStreamData.totalClients > 0)) return [3 /*break*/, 4];
                        lastAccessed = currentTime;
                        message = { taskIdentifier: 'updateStreamData', data: { query: streamToUnpublish, streamData: { lastAccessed: lastAccessed } } };
                        return [4 /*yield*/, this.kafkaManager.publish(topic, message, Constants_1.KafkaMessageType.DB_REQUEST)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.streamRepo.updateStream(streamToUnpublish, { lastAccessed: lastAccessed })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!(oldStreamData.isActive && currentTime - lastAccessed > disconnectInterval)) return [3 /*break*/, 6];
                        message = { taskIdentifier: 'unpublishStream', data: streamToUnpublish };
                        return [4 /*yield*/, this.kafkaManager.publish(topic, message, Constants_1.KafkaMessageType.HTTP_REQUEST)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 6: return [2 /*return*/, false];
                    case 7:
                        e_4 = _a.sent();
                        Logger_1["default"].error(e_4);
                        throw new Error_1["default"]('Error Unpublishing streams');
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    StreamStatusService.prototype.checkStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var streams, rtmpStreams, _loop_1, this_1, _i, streams_1, stream, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Logger_1["default"].debug("Starting status check for all the available streams");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, this.streamRepo.getStreamsForStatusCheck()];
                    case 2:
                        streams = _a.sent();
                        return [4 /*yield*/, this.getNginxRtmpStats()];
                    case 3:
                        rtmpStreams = _a.sent();
                        _loop_1 = function (stream) {
                            var isActive, statusUpdated, streamRevived, _a, rtmpStream, isUnpublished;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        isActive = false;
                                        statusUpdated = false;
                                        streamRevived = false;
                                        _a = stream.type;
                                        switch (_a) {
                                            case 'camera': return [3 /*break*/, 1];
                                            case 'rtmp': return [3 /*break*/, 3];
                                        }
                                        return [3 /*break*/, 7];
                                    case 1: return [4 /*yield*/, this_1.ffmpegService.isStreamActive(stream.streamUrl)];
                                    case 2:
                                        isActive = _b.sent();
                                        return [3 /*break*/, 8];
                                    case 3:
                                        rtmpStream = rtmpStreams.find(function (streamData) { return streamData.streamId === stream.streamId; });
                                        if (!(rtmpStream && rtmpStream.active)) return [3 /*break*/, 6];
                                        return [4 /*yield*/, this_1.unpublishIfStreamIdle(stream, rtmpStream)];
                                    case 4:
                                        isUnpublished = _b.sent();
                                        isActive = !isUnpublished; // Status will be updated inactive if stream unpublished
                                        return [4 /*yield*/, this_1.updateStats(rtmpStream)];
                                    case 5:
                                        _b.sent();
                                        _b.label = 6;
                                    case 6: return [3 /*break*/, 8];
                                    case 7: throw new Error();
                                    case 8:
                                        if (!(isActive || (isActive !== stream.isActive))) return [3 /*break*/, 10];
                                        return [4 /*yield*/, this_1.updateStatus(stream.streamId, stream.destinationServerId, isActive, isActive)];
                                    case 9:
                                        statusUpdated = (_b.sent())[0];
                                        _b.label = 10;
                                    case 10:
                                        if (!(stream.streamId !== stream.provenanceStreamId && !isActive)) return [3 /*break*/, 12];
                                        return [4 /*yield*/, this_1.streamReviveService.reviveStream(stream)];
                                    case 11:
                                        streamRevived = _b.sent();
                                        _b.label = 12;
                                    case 12:
                                        if (!((statusUpdated || streamRevived) && config_1["default"].host.type === 'LMS' && !config_1["default"].isStandaloneLms)) return [3 /*break*/, 14];
                                        return [4 /*yield*/, this_1.publishStreamUpdates(stream.streamId, stream.destinationServerId)];
                                    case 13:
                                        _b.sent();
                                        _b.label = 14;
                                    case 14: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, streams_1 = streams;
                        _a.label = 4;
                    case 4:
                        if (!(_i < streams_1.length)) return [3 /*break*/, 7];
                        stream = streams_1[_i];
                        return [5 /*yield**/, _loop_1(stream)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_2 = _a.sent();
                        Logger_1["default"].error(err_2);
                        throw new Error_1["default"]('Error checking stream status');
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    StreamStatusService = __decorate([
        typedi_1.Service()
    ], StreamStatusService);
    return StreamStatusService;
}());
exports["default"] = StreamStatusService;
