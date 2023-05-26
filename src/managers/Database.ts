import { Sequelize } from 'sequelize';
import Container from 'typedi';
import config from '../config';

import { UserModel } from '../models/UserModel';
import { CameraModel } from '../models/CameraModel';
import { StreamModel } from '../models/StreamModel';
import { PolicyModel } from '../models/PolicyModel';
import { ServerModel } from '../models/ServerModel';

const Database = new Sequelize(config.DatabaseURL, { dialect: 'postgres' });
const ModelDependencyInjector = () => {
    const models = [
        {
            name: 'UserModel',
            model: UserModel(Database),
        },
        {
            name: 'CameraModel',
            model: CameraModel(Database),
        },
        {
            name: 'StreamModel',
            model: StreamModel(Database),
        },
        {
            name: 'PolicyModel',
            model: PolicyModel(Database),
        },
        {
            name: 'ServerModel',
            model: ServerModel(Database),
        }
    ];
    models.forEach((m) => {
        Container.set(m.name, m.model);
    });
};

export { Database,ModelDependencyInjector };
