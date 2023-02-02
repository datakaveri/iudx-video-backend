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
var Logger_1 = require("../common/Logger");
var Error_1 = require("../common/Error");
var UUID_1 = require("../common/UUID");
var config_1 = require("../config");
var BaseKafkaController_1 = require("../kafka/controllers/BaseKafkaController");
var ServerService = /** @class */ (function () {
    function ServerService(kafkaUtilService, serverRepo) {
        this.kafkaUtilService = kafkaUtilService;
        this.serverRepo = serverRepo;
    }
    ServerService.prototype.register = function (serverName, serverHost, serverRtmpPort, serverType, serverId, consumerGroupId) {
        return __awaiter(this, void 0, void 0, function () {
            var newServerId, upstreamTopicName, downstreamTopicName, baseKafkaController, newConsumerGroupId, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        newServerId = serverId || new UUID_1["default"]().generateUUIDv5(serverName);
                        upstreamTopicName = newServerId + ".upstream";
                        downstreamTopicName = newServerId + ".downstream";
                        return [4 /*yield*/, this.kafkaUtilService.createTopic(upstreamTopicName)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.kafkaUtilService.createTopic(downstreamTopicName)];
                    case 2:
                        _a.sent();
                        if (!(serverType === 'LMS')) return [3 /*break*/, 4];
                        baseKafkaController = new BaseKafkaController_1["default"]();
                        return [4 /*yield*/, baseKafkaController.subscribeToNewTopics()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        newConsumerGroupId = consumerGroupId || newServerId + "-group";
                        // Update data in database
                        return [4 /*yield*/, this.serverRepo.addServer({
                                serverId: newServerId,
                                serverName: serverName,
                                serverType: serverType,
                                serverHost: serverHost,
                                serverRtmpPort: serverRtmpPort,
                                upstreamTopic: upstreamTopicName,
                                downstreamTopic: downstreamTopicName,
                                consumerGroupId: newConsumerGroupId
                            })];
                    case 5:
                        // Update data in database
                        _a.sent();
                        // return data
                        return [2 /*return*/, {
                                serverId: newServerId,
                                serverName: serverName,
                                serverType: serverType,
                                upstreamTopic: upstreamTopicName,
                                downstreamTopic: downstreamTopicName,
                                consumerGroupId: newConsumerGroupId,
                                consumerUsername: config_1["default"].kafkaConfig.consumerUsername,
                                consumerPassword: config_1["default"].kafkaConfig.consumerPassword,
                                producerUsername: config_1["default"].kafkaConfig.producerUsername,
                                producerPassword: config_1["default"].kafkaConfig.producerPassword
                            }];
                    case 6:
                        e_1 = _a.sent();
                        Logger_1["default"].error(e_1);
                        throw new Error_1["default"]('Error registering server');
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ServerService.prototype.findServer = function (serverId) {
        return __awaiter(this, void 0, void 0, function () {
            var server, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.serverRepo.findServer(serverId)];
                    case 1:
                        server = _a.sent();
                        return [2 /*return*/, server];
                    case 2:
                        e_2 = _a.sent();
                        Logger_1["default"].error(e_2);
                        throw new Error_1["default"]('Error fetching server data');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ServerService.prototype.listAllServers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var server, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.serverRepo.findAllLmsServers()];
                    case 1:
                        server = _a.sent();
                        return [2 /*return*/, server];
                    case 2:
                        e_3 = _a.sent();
                        Logger_1["default"].error(e_3);
                        throw new Error_1["default"]('Error fetching server data');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ServerService = __decorate([
        typedi_1.Service()
    ], ServerService);
    return ServerService;
}());
exports["default"] = ServerService;
