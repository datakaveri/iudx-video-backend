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
var config_1 = require("../../config");
var CameraRepo_1 = require("../../repositories/CameraRepo");
var PolicyRepo_1 = require("../../repositories/PolicyRepo");
var StreamRepo_1 = require("../../repositories/StreamRepo");
var AuthorizeRole = function (allowedRoles) {
    return function (req, res, next) {
        var role = req.user['role'];
        // If the server is standalone lms then allow lms admin all permissions which cms admin can perform
        if (config_1["default"].isStandaloneLms) {
            allowedRoles.push('lms-admin');
        }
        if (!role) {
            return res.status(401).send('Authorization failed, invalid token provided');
        }
        if (allowedRoles.includes(role)) {
            return next();
        }
        else {
            return res.status(403).send('Forbidden');
        }
    };
};
exports.AuthorizeRole = AuthorizeRole;
var ValidatePolicy = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var policyRepo, role, userId, streamId, requestType, streamRepo, stream, policy, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                policyRepo = typedi_1["default"].get(PolicyRepo_1["default"]);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                role = req.user['role'];
                if (role === 'cms-admin') {
                    return [2 /*return*/, next()];
                }
                /** TODO
                 *  Validate if LMS admin can access to requested stream
                 */
                if (role === 'lms-admin') {
                    return [2 /*return*/, next()];
                }
                userId = req.user['userId'];
                if (!userId) {
                    return [2 /*return*/, res.status(401).send('Authorization failed, invalid token provided')];
                }
                streamId = req.params.streamId || req.query.streamId || req.body.streamId;
                if (!streamId) {
                    return [2 /*return*/, res.status(401).send('Authorization failed, stream id not provided')];
                }
                requestType = req.query.type || 'local';
                streamRepo = typedi_1["default"].get(StreamRepo_1["default"]);
                return [4 /*yield*/, streamRepo.findStream({ streamId: streamId })];
            case 2:
                stream = _a.sent();
                return [4 /*yield*/, policyRepo.findPolicyByConstraints(userId, stream.cameraId, requestType)];
            case 3:
                policy = _a.sent();
                if (!policy) {
                    return [2 /*return*/, res.status(401).send('Authorization failed for requested resource')];
                }
                return [2 /*return*/, next()];
            case 4:
                err_1 = _a.sent();
                Logger_1["default"].error('error in policy authorization middleware: %o', err_1);
                return [2 /*return*/, res.status(500).send('Internal Server Error')];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.ValidatePolicy = ValidatePolicy;
/**
 * This middleware is specifically for provider access validation for stream
 * @param req
 * @param res
 * @param next
 * @returns
 */
var ValidateStreamAccess = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, role, streamId, streamRepo, stream, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.user['userId'];
                role = req.user['role'];
                if (role === 'cms-admin') {
                    return [2 /*return*/, next()];
                }
                if (role === 'consumer') {
                    return [2 /*return*/, res.status(401).send('Authorization failed')];
                }
                /** TODO
                 *  Validate if LMS admin can access to requested stream
                 */
                if (role === 'lms-admin') {
                    return [2 /*return*/, next()];
                }
                if (!userId) {
                    return [2 /*return*/, res.status(401).send('Authorization failed, invalid token provided')];
                }
                streamId = req.params.streamId || req.query.streamId || req.body.streamId;
                if (!streamId) {
                    return [2 /*return*/, res.status(401).send('Authorization failed, stream id not provided')];
                }
                streamRepo = typedi_1["default"].get(StreamRepo_1["default"]);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, streamRepo.findStream({ userId: userId, streamId: streamId })];
            case 2:
                stream = _a.sent();
                if (!stream) {
                    return [2 /*return*/, res.status(401).send('Authorization failed')];
                }
                return [2 /*return*/, next()];
            case 3:
                err_2 = _a.sent();
                return [2 /*return*/, res.status(401).send('Authorization failed')];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.ValidateStreamAccess = ValidateStreamAccess;
/**
 * This middleware is specifically for provider access validation for camera
 * @param req
 * @param res
 * @param next
 * @returns
 */
var ValidateCameraAccess = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, role, cameraId, cameraRepo, camera, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.user['userId'];
                role = req.user['role'];
                if (role === 'cms-admin') {
                    return [2 /*return*/, next()];
                }
                if (role === 'consumer') {
                    return [2 /*return*/, res.status(401).send('Authorization failed')];
                }
                /** TODO
                 *  Validate if LMS admin can access to requested stream
                 */
                if (role === 'lms-admin') {
                    return [2 /*return*/, next()];
                }
                if (!userId) {
                    return [2 /*return*/, res.status(401).send('Authorization failed, invalid token provided')];
                }
                cameraId = req.params.cameraId || req.query.cameraId || req.body.cameraId;
                if (!cameraId) {
                    return [2 /*return*/, res.status(401).send('Authorization failed, camera id not provided')];
                }
                cameraRepo = typedi_1["default"].get(CameraRepo_1["default"]);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, cameraRepo.findCamera({ userId: userId, cameraId: cameraId })];
            case 2:
                camera = _a.sent();
                if (!camera) {
                    return [2 /*return*/, res.status(401).send('Authorization failed')];
                }
                return [2 /*return*/, next()];
            case 3:
                err_3 = _a.sent();
                return [2 /*return*/, res.status(401).send('Authorization failed')];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.ValidateCameraAccess = ValidateCameraAccess;
