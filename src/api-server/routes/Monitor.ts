import { Router } from 'express';

import MonitoringExpressController from '../controllers/MonitoringExpressController';

const route = Router();

export default (app: Router) => {
    const monitoringController = new MonitoringExpressController();
    app.use('/metrics', route);

    route.get('/', (req, res, next) => monitoringController.getPromMetrics(req, res, next));
};
