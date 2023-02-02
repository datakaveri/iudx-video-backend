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
var graphile_worker_1 = require("graphile-worker");
var config_1 = require("../config");
var TaskList_1 = require("../common/TaskList");
var Logger_1 = require("../common/Logger");
var Constants_1 = require("../common/Constants");
var JobQueueManager = /** @class */ (function () {
    function JobQueueManager() {
    }
    JobQueueManager.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = this;
                        return [4 /*yield*/, graphile_worker_1.run({
                                connectionString: config_1["default"].databaseURL,
                                concurrency: 4,
                                noHandleSignals: false,
                                taskList: TaskList_1.taskList
                            })];
                    case 1:
                        _a.runner = _b.sent();
                        this.runner.events.on('job:start', function (_a) {
                            var worker = _a.worker, job = _a.job;
                            console.log("Worker " + worker.workerId + " assigned to job " + job.id);
                        });
                        Object.freeze(this);
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _b.sent();
                        Logger_1["default"].error('error: %o', err_1);
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JobQueueManager.prototype.add = function (taskIdentifier, payload, priority, maxAttempts) {
        if (priority === void 0) { priority = Constants_1.JobPriority.HIGH; }
        if (maxAttempts === void 0) { maxAttempts = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.runner.addJob(taskIdentifier, payload, { maxAttempts: maxAttempts, priority: priority })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        Logger_1["default"].error('error: %o', err_2);
                        throw err_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    JobQueueManager.prototype.events = function () {
        return this.runner.events;
    };
    // TODO: Remove all incomplete jobs when server is restarted
    JobQueueManager.prototype.removeIncompleteJobs = function () { };
    JobQueueManager = __decorate([
        typedi_1.Service()
    ], JobQueueManager);
    return JobQueueManager;
}());
exports["default"] = JobQueueManager;
