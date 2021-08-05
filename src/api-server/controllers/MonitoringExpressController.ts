import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';

import Logger from '../../common/Logger';
import MonitoringService from '../../services/MonitoringService';

export default class MonitoringExpressController {
    private monitoringService: MonitoringService;

    constructor() {
        this.monitoringService = Container.get(MonitoringService);
    }

    public async getPromMetrics(req: Request, res: Response, next: NextFunction) {
        try {
            const register = this.monitoringService.registerPrometheusMetrics();
            const metrics = await register.metrics();
            res.setHeader('Content-Type', register.contentType);
            res.end(metrics);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }


}
