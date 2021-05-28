import { Service, Inject } from 'typedi';
import Logger from '../common/Logger';
import MailService from './MailService';

@Service()
export default class AuthService {
    constructor(private mailService: MailService) {}

    public async signUp(userInput) {
        try {
            // await this.mailService.sendConfirmationMail(userInput.name, userInput.email, userInput.verificationCode);
            return { success: true };
        } catch (e) {
            Logger.error(e);
            throw e;
        }
    }
}
