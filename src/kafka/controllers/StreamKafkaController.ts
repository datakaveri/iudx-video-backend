import { Container } from 'typedi';

import Logger from '../../common/Logger';
import { KafkaMessageType } from '../../common/Constants';
import KafkaManager from '../../managers/Kafka';
import StreamRepo from '../../repositories/StreamRepo';
import KafkaUtilService from '../../services/KafkaUtilService';

export default class StreamKafkaController {
    private kafkaManager: KafkaManager;
    private streamRepo: StreamRepo;
    private kafkaUtilService: KafkaUtilService;

    constructor() {
        this.kafkaManager = Container.get(KafkaManager);
        this.streamRepo = Container.get(StreamRepo);
        this.kafkaUtilService = Container.get(KafkaUtilService);
    }

    public async register(serverId: string, userId: string, streamData: any) {
        try {
            const topic: string = serverId + '.downstream';
            const message: any = { taskIdentifier: 'registerStream', data: { userId, streamData } };
            const { messageId } = await this.kafkaManager.publish(topic, message, KafkaMessageType.HTTP_REQUEST);
            const result = await this.kafkaUtilService.getKafkaMessageResponse(messageId);

            if (result) {
                result['streamData'].isPublishing = true;
                result['rtmpStreamData'].isActive = true;
                result['rtmpStreamData'].isStable = true;
                await this.streamRepo.registerStream(result['streamData']);
                await this.streamRepo.registerStream(result['rtmpStreamData']);
            }

            return result;
        } catch (err) {
            Logger.error('error: %o', err);
            throw err;
        }
    }

    public async delete(serverId: string, streamId: string) {
        try {
            const topic: string = serverId + '.downstream';
            const message: any = { taskIdentifier: 'deleteStream', data: { streamId } };
            const { messageId } = await this.kafkaManager.publish(topic, message, KafkaMessageType.HTTP_REQUEST);
            const result = await this.kafkaUtilService.getKafkaMessageResponse(messageId);

            if (result) {
                const streams = await this.streamRepo.getAllAssociatedStreams(streamId);
                for (const stream of streams) {
                    await this.streamRepo.deleteStream({ streamId: stream.streamId });
                }
            }

            return result;
        } catch (err) {
            Logger.error('error: %o', err);
            throw err;
        }
    }

    public async streamRequest(serverId: string, data: any) {
        try {
            const topic: string = serverId + '.downstream';
            const message: any = { taskIdentifier: 'requestStream', data };
            const { messageId } = await this.kafkaManager.publish(topic, message, KafkaMessageType.HTTP_REQUEST);
            const result: any = await this.kafkaUtilService.getKafkaMessageResponse(messageId);

            const isExistingStream = data.isExistingStream;
            if (!isExistingStream) {
                await this.streamRepo.registerStream(result);
            }

            await this.streamRepo.updateStream({ streamId: result.streamId, destinationServerId: result.sourceServerId }, { isPublishing: true });
            await this.streamRepo.updateStream({ streamId: result.streamId, destinationServerId: result.destinationServerId }, { isActive: true, isStable: true });
        } catch (err) {
            Logger.error('error: %o', err);
            throw err;
        }
    }
}
