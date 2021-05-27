import { Inject } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import Logger from '../../common/Logger';
import AuthService from '../../services/AuthService';

class AuthExpressController {
    @Inject('AuthService') private authService: AuthService;
    constructor() {}

    async signUp(req: Request, res: Response, next: NextFunction) {
        Logger.debug('Calling Sign-Up endpoint with body: %o', req.body);
        try {
            passport.authenticate('signup', (err, confirmationCode) => {
                try {
                    if (err || !confirmationCode) {
                        const error = new Error('An error occurred.');
                        return next(error);
                    }

                    // send mail of confirmation code

                    return res.status(201).json({ message: 'User account created, please verify your email' });
                } catch (error) {
                    return next(error);
                }
            })(req, res, next);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async verify(req: Request, res: Response, next: NextFunction) {
        Logger.debug('Calling Verify endpoint');
        try {
            passport.authenticate('verify', (err, result) => {
                try {
                    if (err || !result) {
                        const error = new Error('An error occurred.');
                        return next(error);
                    }
                    if (!result.success) {
                        res.status(400).json(result);
                    }
                    res.status(200).json(result);
                } catch (error) {
                    return next(error);
                }
            })(req, res, next);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        Logger.debug('Calling Login endpoint with body: %o', req.body);
        try {
            passport.authenticate('login', (err, user) => {
                try {
                    if (err || !user) {
                        const error = new Error('An error occurred.');
                        return next(error);
                    }

                    req.login(user, { session: false }, async (error) => {
                        if (error) return next(error);
                        return res.json({ user });
                    });
                } catch (error) {
                    return next(error);
                }
            })(req, res, next);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        Logger.debug('Calling Logout endpoint');
        try {
            req.logOut();
            return res.redirect('/');
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }
}

export default AuthExpressController;
