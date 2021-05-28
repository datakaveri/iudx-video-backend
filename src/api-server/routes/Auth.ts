import { Router } from 'express';
import Container from 'typedi';
import AuthExpressController from '../controllers/AuthExpressController';

const route = Router();

export default (app: Router) => {
    const AuthController = Container.get(AuthExpressController);
    app.use('/auth', route);

    route.post('/signup', AuthController.signUp);
    route.get('/verify', AuthController.verify);
    route.post('/token', AuthController.token);
    route.get('/login', AuthController.login);
    route.get('/logout', AuthController.logout);
};
