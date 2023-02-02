import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import Logger from '../../common/Logger';
import AuthService from '../../services/AuthService';
import AuthKafkaController from '../../kafka/controllers/AuthKafkaController';

export default class AuthExpressController {
    private authService: AuthService;
    private authKafkaController: AuthKafkaController;

    constructor() {
        this.authService = Container.get(AuthService);
        this.authKafkaController = new AuthKafkaController();
    }

    async signUp(req: Request, res: Response, next: NextFunction) {
        Logger.debug('Calling Sign-Up endpoint with body: %o', req.body);
        try {
            passport.authenticate('signup', async (err, result) => {
                try {
                    if (err) {
                        return next(err);
                    } else if (!result.verificationCode) {
                        const error = new Error('An error occurred.');
                        return next(error);
                    }
                    // send mail of confirmation code
                    // await this.authService.signUp({name: req.body.name, email: req.body.email, verificationCode})
                    let response = {
                        ...result.userId && { userId: result.userId },
                        message: 'User account created, please verify your email'
                    };
                    return res.status(201).json(response);
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
                    if (err) {
                        return next(err);
                    } else if(!result) {
                        const error = new Error('An error occurred.');
                        return next(error);
                    }
                    if (!result.success) {
                        return res.status(400).json(result);
                    }
                    return res.status(200).json(result);
                } catch (error) {
                    return next(error);
                }
            })(req, res, next);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async token(req: Request, res: Response, next: NextFunction) {
        Logger.debug('Calling Token endpoint with body: %o', req.body);
        try {
            passport.authenticate('token', (err, token, message) => {
                try {
                    if (err) {
                        return next(err);
                    } else if(!token) {
                        const error = new Error(message.message);
                        return next(error);
                    }
                    return res.json(token);
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
        Logger.debug('Calling Login endpoint');
        try {
            passport.authenticate('jwt', (err, user) => {
                try {
                    if (err) {
                        return next(err);
                    } else if(!user) {
                        const error = new Error('Invalid token provided');
                        return next(error);
                    }
                    req.login(user, { session: true }, async (error) => {
                        if (error) return next(error);
                        return res.json(user);
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
            // @ts-ignore: arguments 1-2
            req.logOut();
            return res.status(200).send();
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async rtmpTokenValidate(req: Request, res: Response, next: NextFunction) {
        Logger.debug('Calling rtmp token validate endpoint');
        try {
            passport.authenticate('jwt', (err, user) => {
                try {
                    if (err) {
                        return next(err);
                    } else if(!user) {
                        const error = new Error('Invalid token provided');
                        return next(error);
                    }
                    
                    return res.status(201).send();
                } catch (error) {
                    return next(error);
                }
            })(req, res, next);
        } catch(e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async approve(req: Request, res: Response, next: NextFunction) {
        Logger.debug('Calling user approval endpoint');
        const serverId: string = (req.query as any)['serverId'];
        let response: any;
        try {
            if (serverId) {
                response = await this.authKafkaController.approveUser(serverId, req.body.email, req.body.role);
            }
            else {
                response = await this.authService.approve(req.body.email, req.body.role);
            }
            return res.status(200).send(response);
        } catch(e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }
}
