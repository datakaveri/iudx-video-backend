import { Container } from 'typedi';

import Logger from '../../common/Logger';
import { KafkaMessageType } from '../../common/Constants';
import KafkaManager from '../../managers/Kafka';
import UserRepo from '../../repositories/UserRepo';
import KafkaUtilService from '../../services/KafkaUtilService';

export default class AuthKafkaController {
    private kafkaManager: KafkaManager;
    private kafkaUtilService: KafkaUtilService;

    constructor() {
        this.kafkaManager = Container.get(KafkaManager);
        this.kafkaUtilService = Container.get(KafkaUtilService);
    }

    public async signUp(serverId: string, userData: any) {
        try {
            const topic: string = serverId + '.downstream';
            const message: any = { taskIdentifier: 'signUp', data: userData };
            const { messageId } = await this.kafkaManager.publish(topic, message, KafkaMessageType.HTTP_REQUEST);
            const result = await this.kafkaUtilService.getKafkaMessageResponse(messageId);

            if (!result['created']) {
                throw new Error('Error processing request');
            }

            return result;
        }
        catch (err) {
            Logger.error('error: %o', err);
            throw err;
        }
    }

    public async verifyUser(serverId: string, verificationData: any) {
        try {
            const topic: string = serverId + '.downstream';
            const message: any = { taskIdentifier: 'verifyUser', data: verificationData };
            const { messageId } = await this.kafkaManager.publish(topic, message, KafkaMessageType.HTTP_REQUEST);
            const result = await this.kafkaUtilService.getKafkaMessageResponse(messageId);

            if (!result['updated']) {
                throw new Error('Error processing request')
            }

            return result;
        }
        catch (err) {
            Logger.error('error: %o', err);
            throw err;
        }
    }

    public async approveUser(serverId: string, email: string) {
        try {
            const topic: string = serverId + '.downstream';
            const message: any = { taskIdentifier: 'approveUser', data: { email } };
            const { messageId } = await this.kafkaManager.publish(topic, message, KafkaMessageType.HTTP_REQUEST);
            const result = await this.kafkaUtilService.getKafkaMessageResponse(messageId);

            if (result['message'] === 'User approved') {
                const userRepo = Container.get(UserRepo);
                await userRepo.updateUser({ email }, { approved: true });
            }

            return result;
        }
        catch (err) {
            Logger.error('error: %o', err);
            throw err;
        }
    }
}