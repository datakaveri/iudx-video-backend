import { Request, Response, NextFunction } from 'express';

import Prometheus from '../../common/Prometheus';

const requestCounters = (req: Request, res: Response, next: NextFunction) => {
    if (req.path !== '/api/metrics/') {
        Prometheus.numOfRequests.inc({
            method: req.method,
            route: req.path
        });
    }
    next();
};

const requestDetailsAndDuration = (req: Request, res: Response, next: NextFunction) => {
    if (req.path !== '/api/metrics/') {
        const endDuration = Prometheus.httpRequestDuration.startTimer({
            method: req.method,
            route: req.path
        });
        const endDetails = Prometheus.httpRequestDetails.startTimer({
            method: req.method,
            route: req.path
        });

        res.on('finish', () => {
            endDuration({ status: res.statusCode });
            endDetails({ status: res.statusCode });
        });
    }
    next();
};

export default {
    requestCounters,
    requestDetailsAndDuration,
};