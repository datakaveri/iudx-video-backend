import { Router } from 'express';
import passport from 'passport';
import ServerExpressController from '../controllers/ServerExpressController';
import { AuthorizeRole, ValidateStreamAccess } from '../middlewares/Authorization';

const route = Router();

export default (app: Router) => {
    const ServerController = new ServerExpressController();

    app.use('/server', passport.authenticate('jwt', { session: true }), AuthorizeRole(['lms-admin']), route);

    route.post('/', ValidateStreamAccess, (req, res, next) => ServerController.registerServer(req, res, next));

};
