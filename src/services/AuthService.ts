import { Service, Inject } from 'typedi';
import Logger from '../common/Logger';

@Service()
export default class AuthService {
    @Inject('UserModel') private userModel;
    constructor() {}

    public async signUp(userInput): Promise<{ user; token }> {
        try {
            return { user: '', token: '' };
        } catch (e) {
            Logger.error(e);
            throw e;
        }
    }
}
