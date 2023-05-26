import Container from 'typedi';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import { v4 as uuidv4 } from 'uuid';

import Logger from '../common/Logger';
import { Database, ModelDependencyInjector } from '../managers/Database';
import apiServer from '../api-server';
import config from '../config';
import Queue from '../managers/Queue';
import SchedulerManager from '../managers/Scheduler';
import JobQueueManager from '../managers/JobQueue';
import KafkaManager from '../managers/Kafka';
import kafkaService from '../kafka';
import UserRepo from '../repositories/UserRepo';
import Utility from '../common/Utility';
import ServerService from '../services/ServerService';
import MonitoringService from '../services/MonitoringService';

export default async () => {
    // Initialize Database connection and load model injector
    try {
        await Database.authenticate();
        Logger.info('Connection with Database has been established successfully.');
        ModelDependencyInjector();
        Logger.info('Created DI of all models in Database');

        // await cmsDatabase.authenticate();
        // Logger.info('Connection with CMS Database has been established successfully.');
        // CMSModelDependencyInjector();
        // Logger.info('Created DI of all models in CMS Database');
    } catch (error) {
        Logger.error(error);
    }

    //Initialize Kafka and Topics to listen for new messages
    const kafkaManager: KafkaManager = Container.get(KafkaManager);
    kafkaManager.connect();
    Logger.debug(`${config.host.type} connected to kafka successfully`);

    // Initialize Mail Client
    Container.set(
        'emailClient',
        nodemailer.createTransport(
            smtpTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: config.emailConfig.username,
                    pass: config.emailConfig.password,
                },
            })
        )
    );

    // Initialize queue Manager
    Container.set('queue', Queue);

    // Initialize Job Queue Manager
    const jobQueueManager: JobQueueManager = Container.get(JobQueueManager);
    jobQueueManager.init();

    const schedulerManager: SchedulerManager = new SchedulerManager();

    // Start status check scheduler if enabled
    if (config.schedulerConfig.statusCheck.enable) {
        // schedulerManager.startStatusCheck();
        Logger.info('Status check service started.');
    }

    // Initialize Monitoring Service
    const monitoringService: MonitoringService = Container.get(MonitoringService);
    monitoringService.init();

    // Start Monitoring Service for LMS
    if (config.schedulerConfig.metricsMonitor.enable && config.host.type === 'LMS' && !config.isStandaloneLms) {
        schedulerManager.startMetricsMonitoring();
        Logger.info('Monitoring service started.');
    }

    // Start Kafka Service
    if (!config.isStandaloneLms) {
        await kafkaService();
        Logger.info(`${config.host.type} subscribed to Kafka successfully.`);
    }

    // start heartbeat service for LMS
    if ((config.host.type === 'LMS') && (!config.isStandaloneLms)) {
        Logger.debug(`${config.host.type} starting heartbeat service`);
        schedulerManager.startHeartbeatService();
        Logger.info('Heartbeat service started.');
    }

    // Creating CMS admin
    if (config.host.type === 'CMS') {
        const email = config.cmsAdminConfig.email;
        const password = config.cmsAdminConfig.password;
        const name = config.cmsAdminConfig.name;
        const userRepo: UserRepo = Container.get(UserRepo);
        const UtilityService = Container.get(Utility);
        const verificationCode = UtilityService.generateCode();
        const found = await userRepo.findUser({ email });
        if (!found) {
            const userData = { id: uuidv4(), name: name, email, password, verificationCode, verified: true, role: 'cms-admin', approved: true };
            await userRepo.createUser(userData);
        }
    }

    // Creating LMS admin
    if (config.host.type === 'LMS') {
        const id = config.lmsAdminConfig.id || uuidv4();
        const email = config.lmsAdminConfig.email;
        const password = config.lmsAdminConfig.password;
        const name = config.lmsAdminConfig.name;
        const userRepo: UserRepo = Container.get(UserRepo);
        const UtilityService = Container.get(Utility);
        const verificationCode = UtilityService.generateCode();
        const found = await userRepo.findUser({ email });
        if (!found) {
            const userData = { id, name: name, email, password, verificationCode, verified: true, role: 'lms-admin', approved: true };
            await userRepo.createUser(userData);
        }
    }

    // Server register in CMS
    if (config.host.type === 'CMS') {
        const ServerServiceInstance = Container.get(ServerService);
        const found = await ServerServiceInstance.findServer(config.serverId);
        if (!found) {
            const server = await ServerServiceInstance.register('cms-server', config.rtspServerConfig.cmsServerIp, config.rtspServerConfig.cmsServerPort, 'CMS', config.serverId, config.kafkaConfig.consumerGroupId);
        }
    }

    // Start Express API Server
    apiServer();
};
