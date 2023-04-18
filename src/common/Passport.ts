import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as CustomStrategy } from 'passport-custom';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import Logger from './Logger';

import config from '../config';
import Container from 'typedi';
import UserRepo from '../repositories/UserRepo';
import Utility from './Utility';
import AuthKafkaController from '../kafka/controllers/AuthKafkaController';
import { request } from 'express';

const UtilityService = Container.get(Utility);
const privateKey = UtilityService.getPrivateKey();
const authKafkaController = new AuthKafkaController();

passport.use(
    'signup',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            try {
                const verificationCode = UtilityService.generateCode();
                const userRepo: UserRepo = Container.get(UserRepo);
                const found = await userRepo.findUser({ email });
                if (found) {
                    return done(new Error('User already exists'));
                }
                const role = req.body.role;
                if (!(role === 'consumer' || role === 'provider' || role === 'lms-admin')) {
                    return done(new Error('Invalid role provided in request'));
                }
                const userId = uuidv4();
                const userData = { id: userId, name: req.body.name, email, password, verificationCode, verified: false, role: req.body.role };
                if (role === 'consumer') {
                    userData['approved'] = true;
                }
                const serverId: string = (req.query as any)['serverId'];
                if (serverId) {
                    await authKafkaController.signUp(serverId, userData);
                }
                await userRepo.createUser(userData);
                let result = { verificationCode };
                if (role === 'lms-admin') {
                    result['userId'] = userId;
                }
                return done(null, result);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    'token',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email: string, password: string, done) => {
            try {
                const userRepo: UserRepo = Container.get(UserRepo);
                const user = await userRepo.findUser({ email });
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }
                const validate = await userRepo.validatePassword({ email }, password);

                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }
                if (!user.verified) {
                    return done(null, false, { message: 'User is not verified' });
                }
                if (!user.approved) {
                    return done(null, false, { message: 'User registration not approved, contact admin' });
                }
                const payload = { userId: user.id, name: user.name, email: user.email, role: user.role };
                const token = jwt.sign(payload, privateKey, {
                    algorithm: 'ES256',
                    expiresIn: config.authConfig.jwtTokenExpiry,
                });
                return done(null, { token: token }, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
    'verify',
    new CustomStrategy(async (req, done) => {
        try {
            const code = req.query.verificationCode;
            const userRepo: UserRepo = Container.get(UserRepo);
            const user = await userRepo.findUser({ verificationCode: code });
            if (user && code === user.verificationCode) {
                const serverId: string = (req.query as any)['serverId'];
                if (serverId) {
                    await authKafkaController.verifyUser(serverId, { email: user.email });
                }
                await userRepo.updateUser({ email: user.email }, { verified: true });
                return done(null, { success: true, message: 'Verification successful' });
            } else {
                return done(null, { success: false, message: 'Wrong verification code provided' });
            }
        } catch (err) {
            return done(err);
        }
    })
);

passport.use('custom-jwt', 
    new CustomStrategy(async() => {
        var jwt;
        var jwtFromHeader = ExtractJwt.fromAuthHeaderAsBearerToken();
        if(jwtFromHeader === null)
        {
            var jwtFromBody = ExtractJwt.fromBodyField('query');
            jwt = jwtFromBody;
        }
        else{
            jwt = jwtFromHeader;
        }
        
        new JWTStrategy({
                secretOrKey: privateKey,
                algorithms: ['ES256'],
                jwtFromRequest: jwt,
                passReqToCallback: true,
            }, async (req, user, done) => {
                try {
                    req.user = user;
                    return done(null, user);
                } catch (error) {
                    done(error);
                }
            });   
        
    })

);

var customExtractor = (req) =>{
    var token = null;

    if ((req.headers && req.headers.authorization))
    {
        var parts = req.headers.authorization.split(' ');
        token = parts[1];
    }
    else
    {
        token = req.body.query;
    }
    return token;
}

passport.use(
    'jwt',
    new JWTStrategy(
        {
            secretOrKey: privateKey,
            algorithms: ['ES256'],
            //jwtFromRequest: ,
            jwtFromRequest: customExtractor,
            passReqToCallback: true,
        },
        async (req, user, done) => {
            try {
                req.user = user;
                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

export default passport;
