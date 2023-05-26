import { Router } from 'express';
import passport from 'passport';
import ServerExpressController from '../controllers/ServerExpressController';
import { AuthorizeRole } from '../middlewares/Authorization';

const route = Router();

export default (app: Router) => {
    const ServerController = new ServerExpressController();
//session:false due to passport version update
    app.use('/server', passport.authenticate('jwt', { session: false }), route);

    route.post('/', AuthorizeRole(['cms-admin', 'lms-admin']), (req, res, next) => ServerController.registerServer(req, res, next));

    route.get('/', (req, res, next) => ServerController.listAllServers(req, res, next));

};
