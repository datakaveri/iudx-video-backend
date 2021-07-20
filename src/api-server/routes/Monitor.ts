import { Router } from 'express';

import MonitoringController from '../controllers/MonitoringController';

const route = Router();

export default (app: Router) => {
    const monitoringController = new MonitoringController();
    app.use('/metrics', route);

    route.get('/', (req, res, next) => monitoringController.getPromMetrics(req, res, next));
};
