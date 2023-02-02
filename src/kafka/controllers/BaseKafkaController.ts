import { Container } from "typedi";

import config from "../../config";
import Logger from "../../common/Logger";
import eventEmitter from "../../common/EventEmitter";
import { KafkaMessageType, JobPriority } from "../../common/Constants";
import KafkaManager from "../../managers/Kafka";
import JobQueueManager from "../../managers/JobQueue";

export default class BaseKafkaController {
    private kafkaManager: KafkaManager;
    private jobQueueManager: JobQueueManager;
    private topic: any;

    constructor() {
        this.topic = config.host.type === 'CMS' ? /.*.upstream/ : config.serverId + '.downstream';
        this.jobQueueManager = Container.get(JobQueueManager);
        this.kafkaManager = Container.get(KafkaManager);
    }

    public async subscribe() {
        await this.kafkaManager.subscribe(this.topic, (err, message) => this.handleMessage(err, message));
    }

    public async handleMessage(err, message) {
        if (!message) return;

        try {
            if (err) throw err;
            let msg: any;
            const messageId: string = message.headers.messageId;

            switch (message.headers.messageType) {
                case KafkaMessageType.HTTP_REQUEST:
                    msg = JSON.parse(message.value.toString());
                    await this.jobQueueManager.add(msg.taskIdentifier, { messageId, data: msg.data }, JobPriority.HIGH);
                    break;

                case KafkaMessageType.HTTP_RESPONSE:
                    msg = JSON.parse(message.value.toString());
                    eventEmitter.emit(messageId, msg.data);
                    break;

                case KafkaMessageType.DB_REQUEST:
                    msg = JSON.parse(message.value.toString());
                    await this.jobQueueManager.add(msg.taskIdentifier, { messageId, data: msg.data }, JobPriority.LOW);
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

    public async subscribeToNewTopics() {
        try {
            await this.kafkaManager.unsubscribe();
            await this.subscribe();
        }
        catch (err) {
            Logger.error('error: %o', err);
            throw err;
        }
    }

}


