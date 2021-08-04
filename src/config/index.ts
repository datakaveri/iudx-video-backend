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
        type: process.env.HOST_TYPE,
    },

    port: parseInt(process.env.PORT, 10),

    serverId: process.env.SERVER_ID,

    databaseURL: process.env.DB_URL,

    isStandaloneLms: process.env.STANDALONE_LMS === 'true' || false,

    kafkaConfig: {
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers: [process.env.KAFKA_BROKER],
        consumerGroupId: 'cloud-media-server-consumer',
        defaultRetentionValue: '172800000',
        // TODO - credentials will be dynamic later
        adminUsername: '',
        adminPassword: '',
        consumerUsername: '',
        consumerPassword: '',
        producerUsername: '',
        producerPassword: ''
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
        jwtAlgorithm: 'ES256',
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
        statUrl: process.env.RTMP_STAT_URL,
        publicServerIp: process.env.RTMP_SERVER_PUBLIC_IP,
        publicServerPort: process.env.RTMP_SERVER_PUBLIC_PORT
    },

    schedulerConfig: {
        statusCheck: {
            enable: process.env.ENABLE_STATUS_CHECK === 'true' || false,
            jobInterval: 3, // in minutes
            lastActiveInterval: 5, // in minutes
        },
        metricsMonitor: {
            enable: process.env.ENABLE_METRICS_MONITOR === 'true' || false,
            jobInterval: 5, // in seconds
        },
    },

    prometheusConfig: {
        pushGatewayUrl: process.env.PROM_PUSHGATEWAY_URL,
        requestTimeout: 3, // in seconds
    },

    cmsAdminConfig: {
        email: process.env.CMS_ADMIN_EMAIL,
        password: process.env.CMS_ADMIN_PASSWORD,
        name: 'CMS Admin'
    },

    lmsAdminConfig: {
        email: process.env.LMS_ADMIN_EMAIL,
        password: process.env.LMS_ADMIN_PASSWORD,
        name: 'LMS Admin'
    }
};
