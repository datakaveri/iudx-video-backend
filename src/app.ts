import 'reflect-metadata';

import Logger from './common/Logger';
import supervisor from './supervisor';

if (process.env.NODE_ENV === 'development') {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';
}

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
