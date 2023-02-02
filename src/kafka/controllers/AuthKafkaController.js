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
var UserRepo_1 = require("../../repositories/UserRepo");
var KafkaUtilService_1 = require("../../services/KafkaUtilService");
var AuthKafkaController = /** @class */ (function () {
    function AuthKafkaController() {
        this.kafkaManager = typedi_1.Container.get(Kafka_1["default"]);
        this.kafkaUtilService = typedi_1.Container.get(KafkaUtilService_1["default"]);
    }
    AuthKafkaController.prototype.signUp = function (serverId, userData) {
        return __awaiter(this, void 0, void 0, function () {
            var topic, message, messageId, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        topic = serverId + '.downstream';
                        message = { taskIdentifier: 'signUp', data: userData };
                        return [4 /*yield*/, this.kafkaManager.publish(topic, message, Constants_1.KafkaMessageType.HTTP_REQUEST)];
                    case 1:
                        messageId = (_a.sent()).messageId;
                        return [4 /*yield*/, this.kafkaUtilService.getKafkaMessageResponse(messageId)];
                    case 2:
                        result = _a.sent();
                        if (!result['created']) {
                            throw new Error('Error processing request');
                        }
                        return [2 /*return*/, result];
                    case 3:
                        err_1 = _a.sent();
                        Logger_1["default"].error('error: %o', err_1);
                        throw err_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthKafkaController.prototype.verifyUser = function (serverId, verificationData) {
        return __awaiter(this, void 0, void 0, function () {
            var topic, message, messageId, result, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        topic = serverId + '.downstream';
                        message = { taskIdentifier: 'verifyUser', data: verificationData };
                        return [4 /*yield*/, this.kafkaManager.publish(topic, message, Constants_1.KafkaMessageType.HTTP_REQUEST)];
                    case 1:
                        messageId = (_a.sent()).messageId;
                        return [4 /*yield*/, this.kafkaUtilService.getKafkaMessageResponse(messageId)];
                    case 2:
                        result = _a.sent();
                        if (!result['updated']) {
                            throw new Error('Error processing request');
                        }
                        return [2 /*return*/, result];
                    case 3:
                        err_2 = _a.sent();
                        Logger_1["default"].error('error: %o', err_2);
                        throw err_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthKafkaController.prototype.approveUser = function (serverId, email, role) {
        return __awaiter(this, void 0, void 0, function () {
            var topic, message, messageId, result, userRepo, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        topic = serverId + '.downstream';
                        message = { taskIdentifier: 'approveUser', data: { email: email, role: role } };
                        return [4 /*yield*/, this.kafkaManager.publish(topic, message, Constants_1.KafkaMessageType.HTTP_REQUEST)];
                    case 1:
                        messageId = (_a.sent()).messageId;
                        return [4 /*yield*/, this.kafkaUtilService.getKafkaMessageResponse(messageId)];
                    case 2:
                        result = _a.sent();
                        if (!(result['message'] === 'User approved')) return [3 /*break*/, 4];
                        userRepo = typedi_1.Container.get(UserRepo_1["default"]);
                        return [4 /*yield*/, userRepo.updateUser({ email: email }, { approved: true })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, result];
                    case 5:
                        err_3 = _a.sent();
                        Logger_1["default"].error('error: %o', err_3);
                        throw err_3;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return AuthKafkaController;
}());
exports["default"] = AuthKafkaController;
