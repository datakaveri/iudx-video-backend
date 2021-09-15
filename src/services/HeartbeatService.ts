import { Service, Inject } from 'typedi';
import config from '../config';
import KafkaManager from '../managers/Kafka';
import { KafkaMessageType } from '../common/Constants';

@Service()
export default class HeartbeatService {
    constructor(private kafkaManager: KafkaManager) {}

    async statusPing() {
        const topic: string = config.serverId + '.upstream';
        const message: any = {
            taskIdentifier: 'heartbeat',
            data: { serverId: config.serverId, pingTime: Date.now() },
        };

        await this.kafkaManager.publish(topic, message, KafkaMessageType.DB_REQUEST);
    }
}
