import 'reflect-metadata';

import Logger from './common/Logger';
import supervisor from './supervisor';

function startServer() {
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
