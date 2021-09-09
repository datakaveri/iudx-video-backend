import { Router } from 'express';
import passport from 'passport';
import ServerExpressController from '../controllers/ServerExpressController';
import { AuthorizeRole } from '../middlewares/Authorization';

const route = Router();

export default (app: Router) => {
    const ServerController = new ServerExpressController();

    app.use('/server', passport.authenticate('jwt', { session: true }), route);

    route.post('/', AuthorizeRole(['lms-admin']), (req, res, next) => ServerController.registerServer(req, res, next));

    route.get('/', (req, res, next) => ServerController.listAllServers(req, res, next));

};
