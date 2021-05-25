import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';

import config from '../config';
import Logger from '../common/Logger';

@Service()
export default class AuthService {
    @Inject('UserModel') private userModel;
    constructor() {}

    public async SignUp(userInput): Promise<{ user; token }> {
        try {
            return { user: '', token: '' };
        } catch (e) {
            Logger.error(e);
            throw e;
        }
    }
}
