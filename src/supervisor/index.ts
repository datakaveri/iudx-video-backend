import Container from 'typedi';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

import Logger from '../common/Logger';
import { Database, ModelDependencyInjector } from '../managers/Database';
import apiServer from '../api-server';
import config from '../config';
import Queue from '../managers/Queue';
import SchedulerManager from '../managers/Scheduler';
import JobQueueManager from '../managers/JobQueue';
import KafkaManager from '../managers/Kafka';
import kafkaService from '../kafka';

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

    //Initialize Kafka and Topics to listen for new messages
    const kafkaManager: KafkaManager = Container.get(KafkaManager);
    kafkaManager.connect();

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
        schedulerManager.startStatusCheck();
        Logger.info('Status check service started.');
    }

    // Initialize Monitoring Service
    if (config.schedulerConfig.metricsMonitor.enable && config.host.type === 'LMS') {
        schedulerManager.startMetricsMonitoring();
        Logger.info('Monitoring service started.');
    }

    // Start Kafka Service
    await kafkaService();

    // Start Express API Server
    apiServer();
};
