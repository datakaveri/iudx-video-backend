import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
    throw new Error("Couldn't find .env file");
}

export default {
    //Changes done to create seperate env variables for CMS and LMS 
    host: {
        name: process.env.LMS_HOST_NAME,
        type: process.env.LMS_HOST_TYPE,
    },

    port: parseInt(process.env.LMS_PORT, 10),

    serverId: process.env.SERVER_ID,

    DatabaseURL: process.env.LMS_DB_URL,



    isStandaloneLms: process.env.STANDALONE_LMS === 'true' || false,

    kafkaConfig: {
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers: [process.env.KAFKA_BROKER],
        consumerGroupId: 'cloud-media-server-consumer',
        defaultRetentionValue: '172800000',
        messageWaitTime: 20, // in seconds
        // TODO - credentials will be dynamic later
        adminUsername: process.env.KAFKA_CLIENT_USERNAME,
        adminPassword: process.env.KAFKA_CLIENT_PASSWORD,
        consumerUsername: process.env.KAFKA_CLIENT_USERNAME,
        consumerPassword: process.env.KAFKA_CLIENT_PASSWORD,
        producerUsername: process.env.KAFKA_CLIENT_USERNAME,
        producerPassword: process.env.KAFKA_CLIENT_PASSWORD,
        sslCAPath: process.env.KAFKA_SSL_CA_FILEPATH,
        sslCERTPath: process.env.KAFKA_SSL_CERT_FILEPATH,
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
        publicServerPort: process.env.RTMP_SERVER_PUBLIC_PORT,
        cmsServerIp: process.env.CMS_RTSP_HOST,
        cmsServerPort: process.env.CMS_RTSP_PORT ? parseInt(process.env.CMS_RTSP_PORT): 1935,
    },

    rtspServerConfig: {
        serverUrl: process.env.RTSP_SERVER,
        password: process.env.RTSP_SERVER_PUBLISH_PASSWORD,
        serverPort: process.env.RTSP_SERVER_PUBLIC_PORT,
        publicServerIp: process.env.RTSP_SERVER_PUBLIC_IP,
        publicServerPort: process.env.RTSP_SERVER_PUBLIC_PORT,
        cmsServerIp: process.env.CMS_RTSP_HOST,
        cmsServerPort: process.env.CMS_RTSP_PORT ? parseInt(process.env.CMS_RTSP_PORT): 8554,
        publishURL: 'http://localhost:9997/v1/config/paths/add'
    },

    schedulerConfig: {
        statusCheck: {
            enable: process.env.ENABLE_STATUS_CHECK === 'true' || false,
            jobInterval: 3, // in minutes
            lastActiveInterval: 5, // in minutes
            streamDisconnectInterval: 60 // in minutes
        },
        metricsMonitor: {
            enable: process.env.ENABLE_METRICS_MONITOR === 'true' || false,
            jobInterval: 5, // in seconds
        },
        hearbeat: {
            jobInterval: 1,// in minutes
        }
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
        id: process.env.LMS_ADMIN_ID,
        email: process.env.LMS_ADMIN_EMAIL,
        password: process.env.LMS_ADMIN_PASSWORD,
        name: 'LMS Admin'
    },

    cmsTokenApiUrl: process.env.TOKEN_API_URL,
};
