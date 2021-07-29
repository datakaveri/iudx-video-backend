import { ConfigResourceTypes, Kafka } from 'kafkajs';
import { Service } from 'typedi';
import config from '../config';

@Service()
export default class KafkaUtilService {
    private kafka = new Kafka({
        clientId: config.kafkaConfig.clientId,
        brokers: config.kafkaConfig.brokers,
    });

    async createTopic(topicName) {
        try {
            const kafkaAdminClient = this.kafka.admin();
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
            const kafkaAdminClient = this.kafka.admin();
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
            const kafkaAdminClient = this.kafka.admin();
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
}
