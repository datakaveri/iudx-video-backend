import Logger from '../common/logger';
import { sequelize } from '../managers/database';
import apiServer from '../api-server';

export default async () => {
    
    // Initialize Database connection
    try {
        await sequelize.authenticate();
        Logger.info('Connection has been established successfully.');
    } catch (error) {
        Logger.error(error);
    }

    // Start Express API Server
    apiServer();
}
