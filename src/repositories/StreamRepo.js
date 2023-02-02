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
var sequelize_1 = require("sequelize");
var Database_1 = require("../managers/Database");
var config_1 = require("../config");
var StreamRepo = /** @class */ (function () {
    function StreamRepo() {
    }
    StreamRepo.prototype.registerStream = function (streamData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.streamModel.create(streamData)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StreamRepo.prototype.findStream = function (query, columns) {
        if (columns === void 0) { columns = null; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.streamModel.findOne({ where: query, attributes: columns })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StreamRepo.prototype.listAllStreams = function (limit, offset, query, columns) {
        if (query === void 0) { query = {}; }
        if (columns === void 0) { columns = null; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.streamModel.findAndCountAll({ where: query, limit: limit, offset: offset, attributes: columns, raw: true })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StreamRepo.prototype.deleteStream = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.streamModel.destroy({ where: query })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StreamRepo.prototype.updateStream = function (query, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.streamModel.update(updateData, { where: query })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StreamRepo.prototype.findAllStreams = function (query, columns) {
        if (query === void 0) { query = {}; }
        if (columns === void 0) { columns = null; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.streamModel.findAll({ where: query, attributes: columns, raw: true })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StreamRepo.prototype.getAllAssociatedStreams = function (streamId) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n            WITH RECURSIVE streamhierarchy AS (\n                SELECT *\n                FROM \"Streams\"\n                WHERE \"streamId\" = '" + streamId + "'\n                UNION\n                    SELECT s.*\n                    FROM \"Streams\" s\n                    INNER JOIN streamhierarchy h ON h.\"streamId\" = s.\"provenanceStreamId\"\n            ) \n            SELECT * FROM streamhierarchy; \n        ";
                        return [4 /*yield*/, Database_1.Database.query(query, { type: sequelize_1.QueryTypes.SELECT, raw: true })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StreamRepo.prototype.getStreamsForStatusCheck = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lastActiveInterval;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        lastActiveInterval = config_1["default"].schedulerConfig.statusCheck.lastActiveInterval;
                        return [4 /*yield*/, this.streamModel.findAll({
                                where: (_a = {
                                        destinationServerId: config_1["default"].serverId
                                    },
                                    _a[sequelize_1.Op.or] = [
                                        {
                                            lastActive: (_b = {},
                                                _b[sequelize_1.Op.is] = null,
                                                _b)
                                        },
                                        {
                                            lastActive: (_c = {},
                                                _c[sequelize_1.Op.lt] = new Date(Date.now() - 60000 * lastActiveInterval),
                                                _c)
                                        },
                                    ],
                                    _a),
                                raw: true
                            })];
                    case 1: return [2 /*return*/, _d.sent()];
                }
            });
        });
    };
    __decorate([
        typedi_1.Inject('StreamModel')
    ], StreamRepo.prototype, "streamModel");
    StreamRepo = __decorate([
        typedi_1.Service()
    ], StreamRepo);
    return StreamRepo;
}());
exports["default"] = StreamRepo;
