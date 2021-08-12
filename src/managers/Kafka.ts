import { Kafka, Consumer, Producer } from 'kafkajs';
import { Service } from 'typedi';
import fs from 'fs';

import config from '../config';
import UUID from '../common/UUID';

@Service()
export default class KafkaManager {
    public kafka: Kafka;
    private kafkaConsumer: Consumer;
    private kafkaProducer: Producer;

    constructor() { }

    public connect() {
        this.kafka = new Kafka({
            clientId: config.kafkaConfig.clientId,
            brokers: config.kafkaConfig.brokers,
            ssl: {
                rejectUnauthorized: false,
                // ca: [fs.readFileSync(config.kafkaConfig.sslCAPath, 'utf-8')],
                // cert: [fs.readFileSync(config.kafkaConfig.sslCERTPath, 'utf-8')],
            },
            sasl: {
                mechanism: 'plain',
                username: config.kafkaConfig.adminUsername,
                password: config.kafkaConfig.adminPassword
            }
        });
        this.kafkaConsumer = this.kafka.consumer({ groupId: config.serverId + '-group' });
        this.kafkaProducer = this.kafka.producer();
        Object.freeze(this);
    }

    public async subscribe(topic: string, callback: any) {
        try {
            await this.kafkaConsumer.connect();
            await this.kafkaConsumer.subscribe({ topic });
            await this.kafkaConsumer.run({
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
            await this.kafkaProducer.connect();
            const record = await this.kafkaProducer.send({
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

    public async unsubscribe() {
        try {
            await this.kafkaConsumer.stop();
        }
        catch (err) {
            throw err;
        }
    }

}
