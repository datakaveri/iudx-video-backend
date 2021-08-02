import { Container } from 'typedi';

import Logger from '../../common/Logger';
import config from '../../config';
import eventEmitter from '../../common/EventEmitter';
import Utility from '../../common/Utility';
import KafkaManager from '../../managers/Kafka';
import JobQueueManager from '../../managers/JobQueue';
import CameraRepo from '../../repositories/CameraRepo';

export default class CameraKafkaController {
    private kafkaManager: KafkaManager;
    private jobQueueManager: JobQueueManager;
    private cameraRepo: CameraRepo;
    private utilityService: Utility;

    constructor() {
        this.kafkaManager = Container.get(KafkaManager);
        this.jobQueueManager = Container.get(JobQueueManager);
        this.cameraRepo = Container.get(CameraRepo);
        this.utilityService = Container.get(Utility);
    }

    public async subscribe() {
        const topic = config.host.type === 'CMS' ? /.*.upstream/ : config.serverId + '.downstream';
        await this.kafkaManager.subscribe(topic, (err, message) => this.handleMessage(err, message));
    }

    private async handleMessage(err, message) {
        if (!message) return;

        try {
            if (err) throw err;
            let msg: any;
            const messageId: string = message.headers.messageId;

            switch (message.headers.messageType) {
                case 'HTTP_REQ':
                    msg = JSON.parse(message.value.toString());
                    await this.jobQueueManager.add(msg.taskIdentifier, { messageId, data: msg.data });
                    break;

                case 'HTTP_RES':
                    msg = JSON.parse(message.value.toString());
                    eventEmitter.emit(messageId, msg.data);
                    break;

                default:
                    throw new Error(`Message Type not supported: ${message.headers.messageType}`);
            }
        }
        catch (err) {
            Logger.error('error: %o', err);
            throw err;
        }
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

