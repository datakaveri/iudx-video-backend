import { Inject, Service } from 'typedi';
import Logger from '../common/Logger';

import Utility from '../common/Utility';
import StreamRepo from '../repositories/StreamRepo';
import ServiceError from '../common/Error';
import CameraRepo from '../repositories/CameraRepo';
import UUID from '../common/UUID';
import config from '../config';
import ProcessService from './ProcessService';
import FfmpegService from './FfmpegService';
import StreamStatusService from './StreamStatusService';

@Service()
export default class StreamService {
    constructor(
        private utilityService: Utility,
        private streamRepo: StreamRepo,
        private cameraRepo: CameraRepo,
        private processService: ProcessService,
        private ffmpegService: FfmpegService,
        private streamStatusService: StreamStatusService,
    ) { }

    async register(userId: string, streamData: any) {
        try {
            streamData = await Promise.all(streamData.map(async (stream) => {
                const camera = await this.cameraRepo.findCamera(stream.cameraId);

                if (!camera) {
                    throw new Error();
                }

                const namespace: string = config.host.type + 'Stream';
                const streamId: string = new UUID().generateUUIDv5(namespace);
                this.processService.addStreamProcess(streamId, stream.streamUrl, `${config.rtmpServerConfig.serverUrl}/${streamId}?token=${config.rtmpServerConfig.password}`);
                return { streamId, userId, ...stream };
            }));

            return await this.streamRepo.registerStream(streamData);
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error Registering the data');
        }
    }

    async findOne(streamId: string): Promise<any> {
        try {
            return await this.streamRepo.findStream(streamId);
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

    async delete(streamId: string) {
        try {
            const processId = await this.streamRepo.getStreamPid(streamId);
            const isProcessRunning = await this.ffmpegService.isProcessRunning(processId);
            if (isProcessRunning) {
                await this.ffmpegService.killProcess(processId);
            }
            await this.streamRepo.deleteStream(streamId);
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error deleting the data');
        }
    }

    async getStatus(streamId) {
        try {
            const status = await this.streamStatusService.getStatus(streamId);
            return status;
        } catch(e) {
            Logger.error(e);
            throw new ServiceError('Error fetching status');
        }
    }

    async playBackUrl(streamId) {
        try {
            const stream = await this.streamRepo.findStream(streamId);
            if (stream.isActive) {
                return {
                    urlTemplate: `${config.rtmpServerConfig.serverUrl}/${streamId}?token=<TOKEN>`,
                    isActive: true
                }
            } else {
                return {
                    isActive: false,
                    message: 'Stream will be available shortly, please check status API to know the status',
                    urlTemplate: `${config.rtmpServerConfig.serverUrl}/${streamId}}?token=<TOKEN>`
                }
            }
        } catch(e) {
            Logger.error(e);
            throw new ServiceError('Error getting playback url');
        }
    }
}
