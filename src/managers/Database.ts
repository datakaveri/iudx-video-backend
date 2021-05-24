import { Sequelize } from 'sequelize';

import config from '../config';

export const Database = new Sequelize(config.databaseURL, {dialect: 'postgres'});
