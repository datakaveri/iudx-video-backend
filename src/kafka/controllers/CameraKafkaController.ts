import { Container } from 'typedi';

import Logger from '../../common/Logger';
import { KafkaMessageType } from '../../common/Constants';
import KafkaManager from '../../managers/Kafka';
import CameraRepo from '../../repositories/CameraRepo';
import KafkaUtilService from '../../services/KafkaUtilService';

export default class CameraKafkaController {
    private kafkaManager: KafkaManager;
    private cameraRepo: CameraRepo;
    private kafkaUtilService: KafkaUtilService;


    constructor() {
        this.kafkaManager = Container.get(KafkaManager);
        this.cameraRepo = Container.get(CameraRepo);
        this.kafkaUtilService = Container.get(KafkaUtilService);
    }

    public async register(serverId: string, userId: string, cameraData: any) {
        try {
            const topic: string = serverId + '.downstream';
            const message: any = { taskIdentifier: 'registerCamera', data: { userId, cameraData } };
            const { messageId } = await this.kafkaManager.publish(topic, message, KafkaMessageType.HTTP_REQUEST);
            const result = await this.kafkaUtilService.getKafkaMessageResponse(messageId);

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

