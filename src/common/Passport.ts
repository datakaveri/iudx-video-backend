import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as CustomStrategy } from 'passport-custom';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import config from '../config';
import Container from 'typedi';
import UserRepo from '../repositories/UserRepo';
import Utility from './Utility';

const UtilityService = Container.get(Utility);
const privateKey = UtilityService.getPrivateKey();

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
                await userRepo.createUser({ id: uuidv4(), name: req.body.name, email, password, verificationCode, verified: false, role: req.body.role });
                return done(null, verificationCode);
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
                const payload = { userId: user.id, name: user.name, email: user.email, role: user.role };
                const token = jwt.sign(payload, privateKey, {
                    algorithm: 'RS256',
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

passport.use(
    new JWTStrategy(
        {
            secretOrKey: privateKey,
            algorithms: ['RS256'],
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
