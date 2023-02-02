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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var child_process_1 = require("child_process");
var typedi_1 = require("typedi");
var ps_node_1 = require("ps-node");
var Logger_1 = require("../common/Logger");
var config_1 = require("../config");
var Error_1 = require("../common/Error");
var FfmpegService = /** @class */ (function () {
    function FfmpegService(utility) {
        this.utility = utility;
    }
    FfmpegService.prototype.createProcess = function (streamInputUrl, streamOutputUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var command, ffmpegArgs, proc;
            return __generator(this, function (_a) {
                try {
                    if (!this.utility.isValidStreamUrl(streamInputUrl)) {
                        throw new Error_1["default"]('Invalid input url provided');
                    }
                    if (!this.utility.isValidStreamUrl(streamOutputUrl)) {
                        throw new Error_1["default"]('Invalid output url provided');
                    }
                    command = 'ffmpeg';
                    ffmpegArgs = __spreadArrays((streamInputUrl.startsWith('rtsp') ? ['-rtsp_transport', 'tcp'] : []), ['-i', streamInputUrl, '-c', 'copy', '-f', 'flv', streamOutputUrl]);
                    proc = child_process_1.spawn(command, ffmpegArgs, { stdio: 'ignore' });
                    return [2 /*return*/, proc.pid];
                }
                catch (err) {
                    Logger_1["default"].error(err);
                    throw err;
                }
                return [2 /*return*/];
            });
        });
    };
    FfmpegService.prototype.isProcessRunning = function (pid) {
        return new Promise(function (resolve, reject) {
            if (!pid) {
                return reject(new Error_1["default"]('Invalid process id provided'));
            }
            ps_node_1["default"].lookup({ pid: pid }, function (err, processList) {
                if (err)
                    return reject(err);
                var process = processList[0];
                if (process && (process.command === 'ffmpeg' || process.command === 'ffprobe')) {
                    return resolve(true);
                }
                else {
                    return resolve(false);
                }
            });
        });
    };
    FfmpegService.prototype.isStreamActive = function (streamUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var args, cmd, proc, result;
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.utility.isValidStreamUrl(streamUrl)) {
                    throw new Error_1["default"]('Invalid stream url provided');
                }
                args = ['-v', 'quiet', '-print_format', 'json', '-show_streams', streamUrl];
                cmd = 'ffprobe';
                proc = child_process_1.spawn(cmd, args);
                result = '';
                proc.stdout.on('data', function (data) {
                    result += data.toString();
                });
                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        proc.kill('SIGKILL');
                        return [2 /*return*/];
                    });
                }); }, config_1["default"].ffmpegConfig.ffprobeTimeout * 1000);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        proc.on('close', function (code) { return __awaiter(_this, void 0, void 0, function () {
                            var streamPresent;
                            return __generator(this, function (_a) {
                                streamPresent = false;
                                try {
                                    if (result && result !== '' && result.trim() !== '') {
                                        streamPresent = Object.keys(JSON.parse(result)).length > 0;
                                    }
                                    if (code === 0 && streamPresent) {
                                        return [2 /*return*/, resolve(true)];
                                    }
                                    else {
                                        return [2 /*return*/, resolve(false)];
                                    }
                                }
                                catch (err) {
                                    Logger_1["default"].error('Error in stream active check');
                                    Logger_1["default"].error(err);
                                    Logger_1["default"].info("FFprobe data", result);
                                    return [2 /*return*/, resolve(false)];
                                }
                                return [2 /*return*/];
                            });
                        }); });
                    })];
            });
        });
    };
    FfmpegService.prototype.streamToFile = function (streamInputUrl, filepath, duration) {
        return __awaiter(this, void 0, void 0, function () {
            var command, ffmpegArguments, proc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.utility.isValidStreamUrl(streamInputUrl)) {
                            throw new Error_1["default"]('Invalid input url provided');
                        }
                        if (!duration) {
                            throw new Error_1["default"]('Invalid duration provided');
                        }
                        command = 'ffmpeg';
                        ffmpegArguments = ['-i', streamInputUrl, '-an', '-vcodec', 'copy', filepath];
                        return [4 /*yield*/, child_process_1.spawn(command, ffmpegArguments, { stdio: 'ignore' })];
                    case 1:
                        proc = _a.sent();
                        setTimeout(function () {
                            proc.kill();
                        }, duration * 1000);
                        return [2 /*return*/, proc.pid];
                }
            });
        });
    };
    FfmpegService.prototype.killProcess = function (pid) {
        return new Promise(function (resolve, reject) {
            if (!pid) {
                return reject(new Error_1["default"]('Invalid process id provided'));
            }
            ps_node_1["default"].kill(pid, function (err) {
                if (err)
                    return reject(err);
                return resolve("Process " + pid + " has been killed");
            });
        });
    };
    FfmpegService = __decorate([
        typedi_1.Service()
    ], FfmpegService);
    return FfmpegService;
}());
exports["default"] = FfmpegService;
