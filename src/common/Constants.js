"use strict";
exports.__esModule = true;
var KafkaMessageType = {
    HTTP_REQUEST: 'HTTP_REQ',
    HTTP_RESPONSE: 'HTTP_RES',
    DB_REQUEST: 'DB_REQ'
};
exports.KafkaMessageType = KafkaMessageType;
var JobPriority = {
    LOW: 2,
    MEDIUM: 1,
    HIGH: 0
};
exports.JobPriority = JobPriority;
