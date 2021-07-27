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
import UserRepo from '../repositories/UserRepo';
import Utility from '../common/Utility';

export default async () => {
    // Initialize Database connection and load model injector
    try {
        await Database.authenticate();
        Logger.info('Connection has been established successfully.');
        ModelDependencyInjector();
        Logger.info('Created DI of all models');
    } catch (error) {
        Logger.error(error);
    }

    // Initialize Kafka and Topics to listen for new messages
    // const KafkaManager: KafkaManager = Container.get('KafkaManager');
    // KafkaManager.connect();

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

    const schedulerManager: SchedulerManager = new SchedulerManager();

    // Start status check scheduler if enabled
    if (config.schedulerConfig.statusCheck.enable) {
        schedulerManager.startStatusCheck();
        Logger.info('Status check service started.');
    }

    // Initialize Monitoring Service
    if (config.schedulerConfig.metricsMonitor.enable && config.host.type === 'LMS') {
        schedulerManager.startMetricsMonitoring();
        Logger.info('Monitoring service started.');
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

    // Start Express API Server
    apiServer();
};
