import { Container } from 'typedi';

import Logger from '../../common/Logger';
import Utility from '../../common/Utility';
import KafkaManager from '../../managers/Kafka';
import CameraRepo from '../../repositories/CameraRepo';

export default class CameraKafkaController {
    private kafkaManager: KafkaManager;
    private cameraRepo: CameraRepo;
    private utilityService: Utility;

    constructor() {
        this.kafkaManager = Container.get(KafkaManager);
        this.cameraRepo = Container.get(CameraRepo);
        this.utilityService = Container.get(Utility);
    }

    public async register(serverId: string, userId: string, cameraData: any) {
        try {
            const topic: string = serverId + '.downstream';
            const message: any = { taskIdentifier: 'registerCamera', data: { userId, cameraData } };
            const { messageId } = await this.kafkaManager.publish(topic, message, 'HTTP_REQ');
            const result = await this.utilityService.getKafkaMessageResponse(messageId);
            if (result) {
                await this.cameraRepo.registerCamera(result);
            }
            return result;
        }
        catch (err) {
            Logger.error('error: %o', err);
            throw err;
        }
    }
}

