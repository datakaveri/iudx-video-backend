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
            const metrics = await this.monitoringService.getPromMetrics();
            const contentType = this.monitoringService.getPromRegisterContentType();
            res.setHeader('Content-Type', contentType);
            res.end(metrics);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }


}
