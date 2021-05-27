import { Router } from 'express';
import AuthExpressController from '../controllers/AuthExpressController';

const route = Router();

export default (app: Router) => {
    const AuthController = new AuthExpressController();
    app.use('/auth', route);

    route.post('/signup', AuthController.signUp);
    route.get('/verify', AuthController.verify);
    route.post('/login', AuthController.login);
    route.get('/logout', AuthController.logout);
};
