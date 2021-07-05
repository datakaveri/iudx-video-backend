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
            const streams: Array<any> = [];

            for (const stream of streamData) {
                const namespace: string = config.host.type + 'Stream';
                const streamId: string = new UUID().generateUUIDv5(namespace);

                const camera = await this.cameraRepo.findCamera({ userId, cameraId: stream.cameraId });

                if (!camera) {
                    return null;
                }

                streams.push({
                    streamId,
                    userId,
                    sourceServerId: config.serverId,
                    destinationServerId: config.serverId,
                    ...stream
                });
            }

            let result = await this.streamRepo.registerStream(streams);

            result = result.map((stream) => {
                return {
                    streamId: stream.streamId,
                    cameraId: stream.cameraId,
                    streamName: stream.streamName,
                    streamUrl: stream.streamUrl,
                    streamType: stream.streamType,
                    type: stream.type,
                    isPublic: stream.isPublic,
                };
            });
            await this.publishRegisteredStreams(streams);

            return result;
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error Registering the data');
        }
    }

    async findOne(userId: string, streamId: string): Promise<any> {
        try {
            const fields = [
                'streamId',
                'cameraId',
                'streamName',
                'streamType',
                'streamUrl',
                'streamType',
                'type',
                'isPublic',
            ];

            return await this.streamRepo.findStream({ userId, streamId }, fields);
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
            const streamData = await this.streamRepo.findStream({ userId, streamId });

            if (!streamData || streamData.type !== 'camera') {
                return 0;
            }

            const streams = await this.streamRepo.getAllAssociatedStreams(streamId);

            for (const stream of streams) {
                if (!stream.processId) continue;
                const isProcessRunning = await this.ffmpegService.isProcessRunning(stream.processId);

                if (isProcessRunning) {
                    await this.ffmpegService.killProcess(stream.processId);
                }
            }

            return await this.streamRepo.deleteStream({
                cameraId: streamData.cameraId,
                streamName: streamData.streamName
            });
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error deleting the data');
        }
    }
}
