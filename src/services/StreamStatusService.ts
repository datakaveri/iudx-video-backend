import sequelize from 'sequelize';
import { Service } from 'typedi';
import got from 'got';

import Logger from '../common/Logger';
import config from '../config';
import Utility from '../common/Utility';
import StreamRepo from '../repositories/StreamRepo';
import FfmpegService from './FfmpegService';
import ServiceError from '../common/Error';

@Service()
export default class StreamStatusService {
    constructor(
        private ffmpegService: FfmpegService,
        private streamRepo: StreamRepo,
        private utilityService: Utility,
    ) { }

    async getStatus(streamId: string) {
        try {
            return await this.streamRepo.getStreamStatus(streamId);
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error Getting the stream status');
        }
    }

    async updateStatus(streamId: string, isActive: boolean) {
        try {
            return await this.streamRepo.updateStreamStatus(
                streamId,
                {
                    isActive,
                    ...isActive && { lastActive: sequelize.fn('NOW') }
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

                switch (stream.type) {
                    case 'camera':
                        isActive = await this.ffmpegService.isStreamActive(stream.streamUrl);
                        break;
                    case 'rtmp':
                        isActive = Array.isArray(nginxStreams) &&
                            nginxStreams.some(streamData => streamData.streamName === stream.streamName);
                        break;
                    default:
                        break;
                }

                await this.updateStatus(stream.streamId, isActive);
            }
        }
        catch (err) {
            Logger.error(err);
            throw new ServiceError('Error checking stream status');
        }
    }
}



