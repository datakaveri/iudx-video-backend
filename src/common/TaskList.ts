import { Container } from 'typedi';

import config from '../config';
import Logger from './Logger';
import KafkaManager from '../managers/Kafka';
import CameraService from '../services/CameraService';
import StreamService from '../services/StreamService';
import { KafkaMessageType } from '../common/Constants';

export const taskList = {

    registerCamera: async (payload, helpers) => {
        try {
            const cameraService: CameraService = Container.get(CameraService);
            const kafkaManager: KafkaManager = Container.get(KafkaManager);
            const topic: string = config.serverId + '.upstream';

            const { messageId, data } = payload;
            const result = await cameraService.register(data.userId, data.cameraData);
            await kafkaManager.publish(topic, { data: result }, KafkaMessageType.HTTP_RESPONSE, messageId);
        }
        catch (err) {
            Logger.error('error: %o', err);
            console.log(err);
        }
    },
    registerStream: async (payload, helpers) => {
        try {
            const streamService: StreamService = Container.get(StreamService);
            const kafkaManager: KafkaManager = Container.get(KafkaManager);
            const topic: string = config.serverId + '.upstream';

            const { messageId, data } = payload;
            const result = await streamService.register(data.userId, data.streamData);
            await kafkaManager.publish(topic, { data: result }, KafkaMessageType.HTTP_RESPONSE, messageId);
        }
        catch (err) {
            Logger.error('error: %o', err);
            console.log(err);
        }
    },

}