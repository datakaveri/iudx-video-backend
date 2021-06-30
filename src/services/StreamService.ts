import { Service } from 'typedi';
import Logger from '../common/Logger';

import Utility from '../common/Utility';
import StreamRepo from '../repositories/StreamRepo';
import ServiceError from '../common/Error';
import CameraRepo from '../repositories/CameraRepo';
import UUID from '../common/UUID';
import config from '../config';
import ProcessService from './ProcessService';
import FfmpegService from './FfmpegService';

@Service()
export default class StreamService {
    constructor(
        private utilityService: Utility,
        private streamRepo: StreamRepo,
        private cameraRepo: CameraRepo,
        private processService: ProcessService,
        private ffmpegService: FfmpegService,
    ) { }

    async publishRegisteredStreams(streamData: Array<any>) {
        const rtmpStreamData = streamData.map(stream => {
            const namespace: string = config.host.type + 'Stream';
            const streamId: string = new UUID().generateUUIDv5(namespace);
            const rtmpStreamUrl = `${config.rtmpServerConfig.serverUrl}/${streamId}?password=${config.rtmpServerConfig.password}`;

            this.processService.addStreamProcess(stream.streamId, stream.streamUrl, rtmpStreamUrl);
            return {
                streamId: streamId,
                cameraId: stream.cameraId,
                userId: stream.userId,
                sourceServerId: config.serverId,
                destinationServerId: config.serverId,
                streamName: stream.streamName,
                streamUrl: rtmpStreamUrl,
                streamType: 'RTMP',
                type: 'rtmp',
                isPublic: stream.isPublic,
            }
        });

        await this.streamRepo.registerStream(rtmpStreamData);
    }

    async register(userId: string, streamData: Array<any>) {
        try {
            streamData = await Promise.all(streamData.map(async (stream) => {
                const namespace: string = config.host.type + 'Stream';
                const streamId: string = new UUID().generateUUIDv5(namespace);

                await this.cameraRepo.findCamera(userId, stream.cameraId);

                return {
                    streamId,
                    userId,
                    sourceServerId: config.serverId,
                    destinationServerId: config.serverId,
                    ...stream
                };
            }));

            const result = await this.streamRepo.registerStream(streamData);
            await this.publishRegisteredStreams(streamData);
            return result;
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error Registering the data');
        }
    }

    async findOne(userId: string, streamId: string): Promise<any> {
        try {
            return await this.streamRepo.findStream(userId, streamId);
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error fetching the data');
        }
    }

    async findAll(page: number, size: number) {
        const { limit, offset } = this.utilityService.getPagination(page, size);

        try {
            const streams = await this.streamRepo.listAllStreams(limit, offset);
            const response = this.utilityService.getPagingData(streams, page, limit);
            return response;
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error fetching the data');
        }
    }

    async delete(userId: string, streamId: string) {
        try {
            const processId = await this.streamRepo.getStreamPid(userId, streamId);
            const isProcessRunning = await this.ffmpegService.isProcessRunning(processId);
            if (isProcessRunning) {
                await this.ffmpegService.killProcess(processId);
            }
            await this.streamRepo.deleteStream(userId, streamId);
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error deleting the data');
        }
    }
}
