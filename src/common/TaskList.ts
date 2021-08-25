import { Container } from 'typedi';

import config from '../config';
import Logger from './Logger';
import { KafkaMessageType } from '../common/Constants';
import KafkaManager from '../managers/Kafka';
import CameraService from '../services/CameraService';
import StreamService from '../services/StreamService';
import AuthService from '../services/AuthService';
import UserRepo from '../repositories/UserRepo';
import StreamRepo from '../repositories/StreamRepo';
import FfmpegService from '../services/FfmpegService';

export const taskList = {
    // Auth related tasks

    signUp: async (payload, helpers) => {
        try {
            const userRepo: UserRepo = Container.get(UserRepo);
            const kafkaManager: KafkaManager = Container.get(KafkaManager);
            const topic: string = config.serverId + '.upstream';
            const { messageId, data } = payload;

            await userRepo.createUser(data);
            await kafkaManager.publish(topic, { data: { created: true } }, KafkaMessageType.HTTP_RESPONSE, messageId);
        } catch (err) {
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
        } catch (err) {
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

            const result = await authService.approve(data.email, data.role);
            await kafkaManager.publish(topic, { data: result }, KafkaMessageType.HTTP_RESPONSE, messageId);
        } catch (err) {
            Logger.error('error: %o', err);
            console.log(err);
        }
    },

    // Camera related tasks

    registerCamera: async (payload, helpers) => {
        try {
            const cameraService: CameraService = Container.get(CameraService);
            const kafkaManager: KafkaManager = Container.get(KafkaManager);
            const topic: string = config.serverId + '.upstream';
            const { messageId, data } = payload;

            const result = await cameraService.register(data.userId, data.cameraData);
            await kafkaManager.publish(topic, { data: result }, KafkaMessageType.HTTP_RESPONSE, messageId);
        } catch (err) {
            Logger.error('error: %o', err);
            console.log(err);
        }
    },
    updateCamera: async (payload, helpers) => {
        try {
            const cameraService: CameraService = Container.get(CameraService);
            const kafkaManager: KafkaManager = Container.get(KafkaManager);
            const topic: string = config.serverId + '.upstream';
            const { messageId, data } = payload;

            const result = await cameraService.update(data.cameraId, data.cameraData);
            await kafkaManager.publish(topic, { data: result }, KafkaMessageType.HTTP_RESPONSE, messageId);
        } catch (err) {
            Logger.error('error: %o', err);
            console.log(err);
        }
    },
    deleteCamera: async (payload, helpers) => {
        try {
            const cameraService: CameraService = Container.get(CameraService);
            const kafkaManager: KafkaManager = Container.get(KafkaManager);
            const topic: string = config.serverId + '.upstream';
            const { messageId, data } = payload;

            const result = await cameraService.delete(data.cameraId);
            await kafkaManager.publish(topic, { data: result }, KafkaMessageType.HTTP_RESPONSE, messageId);
        } catch (err) {
            Logger.error('error: %o', err);
            console.log(err);
        }
    },

    // Stream related tasks

    registerStream: async (payload, helpers) => {
        try {
            const streamService: StreamService = Container.get(StreamService);
            const kafkaManager: KafkaManager = Container.get(KafkaManager);
            const topic: string = config.serverId + '.upstream';
            const { messageId, data } = payload;

            const result = await streamService.register(data.userId, data.streamData);
            await kafkaManager.publish(topic, { data: result }, KafkaMessageType.HTTP_RESPONSE, messageId);
        } catch (err) {
            Logger.error('error: %o', err);
            console.log(err);
        }
    },
    deleteStream: async (payload, helpers) => {
        try {
            const streamService: StreamService = Container.get(StreamService);
            const kafkaManager: KafkaManager = Container.get(KafkaManager);
            const topic: string = config.serverId + '.upstream';
            const { messageId, data } = payload;

            const result = await streamService.delete(data.streamId);
            await kafkaManager.publish(topic, { data: result }, KafkaMessageType.HTTP_RESPONSE, messageId);
        } catch (err) {
            Logger.error('error: %o', err);
            console.log(err);
        }
    },
    updateStreamData: async (payload, helpers) => {
        try {
            const streamRepo: StreamRepo = Container.get(StreamRepo);
            const { data } = payload;

            await streamRepo.updateStream(data.query, data.streamData);
        } catch (err) {
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

            let cmsStreamData = await streamService.publishStreamToCloud(data.cmsServerId, data.streamData, data.isExistingStream);
            await kafkaManager.publish(topic, { data: cmsStreamData }, KafkaMessageType.HTTP_RESPONSE, messageId);
        } catch (err) {
            Logger.error('error: %o', err);
            console.log(err);
        }
    },
    unpublishStream: async (payload, helpers) => {
        try {
            const streamRepo: StreamRepo = Container.get(StreamRepo);
            const ffmpegService: FfmpegService = Container.get(FfmpegService);
            const { data } = payload;
            const queryData = { streamId: data.streamId, destinationServerId: data.destinationServerId };

            const stream = await streamRepo.findStream(queryData);
            if (stream.processId) {
                const isProcessRunning = await ffmpegService.isProcessRunning(stream.processId);

                if (isProcessRunning) {
                    await ffmpegService.killProcess(stream.processId);
                }
            }

            await streamRepo.updateStream(queryData, { isActive: false, isStable: false, lastActive: Date.now(), processId: null })
        } catch (err) {
            Logger.error('error: %o', err);
            console.log(err);
        }
    },

};
