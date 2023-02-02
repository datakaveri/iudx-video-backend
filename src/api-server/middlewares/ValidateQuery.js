"use strict";
exports.__esModule = true;
function validateQuery(fields) {
    return function (req, res, next) {
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var field = fields_1[_i];
            if (!req.query[field]) {
                return res
                    .status(400)
                    .json({
                    'type': 400,
                    'title': 'Bad Request',
                    'detail': 'Bad query'
                });
            }
        }
        next();
    };
}
exports.validateQuery = validateQuery;
function validatePaginationQuery(fields) {
    return function (req, res, next) {
        for (var _i = 0, fields_2 = fields; _i < fields_2.length; _i++) {
            var field = fields_2[_i];
            var value = +req.query[field];
            // checks whether all query field is a number
            if (req.query[field] && (isNaN(value) || value < 1)) {
                return res
                    .status(400)
                    .json({
                    'type': 400,
                    'title': 'Bad Request',
                    'detail': 'Bad query'
                });
            }
        }
        next();
    };
}
exports.validatePaginationQuery = validatePaginationQuery;
