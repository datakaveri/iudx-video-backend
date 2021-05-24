import { Kafka } from 'kafkajs';
import { Service } from 'typedi';

import config from '../config';

@Service()
export default class KafkaManager {
    private kafka: Kafka;
    private kafkaConsumerGroupId: string;

    constructor() {}

    public connect() {
        this.kafka = new Kafka({
            clientId: config.kafkaConfig.clientId,
            brokers: [config.kafkaConfig.brokers],
        });
        this.kafkaConsumerGroupId = config.kafkaConfig.consumerGroupId;
        Object.freeze(this);
    }

    public async subscribe(topic, callback) {
        try {
            const consumer = this.kafka.consumer({ groupId: this.kafkaConsumerGroupId });

            await consumer.connect();
            await consumer.subscribe({ topic });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    callback(null, message);
                },
            });
        } catch (err) {
            callback(err);
        }
    }

    public async publish(topic, message) {
        try {
            const msg = JSON.stringify(message);
            const producer = this.kafka.producer();
            await producer.connect();
            const record = await producer.send({
                topic,
                messages: [{ value: msg }],
            });
            return record;
        } catch(err) {
            throw err;
        }
    }
}
