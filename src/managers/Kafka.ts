import { Kafka } from 'kafkajs';
import { Service } from 'typedi';

import config from '../config';
import UUID from '../common/UUID';

@Service()
export default class KafkaManager {
    private kafka: Kafka;
    private kafkaConsumerGroupId: string;

    constructor() { }

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
                    for (let [key, value] of Object.entries(message.headers)) {
                        message.headers[key] = value.toString();
                    }
                    callback(null, message);
                },
            });
        } catch (err) {
            callback(err);
        }
    }

    public async publish(topic: string, message: any, messageType: string, messageId?: string) {
        try {
            if (!messageId) {
                const namespace: string = config.host.type + 'KafkaMsg';
                messageId = new UUID().generateUUIDv5(namespace);
            }
            const msg = JSON.stringify(message);
            const producer = this.kafka.producer();
            await producer.connect();
            const record = await producer.send({
                topic,
                messages: [
                    {
                        value: msg,
                        headers: { messageId, messageType }
                    }
                ],
            });
            return { messageId, record };
        } catch (err) {
            throw err;
        }
    }
}
