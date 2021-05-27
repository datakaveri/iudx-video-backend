import { Sequelize } from 'sequelize';
import Container from 'typedi';

import config from '../config';
import { UserModel } from '../models/UserModel';

const Database = new Sequelize(config.databaseURL, { dialect: 'postgres' });

const ModelDependencyInjector = () => {
    const models = [
        {
            name: 'UserModel',
            model: UserModel(Database),
        },
    ];
    models.forEach((m) => {
        Container.set(m.name, m.model);
    });
};
export { Database, ModelDependencyInjector };
