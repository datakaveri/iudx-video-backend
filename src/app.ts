import 'reflect-metadata';

import Logger from './common/logger';
import supervisor from './supervisor';

async function startServer() {
    supervisor()
        .then(() => {
            Logger.info('Application started');
        })
        .catch((err) => {
            Logger.error(err);
            process.exit(1);
        });
}

startServer();
