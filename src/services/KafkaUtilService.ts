import { ConfigResourceTypes, Kafka } from 'kafkajs';
import { Service } from 'typedi';
import config from '../config';
import eventEmitter from '../common/EventEmitter';
import KafkaManager from '../managers/Kafka';

@Service()
export default class KafkaUtilService {
    constructor(private kafkaManger: KafkaManager) {}

    async createTopic(topicName) {
        try {
            const kafkaAdminClient = this.kafkaManger.kafka.admin();
            await kafkaAdminClient.connect();
            await kafkaAdminClient.createTopics({
                topics: [
                    {
                        topic: topicName,
                        configEntries: [
                            {
                                name: 'delete.retention.ms',
                                value: config.kafkaConfig.defaultRetentionValue,
                            },
                        ],
                    },
                ],
            });
            await kafkaAdminClient.disconnect();
        } catch (err) {
            throw err;
        }
    }

    async deleteTopic(topicName) {
        try {
            const kafkaAdminClient = this.kafkaManger.kafka.admin();
            await kafkaAdminClient.connect();
            await kafkaAdminClient.deleteTopics({
                topics: [topicName],
            });
            await kafkaAdminClient.disconnect();
        } catch (err) {
            throw err;
        }
    }

    async updateTopicRetentionPolicy(topicName, value) {
        try {
            const kafkaAdminClient = this.kafkaManger.kafka.admin();
            await kafkaAdminClient.connect();
            await kafkaAdminClient.alterConfigs({
                validateOnly: false,
                resources: [
                    {
                        type: ConfigResourceTypes.TOPIC,
                        name: topicName,
                        configEntries: [
                            {
                                name: 'delete.retention.ms',
                                value: value,
                            },
                        ],
                    },
                ],
            });
        } catch (err) {
            throw err;
        }
    }

    public async listTopics() {
        try {
            const kafkaAdminClient = this.kafkaManger.kafka.admin();
            await kafkaAdminClient.connect();
            const topics = await kafkaAdminClient.listTopics();
            await kafkaAdminClient.disconnect();
            return topics;
        }
        catch (err) {
            throw err;
        }
    }

    public getKafkaMessageResponse(messageId: string) {
        setTimeout(() => {
            eventEmitter.emit(messageId, null);
        }, config.kafkaConfig.messageWaitTime * 1000);

        return new Promise((resolve, reject) => {
            eventEmitter.once(messageId, data => {
                return resolve(data);
            });
        });
    }

}
