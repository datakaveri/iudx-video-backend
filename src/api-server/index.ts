import express from 'express';
import cors from 'cors';

import Logger from '../common/Logger';
import routes from './routes';
import config from '../config';
import passport from '../common/Passport';
import ServiceError from '../common/Error';
// import apiMetrics from './middlewares/apiMetrics';

export default () => {
    const app = express();

    // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // It shows the real origin IP in the heroku or Cloudwatch logs
    app.enable('trust proxy');

    // The magic package that prevents frontend developers going nuts
    // Alternate description:
    // Enable Cross Origin Resource Sharing to all origins by default
    app.use(cors());

    // Middleware that transforms the raw string of req.body into json
    app.use(express.json());

    // Load Passort JS
    app.use(passport.initialize());

    // Enable collection of API metrics
    // app.use(apiMetrics.requestCounters);
    // app.use(apiMetrics.requestDetailsAndDuration);

    // Load API routes
    app.use(config.api.prefix, routes());

    /// catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err = new ServiceError('Resource Not Found');
        err['status'] = 404;
        err['title'] = 'Not Found';
        next(err);
    });

    /// error handlers
    app.use((err, req, res, next) => {
        /**
         * Handle 401 thrown by express-jwt library
         */
        if (err.name === 'UnauthorizedError') {
            return res.status(err.status).send({ message: err.message }).end();
        }
        return next(err);
    });
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            type: err.status || 500,
            title: err.title || 'Internal Server Error',
            detail: err.message,
        });
    });

    app.listen(config.port, () => {
        Logger.info(`Server listening on port: ${config.port}`);
    }).on('error', (err) => {
        Logger.error(err);
        process.exit(1);
    });
};
