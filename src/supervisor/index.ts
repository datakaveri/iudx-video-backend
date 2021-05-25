import Logger from '../common/Logger';
import { Database, ModelDependencyInjector } from '../managers/Database';
import apiServer from '../api-server';
import Container from 'typedi';
import KafkaManager from '../managers/Kafka';

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
    const KafkaManager: KafkaManager = Container.get('KafkaManager');
    KafkaManager.connect();

    // Start Express API Server
    apiServer();
};
