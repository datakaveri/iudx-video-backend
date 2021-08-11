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
import KafkaManager from '../managers/Kafka';
import { KafkaMessageType } from '../common/Constants';

@Service()
export default class StreamStatusService {
    constructor(
        private ffmpegService: FfmpegService,
        private streamRepo: StreamRepo,
        private utilityService: Utility,
        private streamReviveService: StreamReviveService,
        private kafkaManager: KafkaManager,
    ) { }

    public async getStatus(streamId: string) {
        try {
            let streams = await this.streamRepo.getAllAssociatedStreams(streamId);

            streams = streams.map(stream => {
                return {
                    streamId: stream.streamId,
                    cameraId: stream.cameraId,
                    provenanceStreamId: stream.provenanceStreamId,
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

    public async updateStatus(streamId: string, isActive: boolean, isStable: boolean, isPublishing: boolean) {
        try {
            return await this.streamRepo.updateStream(
                { streamId },
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

    public async updateStats(streamsStat: any) {
        try {
            if (!Array.isArray(streamsStat)) return;

            for (const stream of streamsStat) {
                await this.streamRepo.updateStream(
                    { streamId: stream.streamId },
                    {
                        totalClients: stream.nClients,
                        activeTime: parseInt(stream.time),
                        bandwidthIn: BigInt(stream.bwIn),
                        bandwidthOut: BigInt(stream.bwOut),
                        bytesIn: BigInt(stream.bytesIn),
                        bytesOut: BigInt(stream.bytesOut),
                        ...stream.active && {
                            codec: `${stream.metaVideo.codec} ${stream.metaVideo.profile} ${stream.metaVideo.level}`,
                            resolution: `${stream.metaVideo.width}x${stream.metaVideo.height}`,
                            frameRate: parseInt(stream.metaVideo.frameRate),
                        }
                    });
            }
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error Updating the stream stats');
        }
    }

    public async getNginxRtmpStat() {
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
        Logger.debug(`Starting status check for all the available streams`);
        try {
            const streams = await this.streamRepo.getStreamsForStatusCheck();

            if (streams.length === 0) {
                return null;
            }

            const containsRtmpStream = streams.some(stream => stream.type === 'rtmp');
            let nginxStreams;

            if (containsRtmpStream) {
                nginxStreams = await this.getNginxRtmpStat();
                this.updateStats(nginxStreams);
            }

            for (const stream of streams) {
                let isActive: boolean = false;
                let isProcessActive: any = false;
                let statusUpdated: any = false;
                let streamRevived: boolean = false;

                switch (stream.type) {
                    case 'camera':
                        isActive = await this.ffmpegService.isStreamActive(stream.streamUrl);
                        break;
                    case 'rtmp':
                        isActive = Array.isArray(nginxStreams) &&
                            nginxStreams.some(streamData => streamData.streamId === stream.streamId &&
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
                    statusUpdated = true;
                }
                else if (isActive !== stream.isActive) {
                    await this.updateStatus(stream.streamId, isActive, false, isProcessActive);
                    statusUpdated = true;
                }

                if (stream.streamId !== stream.provenanceStreamId && !isProcessActive) {
                    streamRevived = await this.streamReviveService.reviveStream(stream);
                }

                if ((statusUpdated || streamRevived) && config.host.type === 'LMS' && !config.isStandaloneLms) {
                    const streamData = this.streamRepo.findStream({ streamId: stream.streamId });
                    const topic: string = config.serverId + '.upstream';
                    const message: any = { taskIdentifier: 'updateStreamData', data: { query: { streamId: stream.streamId }, streamData } };
                    await this.kafkaManager.publish(topic, message, KafkaMessageType.DB_REQUEST)
                }
            }
        }
        catch (err) {
            Logger.error(err);
            throw new ServiceError('Error checking stream status');
        }
    }
}



