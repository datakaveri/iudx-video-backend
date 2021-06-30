import sequelize from 'sequelize';
import { Service } from 'typedi';
import got from 'got';

import Logger from '../common/Logger';
import config from '../config';
import Utility from '../common/Utility';
import StreamRepo from '../repositories/StreamRepo';
import FfmpegService from './FfmpegService';
import ServiceError from '../common/Error';
import StreamReviveService from './StreamReviveService';

@Service()
export default class StreamStatusService {
    constructor(
        private ffmpegService: FfmpegService,
        private streamRepo: StreamRepo,
        private utilityService: Utility,
        private streamReviveService: StreamReviveService,
    ) { }

    async getStatus(userId: string, streamId: string) {
        try {
            let streams = await this.streamRepo.getAllAssociatedStreams(streamId);
            streams = streams.map(stream => {
                return {
                    streamId: stream.streamId,
                    cameraId: stream.cameraId,
                    streamName: stream.streamName,
                    streamUrl: stream.streamUrl,
                    type: stream.type,
                    isActive: stream.isActive,
                }
            });
            return streams;
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error Getting the stream status');
        }
    }

    async updateStatus(streamId: string, isActive: boolean, isStable: boolean, isPublishing: boolean) {
        try {
            await this.streamRepo.updateStream(
                streamId,
                {
                    isActive,
                    isStable,
                    ...!isPublishing && { processId: null },
                    ...isActive && { lastActive: sequelize.fn('NOW') },
                });
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error Updating the stream status');
        }
    }

    async getNginxRtmpStat() {
        try {
            const response: any = await got.get(config.rtmpServerConfig.statUrl);
            const streamsStats = await this.utilityService.parseNginxRtmpStat(response);
            return streamsStats;
        } catch (err) {
            Logger.error(err);
            throw new Error(err);
        }
    };

    public async checkStatus() {
        try {
            const streams = await this.streamRepo.getStreamsForStatusCheck();

            if (!Array.isArray(streams) || streams.length === 0) {
                return;
            }

            const containsRtmpStream = streams.some(stream => stream.type === 'rtmp');
            let nginxStreams;

            if (containsRtmpStream) {
                nginxStreams = await this.getNginxRtmpStat();
            }

            for (const stream of streams) {
                let isActive: boolean = false;
                let isProcessActive: any = false;

                switch (stream.type) {
                    case 'camera':
                        isActive = await this.ffmpegService.isStreamActive(stream.streamUrl);
                        break;
                    case 'rtmp':
                        isActive = Array.isArray(nginxStreams) &&
                            nginxStreams.some(streamData => streamData.streamName === stream.streamId &&
                                streamData.active);
                        break;
                    default:
                        throw new Error();
                }

                if (stream.processId) {
                    isProcessActive = await this.ffmpegService.isProcessRunning(stream.processId);
                }

                if (isActive) {
                    await this.updateStatus(stream.streamId, isActive, true, isProcessActive);
                }
                else if (isActive !== stream.isActive) {
                    await this.updateStatus(stream.streamId, isActive, false, isProcessActive);
                }

                if (isActive && stream.isPublishing && !isProcessActive) {
                    await this.streamReviveService.reviveStream(stream);
                }
            }
        }
        catch (err) {
            Logger.error(err);
            throw new ServiceError('Error checking stream status');
        }
    }
}



