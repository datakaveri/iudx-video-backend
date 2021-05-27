import Container from 'typedi';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

import Logger from '../common/Logger';
import { Database, ModelDependencyInjector } from '../managers/Database';
import apiServer from '../api-server';
import KafkaManager from '../managers/Kafka';
import config from '../config';

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

    // Start Express API Server
    apiServer();
};
