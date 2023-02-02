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
var config_1 = require("../../config");
var Logger_1 = require("../../common/Logger");
var EventEmitter_1 = require("../../common/EventEmitter");
var Constants_1 = require("../../common/Constants");
var Kafka_1 = require("../../managers/Kafka");
var JobQueue_1 = require("../../managers/JobQueue");
var BaseKafkaController = /** @class */ (function () {
    function BaseKafkaController() {
        this.topic = config_1["default"].host.type === 'CMS' ? /.*.upstream/ : config_1["default"].serverId + '.downstream';
        this.jobQueueManager = typedi_1.Container.get(JobQueue_1["default"]);
        this.kafkaManager = typedi_1.Container.get(Kafka_1["default"]);
    }
    BaseKafkaController.prototype.subscribe = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.kafkaManager.subscribe(this.topic, function (err, message) { return _this.handleMessage(err, message); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseKafkaController.prototype.handleMessage = function (err, message) {
        return __awaiter(this, void 0, void 0, function () {
            var msg, messageId, _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!message)
                            return [2 /*return*/];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 9, , 10]);
                        if (err)
                            throw err;
                        msg = void 0;
                        messageId = message.headers.messageId;
                        _a = message.headers.messageType;
                        switch (_a) {
                            case Constants_1.KafkaMessageType.HTTP_REQUEST: return [3 /*break*/, 2];
                            case Constants_1.KafkaMessageType.HTTP_RESPONSE: return [3 /*break*/, 4];
                            case Constants_1.KafkaMessageType.DB_REQUEST: return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 2:
                        msg = JSON.parse(message.value.toString());
                        return [4 /*yield*/, this.jobQueueManager.add(msg.taskIdentifier, { messageId: messageId, data: msg.data }, Constants_1.JobPriority.HIGH)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 4:
                        msg = JSON.parse(message.value.toString());
                        EventEmitter_1["default"].emit(messageId, msg.data);
                        return [3 /*break*/, 8];
                    case 5:
                        msg = JSON.parse(message.value.toString());
                        return [4 /*yield*/, this.jobQueueManager.add(msg.taskIdentifier, { messageId: messageId, data: msg.data }, Constants_1.JobPriority.LOW)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 7: throw new Error("Message Type not supported: " + message.headers.messageType);
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        err_1 = _b.sent();
                        Logger_1["default"].error('error: %o', err_1);
                        throw err_1;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    BaseKafkaController.prototype.subscribeToNewTopics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.kafkaManager.unsubscribe()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.subscribe()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        Logger_1["default"].error('error: %o', err_2);
                        throw err_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return BaseKafkaController;
}());
exports["default"] = BaseKafkaController;
