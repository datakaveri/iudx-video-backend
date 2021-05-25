import { Router } from 'express';
import AuthExpressController from '../controllers/AuthExpressController';

const route = Router();

export default (app: Router) => {
    const AuthController = new AuthExpressController();
    app.use('/auth', route);

    route.post('/signup', AuthController.signup);
};
