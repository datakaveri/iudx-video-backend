import { Service, Inject } from 'typedi';
import config from '../config';

@Service()
export default class MailService {
    @Inject('emailClient') private emailClient;

    public async sendConfirmationMail(name, email, verificationCode) {
        const mailData = {
            from: config.emailConfig.username,
            to: email,
            subject: 'IUDX Video - Please confirm your account',
            html: `<h1>IUDX Video - Email Confirmation</h1>
            <h2>Hello ${name},</h2>
            <p>Please confirm your email by clicking on the following link</p>
            <a href=${config.authConfig.verificationUrl}${verificationCode}> Click here</a>
            </div>`,
        };
        this.emailClient.sendMail(mailData);
        return { delivered: 1, status: 'ok' };
    }
}
