"use strict";
exports.__esModule = true;
require("reflect-metadata");
var Logger_1 = require("./common/Logger");
var supervisor_1 = require("./supervisor");
if (process.env.NODE_ENV === 'development') {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';
}
function startServer() {
    supervisor_1["default"]()
        .then(function () {
        Logger_1["default"].info('Application started');
    })["catch"](function (err) {
        Logger_1["default"].error(err);
        process.exit(1);
    });
}
startServer();
