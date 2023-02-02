import winston from 'winston';

import config from '../config';

const transports = [];

const ENVIRONMENT = process.env.NODE_ENV;

if (ENVIRONMENT === 'development') {
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(winston.format.cli(), winston.format.splat()),
        })
    );
}
else if (ENVIRONMENT === 'test') {
    transports.push(
        new winston.transports.Console({
            silent: true
        })
    );
}
else {
    transports.push(new winston.transports.Console());
}

const LoggerInstance = winston.createLogger({
    level: config.logs.level,
    levels: winston.config.npm.levels,
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    transports,
});

export default LoggerInstance;
