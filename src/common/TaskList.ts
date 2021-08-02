import { Container } from 'typedi';

import CameraService from '../services/CameraService';
import KafkaManager from '../managers/Kafka';
import config from '../config';
import Logger from './Logger';

export const taskList = {

    registerCamera: async (payload, helpers) => {
        try {
            const cameraService: CameraService = Container.get(CameraService);
            const kafkaManager: KafkaManager = Container.get(KafkaManager);
            const topic: string = config.serverId + '.camera';

            const { messageId, data } = payload;
            const result = await cameraService.register(data.userId, data.cameraData);
            await kafkaManager.publish(topic, { data: result }, 'HTTP_RES', messageId);
        }
        catch (err) {
            Logger.error('error: %o', err);
            console.log(err);
        }
    },
}