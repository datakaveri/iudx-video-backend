"use strict";
exports.__esModule = true;
var uuid_1 = require("uuid");
var config_1 = require("../config");
var UUID = /** @class */ (function () {
    function UUID() {
    }
    UUID.prototype.generateUUIDv5 = function (namespace) {
        var NAMESPACE = uuid_1.v5(namespace, config_1["default"].serverId);
        return uuid_1.v5(uuid_1.v4(), NAMESPACE);
    };
    return UUID;
}());
exports["default"] = UUID;
