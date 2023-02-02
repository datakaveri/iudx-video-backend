"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var ServiceError = /** @class */ (function (_super) {
    __extends(ServiceError, _super);
    function ServiceError(message, title, status) {
        if (title === void 0) { title = 'Internal Server Error'; }
        if (status === void 0) { status = 500; }
        var _this = _super.call(this, message) || this;
        _this.title = title;
        _this.status = status;
        return _this;
    }
    return ServiceError;
}(Error));
exports["default"] = ServiceError;
