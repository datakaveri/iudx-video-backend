import { Container } from 'typedi';

import Logger from '../../common/Logger';
import { KafkaMessageType } from '../../common/Constants';
import KafkaManager from '../../managers/Kafka';
import CameraRepo from '../../repositories/CameraRepo';
import StreamRepo from '../../repositories/StreamRepo';
import PolicyRepo from '../../repositories/PolicyRepo';
import KafkaUtilService from '../../services/KafkaUtilService';

export default class CameraKafkaController {
    private kafkaManager: KafkaManager;
    private cameraRepo: CameraRepo;
    private streamRepo: StreamRepo;
    private policyRepo: PolicyRepo;
    private kafkaUtilService: KafkaUtilService;

    constructor() {
        this.kafkaManager = Container.get(KafkaManager);
        this.cameraRepo = Container.get(CameraRepo);
        this.streamRepo = Container.get(StreamRepo);
        this.policyRepo = Container.get(PolicyRepo);
        this.kafkaUtilService = Container.get(KafkaUtilService);
    }

    public async register(serverId: string, userId: string, cameraData: any) {
        try {
            Logger.debug(`serverId: ${serverId}`);
            Logger.debug(`userId: ${userId}`);
            Logger.debug(`cameraData: ${cameraData}`);
            const topic: string = serverId + '.downstream';
            const message: any = { taskIdentifier: 'registerCamera', data: { userId, cameraData } };
            const { messageId } = await this.kafkaManager.publish(topic, message, KafkaMessageType.HTTP_REQUEST);
            Logger.debug(`messageId: ${messageId}`);
            const result = await this.kafkaUtilService.getKafkaMessageResponse(messageId);
            // Logger.debug(`messageId_response: ${Object.keys(result)}`);
            // Logger.debug(`messageId_response: ${Object.values(result)}`);
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

    public async update(serverId: string, cameraId: string, cameraData: any) {
        try {
            const topic: string = serverId + '.downstream';
            const message: any = { taskIdentifier: 'updateCamera', data: { cameraId, cameraData } };
            const { messageId } = await this.kafkaManager.publish(topic, message, KafkaMessageType.HTTP_REQUEST);
            const result = await this.kafkaUtilService.getKafkaMessageResponse(messageId);

            if (result) {
                await this.cameraRepo.updateCamera(cameraData, { cameraId });
            }

            return result;
        }
        catch (err) {
            Logger.error('error: %o', err);
            throw err;
        }
    }

    public async delete(serverId: string, cameraId: string) {
        try {
            const topic: string = serverId + '.downstream';
            const message: any = { taskIdentifier: 'deleteCamera', data: { cameraId } };
            const { messageId } = await this.kafkaManager.publish(topic, message, KafkaMessageType.HTTP_REQUEST);
            const result = await this.kafkaUtilService.getKafkaMessageResponse(messageId);

            await this.policyRepo.removePolicyByCamera(cameraId);

            if (result) {
                await this.streamRepo.deleteStream({ cameraId });
                await this.cameraRepo.deleteCamera({ cameraId });
            }

            return result;
        }
        catch (err) {
            Logger.error('error: %o', err);
            throw err;
        }
    }

}

