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
        private kafkaManager: KafkaManager
    ) { }

    public async getStatus(streamId: string) {
        try {
            let streams = await this.streamRepo.getAllAssociatedStreams(streamId);

            streams = streams.map((stream) => {
                return {
                    streamId: stream.streamId,
                    cameraId: stream.cameraId,
                    provenanceStreamId: stream.provenanceStreamId,
                    streamName: stream.streamName,
                    streamUrl: stream.streamUrl,
                    type: stream.type,
                    isActive: stream.isActive,
                };
            });

            return streams;
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error Getting the stream status');
        }
    }

    public async updateStatus(streamId: string, destinationServerId: string, isActive: boolean, isStable: boolean) {
        try {
            return await this.streamRepo.updateStream(
                { streamId, destinationServerId },
                {
                    isActive,
                    isStable,
                    ...(!isActive && { processId: null }),
                    ...(isActive && { lastActive: Date.now() }),
                }
            );
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error Updating the stream status');
        }
    }

    public async updateStats(stream: any) {
        try {
            if (stream) {
                await this.streamRepo.updateStream(
                    { streamId: stream.streamId, destinationServerId: config.serverId },
                    {
                        totalClients: stream.nClients,
                        activeTime: parseInt(stream.time),
                        bandwidthIn: BigInt(stream.bwIn),
                        bandwidthOut: BigInt(stream.bwOut),
                        bytesIn: BigInt(stream.bytesIn),
                        bytesOut: BigInt(stream.bytesOut),
                        ...(stream.active && {
                            codec: `${stream.metaVideo.codec} ${stream.metaVideo.profile} ${stream.metaVideo.level}`,
                            resolution: `${stream.metaVideo.width}x${stream.metaVideo.height}`,
                            frameRate: parseInt(stream.metaVideo.frameRate),
                        }),
                    }
                );
            }
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error Updating the stream stats');
        }
    }

    public async getNginxRtmpStats() {
        try {
            const response: any = await got.get(config.rtmpServerConfig.statUrl);
            const streamsStats: Array<any> = await this.utilityService.parseNginxRtmpStat(response);
            return streamsStats;
        } catch (err) {
            Logger.error(err);
            throw new Error(err);
        }
    }

    public async publishStreamUpdates(streamId: string, destinationServerId: string) {
        const streamData = await this.streamRepo.findStream({ streamId, destinationServerId });
        const topic: string = config.serverId + '.upstream';
        const message: any = {
            taskIdentifier: 'updateStreamData',
            data: { query: { streamId, destinationServerId }, streamData }
        };

        await this.kafkaManager.publish(topic, message, KafkaMessageType.DB_REQUEST);
    }

    public async unpublishIfStreamIdle(oldStreamData: any, newStreamData: any): Promise<boolean> {
        if (config.host.type === 'LMS' || newStreamData.nClients > 0) return false;

        try {
            const currentTime = Date.now();
            const streamToUnpublish: any = { streamId: newStreamData.streamId, destinationServerId: config.serverId };
            const disconnectInterval: number = 60000 * config.schedulerConfig.statusCheck.streamDisconnectInterval;
            const topic: string = oldStreamData.sourceServerId + '.downstream';

            let lastAccessed = oldStreamData.lastAccessed;

            if (oldStreamData.totalClients > 0) {
                lastAccessed = currentTime;
                const message: any = { taskIdentifier: 'updateStreamData', data: { query: streamToUnpublish, streamData: { lastAccessed } } };
                await this.kafkaManager.publish(topic, message, KafkaMessageType.DB_REQUEST);
                await this.streamRepo.updateStream(streamToUnpublish, { lastAccessed });
            }

            if (oldStreamData.isActive && currentTime - lastAccessed > disconnectInterval) {
                const message: any = { taskIdentifier: 'unpublishStream', data: streamToUnpublish };
                await this.kafkaManager.publish(topic, message, KafkaMessageType.HTTP_REQUEST);

                return true;
            }

            return false;
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error Unpublishing streams');
        }
    }

    public async checkStatus() {
        Logger.debug(`Starting status check for all the available streams`);
        try {
            const streams: any = await this.streamRepo.getStreamsForStatusCheck();
            const rtmpStreams: Array<any> = await this.getNginxRtmpStats();

            for (const stream of streams) {
                let isActive: boolean = false;
                let statusUpdated: any = false;
                let streamRevived: boolean = false;

                switch (stream.type) {
                    case 'camera':
                        isActive = await this.ffmpegService.isStreamActive(stream.streamUrl);
                        break;
                    case 'rtmp':
                        const rtmpStream: any = rtmpStreams.find((streamData) => streamData.streamId === stream.streamId);

                        if (rtmpStream && rtmpStream.active) {
                            const isUnpublished: boolean = await this.unpublishIfStreamIdle(stream, rtmpStream);
                            isActive = !isUnpublished; // Status will be updated inactive if stream unpublished
                            await this.updateStats(rtmpStream);
                        }
                        break;
                    default:
                        throw new Error();
                }

                // Updates stream status in DB
                if (isActive || (isActive !== stream.isActive)) {
                    [statusUpdated] = await this.updateStatus(stream.streamId, stream.destinationServerId, isActive, isActive);
                }

                // Revive only local rtmp streams
                if (stream.streamId !== stream.provenanceStreamId && !isActive) {
                    streamRevived = await this.streamReviveService.reviveStream(stream);
                }

                // Publish stream updates to CMS
                if ((statusUpdated || streamRevived) && config.host.type === 'LMS' && !config.isStandaloneLms) {
                    await this.publishStreamUpdates(stream.streamId, stream.destinationServerId);
                }
            }
        } catch (err) {
            Logger.error(err);
            throw new ServiceError('Error checking stream status');
        }
    }
}
