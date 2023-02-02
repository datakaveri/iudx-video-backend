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
var nodemailer_1 = require("nodemailer");
var nodemailer_smtp_transport_1 = require("nodemailer-smtp-transport");
var uuid_1 = require("uuid");
var Logger_1 = require("../common/Logger");
var Database_1 = require("../managers/Database");
var api_server_1 = require("../api-server");
var config_1 = require("../config");
var Queue_1 = require("../managers/Queue");
var Scheduler_1 = require("../managers/Scheduler");
var JobQueue_1 = require("../managers/JobQueue");
var Kafka_1 = require("../managers/Kafka");
var kafka_1 = require("../kafka");
var UserRepo_1 = require("../repositories/UserRepo");
var Utility_1 = require("../common/Utility");
var ServerService_1 = require("../services/ServerService");
var MonitoringService_1 = require("../services/MonitoringService");
exports["default"] = (function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1, kafkaManager, jobQueueManager, schedulerManager, monitoringService, email, password, name_1, userRepo, UtilityService, verificationCode, found, userData, id, email, password, name_2, userRepo, UtilityService, verificationCode, found, userData, ServerServiceInstance, found, server;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Database_1.Database.authenticate()];
            case 1:
                _a.sent();
                Logger_1["default"].info('Connection has been established successfully.');
                Database_1.ModelDependencyInjector();
                Logger_1["default"].info('Created DI of all models');
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                Logger_1["default"].error(error_1);
                return [3 /*break*/, 3];
            case 3:
                kafkaManager = typedi_1["default"].get(Kafka_1["default"]);
                kafkaManager.connect();
                // Initialize Mail Client
                typedi_1["default"].set('emailClient', nodemailer_1["default"].createTransport(nodemailer_smtp_transport_1["default"]({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    auth: {
                        user: config_1["default"].emailConfig.username,
                        pass: config_1["default"].emailConfig.password
                    }
                })));
                // Initialize queue Manager
                typedi_1["default"].set('queue', Queue_1["default"]);
                jobQueueManager = typedi_1["default"].get(JobQueue_1["default"]);
                jobQueueManager.init();
                schedulerManager = new Scheduler_1["default"]();
                // Start status check scheduler if enabled
                if (config_1["default"].schedulerConfig.statusCheck.enable) {
                    schedulerManager.startStatusCheck();
                    Logger_1["default"].info('Status check service started.');
                }
                monitoringService = typedi_1["default"].get(MonitoringService_1["default"]);
                monitoringService.init();
                // Start Monitoring Service for LMS
                if (config_1["default"].schedulerConfig.metricsMonitor.enable && config_1["default"].host.type === 'LMS' && !config_1["default"].isStandaloneLms) {
                    schedulerManager.startMetricsMonitoring();
                    Logger_1["default"].info('Monitoring service started.');
                }
                if (!!config_1["default"].isStandaloneLms) return [3 /*break*/, 5];
                return [4 /*yield*/, kafka_1["default"]()];
            case 4:
                _a.sent();
                Logger_1["default"].info('Connected to Kafka successfully.');
                _a.label = 5;
            case 5:
                // start heartbeat service for LMS
                if (config_1["default"].host.type === 'LMS' && !config_1["default"].isStandaloneLms) {
                    schedulerManager.startHeartbeatService();
                    Logger_1["default"].info('Heartbeat service started.');
                }
                if (!(config_1["default"].host.type === 'CMS')) return [3 /*break*/, 8];
                email = config_1["default"].cmsAdminConfig.email;
                password = config_1["default"].cmsAdminConfig.password;
                name_1 = config_1["default"].cmsAdminConfig.name;
                userRepo = typedi_1["default"].get(UserRepo_1["default"]);
                UtilityService = typedi_1["default"].get(Utility_1["default"]);
                verificationCode = UtilityService.generateCode();
                return [4 /*yield*/, userRepo.findUser({ email: email })];
            case 6:
                found = _a.sent();
                if (!!found) return [3 /*break*/, 8];
                userData = { id: uuid_1.v4(), name: name_1, email: email, password: password, verificationCode: verificationCode, verified: true, role: 'cms-admin', approved: true };
                return [4 /*yield*/, userRepo.createUser(userData)];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                if (!(config_1["default"].host.type === 'LMS')) return [3 /*break*/, 11];
                id = config_1["default"].lmsAdminConfig.id || uuid_1.v4();
                email = config_1["default"].lmsAdminConfig.email;
                password = config_1["default"].lmsAdminConfig.password;
                name_2 = config_1["default"].lmsAdminConfig.name;
                userRepo = typedi_1["default"].get(UserRepo_1["default"]);
                UtilityService = typedi_1["default"].get(Utility_1["default"]);
                verificationCode = UtilityService.generateCode();
                return [4 /*yield*/, userRepo.findUser({ email: email })];
            case 9:
                found = _a.sent();
                if (!!found) return [3 /*break*/, 11];
                userData = { id: id, name: name_2, email: email, password: password, verificationCode: verificationCode, verified: true, role: 'lms-admin', approved: true };
                return [4 /*yield*/, userRepo.createUser(userData)];
            case 10:
                _a.sent();
                _a.label = 11;
            case 11:
                if (!(config_1["default"].host.type === 'CMS')) return [3 /*break*/, 14];
                ServerServiceInstance = typedi_1["default"].get(ServerService_1["default"]);
                return [4 /*yield*/, ServerServiceInstance.findServer(config_1["default"].serverId)];
            case 12:
                found = _a.sent();
                if (!!found) return [3 /*break*/, 14];
                return [4 /*yield*/, ServerServiceInstance.register('cms-server', config_1["default"].rtmpServerConfig.cmsServerIp, config_1["default"].rtmpServerConfig.cmsServerPort, 'CMS', config_1["default"].serverId, config_1["default"].kafkaConfig.consumerGroupId)];
            case 13:
                server = _a.sent();
                _a.label = 14;
            case 14:
                // Start Express API Server
                api_server_1["default"]();
                return [2 /*return*/];
        }
    });
}); });
