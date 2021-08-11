const KafkaMessageType = {
    HTTP_REQUEST: 'HTTP_REQ',
    HTTP_RESPONSE: 'HTTP_RES',
    DB_REQUEST: 'DB_REQ',
}

const JobPriority = {
    LOW: 2,
    MEDIUM: 1,
    HIGH: 0,
}

export {
    KafkaMessageType,
    JobPriority,
}