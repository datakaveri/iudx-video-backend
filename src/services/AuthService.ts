import { Service, Inject } from 'typedi';
import ServiceError from '../common/Error';
import Logger from '../common/Logger';
import UserRepo from '../repositories/UserRepo';
import MailService from './MailService';

@Service()
export default class AuthService {
    constructor(private mailService: MailService, private userRepo: UserRepo) {}

    public async signUp(userInput) {
        try {
            // await this.mailService.sendConfirmationMail(userInput.name, userInput.email, userInput.verificationCode);
            return { success: true };
        } catch (e) {
            Logger.error(e);
            throw e;
        }
    }

    public async approve(email) {
        try {
            let user = await this.userRepo.findUser({ email });
            if (user) {
                if (user.role === 'provider' || user.role === 'lms-admin') {
                    await this.userRepo.updateUser({ email }, { approved: true });
                    return {
                        message: 'User approved',
                    };
                } else {
                    return {
                        message: 'Approval not required',
                    };
                }
            } else {
                throw new ServiceError('User not found');
            }
        } catch (e) {
            Logger.error(e);
            throw e;
        }
    }
}
