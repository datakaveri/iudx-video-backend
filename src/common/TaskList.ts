import { Container } from 'typedi';

import config from '../config';
import Logger from './Logger';
import KafkaManager from '../managers/Kafka';
import CameraService from '../services/CameraService';
import StreamService from '../services/StreamService';
import AuthService from '../services/AuthService';
import UserRepo from '../repositories/UserRepo';
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
    signUp: async (payload, helpers) => {
        try {
            const userRepo: UserRepo = Container.get(UserRepo);
            const kafkaManager: KafkaManager = Container.get(KafkaManager);
            const topic: string = config.serverId + '.upstream';

            const { messageId, data } = payload;
            await userRepo.createUser(data);
            await kafkaManager.publish(topic, { data: { created: true } }, KafkaMessageType.HTTP_RESPONSE, messageId);
        }
        catch (err) {
            Logger.error('error: %o', err);
            console.log(err);
        }
    },
    verifyUser: async (payload, helpers) => {
        try {
            const userRepo: UserRepo = Container.get(UserRepo);
            const kafkaManager: KafkaManager = Container.get(KafkaManager);
            const topic: string = config.serverId + '.upstream';

            const { messageId, data } = payload;
            await userRepo.updateUser({ email: data.email }, { verified: true });
            await kafkaManager.publish(topic, { data: { updated: true } }, KafkaMessageType.HTTP_RESPONSE, messageId);
        }
        catch (err) {
            Logger.error('error: %o', err);
            console.log(err);
        }
    },
    approveUser: async (payload, helpers) => {
        try {
            const authService: AuthService = Container.get(AuthService);
            const kafkaManager: KafkaManager = Container.get(KafkaManager);
            const topic: string = config.serverId + '.upstream';

            const { messageId, data } = payload;
            const result = await authService.approve(data.email);
            await kafkaManager.publish(topic, { data: result }, KafkaMessageType.HTTP_RESPONSE, messageId);
        }
        catch (err) {
            Logger.error('error: %o', err);
            console.log(err);
        }
    },
    requestStream: async (payload, helpers) => {
        try {
            const streamService: StreamService = Container.get(StreamService);
            const kafkaManager: KafkaManager = Container.get(KafkaManager);
            
            const topic: string = config.serverId + '.upstream';
            const { messageId, data } = payload;
            
            let cmsStreamData = await streamService.publishStreamToCloud(data.cmsServerId, data.streamData);

            await kafkaManager.publish(topic, { data: cmsStreamData }, KafkaMessageType.HTTP_RESPONSE, messageId);
        }
        catch (err) {
            Logger.error('error: %o', err);
            console.log(err);
        }
    }
}