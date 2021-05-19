import { Sequelize } from 'sequelize';

import config from '../config';

export const sequelize = new Sequelize(config.databaseURL, {dialect: 'postgres'});
