import { Router } from 'express';
import passport from 'passport';

import AuthExpressController from '../controllers/AuthExpressController';
import { AuthorizeRole } from '../middlewares/Authorization';

const route = Router();

export default (app: Router) => {
    const AuthController = new AuthExpressController();
    app.use('/auth', route);

    route.post('/signup', AuthController.signUp);
    route.get('/verify', AuthController.verify);
    route.post('/token', AuthController.token);
    route.get('/login', AuthController.login);
    route.get('/logout', AuthController.logout);
    route.post('/rtmp-token-verify', AuthController.rtspTokenValidate);
    //session:false due to passport version update
    route.post('/approve', passport.authenticate('jwt', { session: false }), AuthorizeRole(['lms-admin', 'cms-admin']), (req, res, next) => AuthController.approve(req, res, next));  
};
