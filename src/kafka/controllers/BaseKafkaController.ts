import { Container } from "typedi";

import config from "../../config";
import Logger from "../../common/Logger";
import eventEmitter from "../../common/EventEmitter";
import KafkaManager from "../../managers/Kafka";
import JobQueueManager from "../../managers/JobQueue";

export default class BaseController {
    private kafkaManager: KafkaManager;
    private jobQueueManager: JobQueueManager;
    private topic: any;
    private topicCount: number;

    constructor() {
        this.topicCount = 0;
        this.topic = config.host.type === 'CMS' ? /.*.upstream/ : config.serverId + '.downstream';
        this.kafkaManager = Container.get(KafkaManager);
        this.jobQueueManager = Container.get(JobQueueManager);
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

    public async subscribeToNewTopics() {
        try {
            const topics: Array<string> = await this.kafkaManager.listTopics();
            const noOfTopics: number = topics.length;
            if (this.topicCount !== 0 && this.topicCount < noOfTopics) {
                Logger.info('New Topics Detected.');
                await this.kafkaManager.unsubscribe();
                await this.subscribe();
            }
            this.topicCount = noOfTopics;
        }
        catch (err) {
            Logger.error('error: %o', err);
            throw err;
        }
    }

}


