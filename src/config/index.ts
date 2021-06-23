import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
    throw new Error("Couldn't find .env file");
}

export default {
    host: {
        name: process.env.HOST_NAME,
        type: process.env.HOST_TYPE
    },

    port: parseInt(process.env.PORT, 10),

    databaseURL: process.env.DB_URL,

    kafkaConfig: {
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers: process.env.KAFKA_BROKER,
        consumerGroupId: 'cloud-media-server-consumer',
    },
    /**
     * Used by winston logger
     */
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },

    /**
     * API configs
     */
    api: {
        prefix: '/api',
    },

    /**
     * Auth Config
     */
    authConfig: {
        jwtSecret: process.env.JWT_SECRET,
        jwtPrivateKeyPath: process.env.JWT_PRIVATE_KEY_PATH,
        jwtAlgorithm: 'RS256',
        jwtTokenExpiry: '1h',
        verificationUrl: 'http://localhost:4000/api/auth/verify?verificationCode=',
    },

    /**
     * Email Config
     */
    emailConfig: {
        username: process.env.EMAIL_ID,
        password: process.env.EMAIL_PASSWORD,
    },

    ffmpegConfig: {
        ffprobeTimeout: 20, // in seconds
    },

    rtmpServerConfig: {
        serverUrl: process.env.RTMP_SERVER,
        password: process.env.RTMP_SERVER_PUBLISH_PASSWORD,
    },

    streamProcessConfig: {
        initializeStreams: process.env.INITIALIZE_STREAMS === 'true' ? true : false,
    },

    schedulers: {
        statusCheck: {
            enable: process.env.ENABLE_STATUS_CHECK === 'true' || false,
            lastActiveInterval: 5, // in minutes
        }
    },

    streamServer: {
        rtmp: {
            statPort: process.env.RTMP_SERVER_STAT_PORT
        }
    }
};
