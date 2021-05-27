import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as CustomStrategy } from 'passport-custom';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import config from '../config';
import { UserInterface } from '../interfaces/UserInterface';
import Container from 'typedi';

const generateCode = () => {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length = 25;
    let code = '';
    for (let i = 0; i < length; i++) {
        code += characters[Math.floor(Math.random() * characters.length)];
    }
    return code;
};

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
                const verificationCode = generateCode();
                const UserModel: any = Container.get('UserModel');
                await UserModel.create({ id: uuidv4(), name: req.body.name, email, password, verificationCode, verified: false, role: req.body.role });
                return done(null, verificationCode);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email: string, password: string, done) => {
            try {
                const UserModel: any = Container.get('UserModel');
                const user = await UserModel.findOne({ where: { email } });
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }
                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }
                const userData = user.get({ plain: true });
                if (!userData.verified) {
                    return done(null, false, { message: 'User is not verified' });
                }
                const payload = { name: userData.name, email: userData.email };
                const token = jwt.sign(payload, config.authConfig.jwtSecret, {
                    expiresIn: config.authConfig.jwtTokenExpiry,
                });
                return done(null, { name: userData.name, email: userData.email, token: token }, { message: 'Logged in Successfully' });
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
            const UserModel: any = Container.get('UserModel');
            const user = await UserModel.findOne({ where: { verificationCode: code } });
            const userData: UserInterface = user.get({ plain: true });
            if (code === userData.verificationCode) {
                await UserModel.update({ verified: true }, { where: { email: userData.email } });
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
            secretOrKey: config.authConfig.jwtSecret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);

export default passport;