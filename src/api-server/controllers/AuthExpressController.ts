import { Inject } from 'typedi';
import { Request, Response, NextFunction } from 'express';

import Logger from '../../common/Logger';
import AuthService from '../../services/AuthService';

class AuthExpressController {
    @Inject('AuthService') private authService: AuthService;
    constructor() {}

    async signup(req: Request, res: Response, next: NextFunction) {
        Logger.debug('Calling Sign-Up endpoint with body: %o', req.body);
            try {
                const { user, token } = await this.authService.SignUp(req.body);
                return res.status(201).json({ user, token });
            } catch (e) {
                Logger.error('error: %o', e);
                return next(e);
            }
    }
}

export default AuthExpressController;
