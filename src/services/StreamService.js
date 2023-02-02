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
var axios_1 = require("axios");
var config_1 = require("../config");
var Logger_1 = require("../common/Logger");
var Error_1 = require("../common/Error");
var UUID_1 = require("../common/UUID");
var Constants_1 = require("../common/Constants");
var StreamService = /** @class */ (function () {
    function StreamService(utilityService, streamRepo, cameraRepo, processService, ffmpegService, streamStatusService, serverRepo, kafkaManager) {
        this.utilityService = utilityService;
        this.streamRepo = streamRepo;
        this.cameraRepo = cameraRepo;
        this.processService = processService;
        this.ffmpegService = ffmpegService;
        this.streamStatusService = streamStatusService;
        this.serverRepo = serverRepo;
        this.kafkaManager = kafkaManager;
    }
    StreamService.prototype.publishRegisteredStreams = function (streamData) {
        return __awaiter(this, void 0, void 0, function () {
            var namespace, streamId, rtmpStreamUrl, rtmpStreamData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        namespace = config_1["default"].host.type + 'Stream';
                        streamId = new UUID_1["default"]().generateUUIDv5(namespace);
                        rtmpStreamUrl = config_1["default"].rtmpServerConfig.serverUrl + "/" + streamId + "?token=" + config_1["default"].rtmpServerConfig.password;
                        rtmpStreamData = {
                            streamId: streamId,
                            cameraId: streamData['cameraId'],
                            userId: streamData['userId'],
                            provenanceStreamId: streamData['streamId'],
                            sourceServerId: config_1["default"].serverId,
                            destinationServerId: config_1["default"].serverId,
                            streamName: 'Local Stream',
                            streamUrl: rtmpStreamUrl,
                            streamType: 'RTMP',
                            type: 'rtmp',
                            isPublic: streamData['isPublic']
                        };
                        return [4 /*yield*/, this.streamRepo.registerStream(rtmpStreamData)];
                    case 1:
                        _a.sent();
                        this.processService.addStreamProcess(streamData['streamId'], streamId, rtmpStreamData.destinationServerId, rtmpStreamData.destinationServerId, streamData['streamUrl'], rtmpStreamUrl);
                        return [2 /*return*/, rtmpStreamData];
                }
            });
        });
    };
    StreamService.prototype.register = function (userId, streamData) {
        return __awaiter(this, void 0, void 0, function () {
            var namespace, streamId, isDuplicateStream, camera, rtmpStreamData, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        namespace = config_1["default"].host.type + 'Stream';
                        streamId = new UUID_1["default"]().generateUUIDv5(namespace);
                        return [4 /*yield*/, this.streamRepo.findStream(streamData)];
                    case 1:
                        isDuplicateStream = _a.sent();
                        return [4 /*yield*/, this.cameraRepo.findCamera({ cameraId: streamData['cameraId'] })];
                    case 2:
                        camera = _a.sent();
                        if (!camera || isDuplicateStream) {
                            return [2 /*return*/, null];
                        }
                        streamData = __assign({ streamId: streamId,
                            userId: userId, provenanceStreamId: streamId, sourceServerId: config_1["default"].serverId, destinationServerId: config_1["default"].serverId }, streamData);
                        return [4 /*yield*/, this.streamRepo.registerStream(streamData)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.publishRegisteredStreams(streamData)];
                    case 4:
                        rtmpStreamData = _a.sent();
                        return [2 /*return*/, { streamData: streamData, rtmpStreamData: rtmpStreamData }];
                    case 5:
                        e_1 = _a.sent();
                        Logger_1["default"].error(e_1);
                        throw new Error_1["default"]('Error Registering the data');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    StreamService.prototype.findOne = function (streamId) {
        return __awaiter(this, void 0, void 0, function () {
            var fields, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        fields = ['streamId', 'cameraId', 'streamName', 'streamType', 'streamUrl', 'streamType', 'type', 'isPublic'];
                        return [4 /*yield*/, this.streamRepo.findStream({ streamId: streamId, destinationServerId: config_1["default"].serverId }, fields)];
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
    StreamService.prototype.findAll = function (page, size, cameraId) {
        return __awaiter(this, void 0, void 0, function () {
            var fields, _a, limit, offset, streams, response, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        fields = ['streamId', 'cameraId', 'sourceServerId', 'destinationServerId', 'streamName', 'streamType', 'isPublic', 'isActive', 'isPublishing'];
                        _a = this.utilityService.getPagination(page, size), limit = _a.limit, offset = _a.offset;
                        return [4 /*yield*/, this.streamRepo.listAllStreams(limit, offset, __assign({ type: 'rtmp' }, (cameraId && { cameraId: cameraId })), fields)];
                    case 1:
                        streams = _b.sent();
                        response = this.utilityService.getPagingData(streams, page, limit);
                        // TODO this change will break pagination
                        response.results = response.results.reduce(function (res, stream) {
                            if (!res[stream.streamId]) {
                                res[stream.streamId] = stream;
                            }
                            else if (res[stream.streamId].destinationServerId !== config_1["default"].serverId) {
                                res[stream.streamId] = stream;
                            }
                            return res;
                        }, {});
                        response.results = Object.values(response.results);
                        response.results = response.results.map(function (stream) {
                            if (stream.isActive && stream.destinationServerId === config_1["default"].serverId) {
                                return __assign(__assign({}, stream), { playbackUrlTemplate: "rtmp://" + config_1["default"].rtmpServerConfig.publicServerIp + ":" + config_1["default"].rtmpServerConfig.publicServerPort + "/live/" + stream.streamId + "?token=<TOKEN>" });
                            }
                            return stream;
                        });
                        return [2 /*return*/, response];
                    case 2:
                        e_3 = _b.sent();
                        Logger_1["default"].error(e_3);
                        throw new Error_1["default"]('Error fetching the data');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StreamService.prototype.deleteAssociatedStreams = function (streamId) {
        return __awaiter(this, void 0, void 0, function () {
            var streams, _i, streams_1, stream, isProcessRunning, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, this.streamRepo.getAllAssociatedStreams(streamId)];
                    case 1:
                        streams = _a.sent();
                        if (Array.isArray(streams)) {
                            streams.reverse();
                        }
                        _i = 0, streams_1 = streams;
                        _a.label = 2;
                    case 2:
                        if (!(_i < streams_1.length)) return [3 /*break*/, 8];
                        stream = streams_1[_i];
                        if (!stream.processId) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.ffmpegService.isProcessRunning(stream.processId)];
                    case 3:
                        isProcessRunning = _a.sent();
                        if (!isProcessRunning) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.ffmpegService.killProcess(stream.processId)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [4 /*yield*/, this.streamRepo.deleteStream({ streamId: stream.streamId })];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        e_4 = _a.sent();
                        Logger_1["default"].error(e_4);
                        throw new Error_1["default"]('Error deleting streams');
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    StreamService.prototype["delete"] = function (streamId) {
        return __awaiter(this, void 0, void 0, function () {
            var streamData, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.streamRepo.findStream({ streamId: streamId, type: 'camera' })];
                    case 1:
                        streamData = _a.sent();
                        if (!streamData) {
                            return [2 /*return*/, 0];
                        }
                        return [4 /*yield*/, this.deleteAssociatedStreams(streamData.streamId)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, 1];
                    case 3:
                        e_5 = _a.sent();
                        Logger_1["default"].error(e_5);
                        throw new Error_1["default"]('Error deleting the data');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StreamService.prototype.getStatus = function (streamId) {
        return __awaiter(this, void 0, void 0, function () {
            var status_1, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.streamStatusService.getStatus(streamId)];
                    case 1:
                        status_1 = _a.sent();
                        return [2 /*return*/, status_1];
                    case 2:
                        e_6 = _a.sent();
                        Logger_1["default"].error(e_6);
                        throw new Error_1["default"]('Error fetching status');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StreamService.prototype.streamRequest = function (streamId, requestType) {
        return __awaiter(this, void 0, void 0, function () {
            var existingStreamRecord, isExistingStream, lmsRtmpStream, isPublishing, lastAccessed, streamQuery, message, stream, server, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 12, , 13]);
                        if (!(requestType === 'cloud')) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.streamRepo.findStream({ streamId: streamId, destinationServerId: config_1["default"].serverId })];
                    case 1:
                        existingStreamRecord = _a.sent();
                        isExistingStream = !!existingStreamRecord;
                        lmsRtmpStream = void 0;
                        isPublishing = false;
                        lastAccessed = Date.now();
                        if (!isExistingStream) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.streamRepo.findStream({ streamId: streamId, destinationServerId: existingStreamRecord.sourceServerId })];
                    case 2:
                        lmsRtmpStream = _a.sent();
                        isPublishing = lmsRtmpStream.isPublishing && existingStreamRecord.isActive;
                        streamQuery = { streamId: streamId, destinationServerId: config_1["default"].serverId };
                        message = { taskIdentifier: 'updateStreamData', data: { query: streamQuery, streamData: { lastAccessed: lastAccessed } } };
                        return [4 /*yield*/, this.kafkaManager.publish(existingStreamRecord.sourceServerId + ".downstream", message, Constants_1.KafkaMessageType.DB_REQUEST)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.streamRepo.updateStream(streamQuery, { lastAccessed: lastAccessed })];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.streamRepo.findStream({ streamId: streamId })];
                    case 6:
                        lmsRtmpStream = _a.sent();
                        isPublishing = false;
                        _a.label = 7;
                    case 7: return [2 /*return*/, {
                            apiResponse: __assign({ streamId: streamId, playbackUrlTemplate: "rtmp://" + config_1["default"].rtmpServerConfig.publicServerIp + ":" + config_1["default"].rtmpServerConfig.publicServerPort + "/live/" + streamId + "?token=<TOKEN>", isPublishing: isPublishing }, (!isPublishing && { message: 'Stream will be available shortly, please check status API to know the status' })),
                            kafkaRequestData: {
                                serverId: lmsRtmpStream.sourceServerId,
                                data: {
                                    cmsServerId: config_1["default"].serverId,
                                    isExistingStream: isExistingStream,
                                    streamData: {
                                        streamId: lmsRtmpStream['streamId'],
                                        cameraId: lmsRtmpStream['cameraId'],
                                        userId: lmsRtmpStream['userId'],
                                        provenanceStreamId: lmsRtmpStream['streamId'],
                                        sourceServerId: lmsRtmpStream['sourceServerId'],
                                        destinationServerId: config_1["default"].serverId,
                                        streamName: 'Cloud Stream',
                                        streamUrl: lmsRtmpStream['streamUrl'],
                                        lastAccessed: lastAccessed
                                    }
                                }
                            }
                        }];
                    case 8:
                        if (!(requestType === 'local')) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.streamRepo.findStream({ streamId: streamId })];
                    case 9:
                        stream = _a.sent();
                        return [4 /*yield*/, this.serverRepo.findServer(stream.sourceServerId)];
                    case 10:
                        server = _a.sent();
                        return [2 /*return*/, {
                                apiResponse: __assign({ streamId: streamId, playbackUrlTemplate: "rtmp://" + server.serverHost + ":" + server.serverRtmpPort + "/live/" + streamId + "?token=<TOKEN>", isPublishing: !!stream.isPublishing }, (!stream.isPublishing && { message: 'Stream will be available shortly, please check status API to know the status' }))
                            }];
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        e_7 = _a.sent();
                        Logger_1["default"].error(e_7);
                        throw new Error_1["default"]('Error getting playback url');
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    StreamService.prototype.publishStreamToCloud = function (cmsServerId, lmsStreamData, isExistingStream) {
        return __awaiter(this, void 0, void 0, function () {
            var data, token, rtmpStreamUrl, cmsRtmpStreamData, foundStream, sourceUrl, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, axios_1["default"].post(config_1["default"].cmsTokenApiUrl, {
                                email: config_1["default"].lmsAdminConfig.email,
                                password: config_1["default"].lmsAdminConfig.password
                            })];
                    case 1:
                        data = (_a.sent()).data;
                        token = data.token;
                        rtmpStreamUrl = "rtmp://" + config_1["default"].rtmpServerConfig.cmsServerIp + ":" + config_1["default"].rtmpServerConfig.cmsServerPort + "/live/" + lmsStreamData['streamId'] + "?token=" + config_1["default"].rtmpServerConfig.password;
                        cmsRtmpStreamData = {
                            streamId: lmsStreamData['streamId'],
                            cameraId: lmsStreamData['cameraId'],
                            userId: lmsStreamData['userId'],
                            provenanceStreamId: lmsStreamData['streamId'],
                            sourceServerId: lmsStreamData['sourceServerId'],
                            destinationServerId: cmsServerId,
                            streamName: lmsStreamData['streamName'],
                            streamUrl: rtmpStreamUrl,
                            streamType: 'RTMP',
                            type: 'rtmp',
                            isPublic: true,
                            lastAccessed: lmsStreamData['lastAccessed']
                        };
                        return [4 /*yield*/, this.streamRepo.findStream({
                                streamId: cmsRtmpStreamData.streamId,
                                destinationServerId: cmsRtmpStreamData.destinationServerId
                            })];
                    case 2:
                        foundStream = _a.sent();
                        if (!(!isExistingStream && !foundStream)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.streamRepo.registerStream(cmsRtmpStreamData)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        sourceUrl = lmsStreamData['streamUrl'].replace(/token=.*$/, "token=" + token);
                        this.processService.addStreamProcess(lmsStreamData['streamId'], lmsStreamData['streamId'], lmsStreamData['sourceServerId'], cmsServerId, sourceUrl, rtmpStreamUrl);
                        return [2 /*return*/, cmsRtmpStreamData];
                    case 5:
                        e_8 = _a.sent();
                        Logger_1["default"].error('Failed to publish stream');
                        throw e_8;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    StreamService = __decorate([
        typedi_1.Service()
    ], StreamService);
    return StreamService;
}());
exports["default"] = StreamService;
