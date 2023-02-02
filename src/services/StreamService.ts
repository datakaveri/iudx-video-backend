import { Service } from 'typedi';
import axios from 'axios';

import config from '../config';
import Logger from '../common/Logger';
import Utility from '../common/Utility';
import ServiceError from '../common/Error';
import UUID from '../common/UUID';
import { KafkaMessageType } from '../common/Constants';
import StreamRepo from '../repositories/StreamRepo';
import CameraRepo from '../repositories/CameraRepo';
import ProcessService from './ProcessService';
import FfmpegService from './FfmpegService';
import StreamStatusService from './StreamStatusService';
import ServerRepo from '../repositories/ServerRepo';
import KafkaManager from '../managers/Kafka';

@Service()
export default class StreamService {
    constructor(
        private utilityService: Utility,
        private streamRepo: StreamRepo,
        private cameraRepo: CameraRepo,
        private processService: ProcessService,
        private ffmpegService: FfmpegService,
        private streamStatusService: StreamStatusService,
        private serverRepo: ServerRepo,
        private kafkaManager: KafkaManager
    ) {}

    public async publishRegisteredStreams(streamData: any) {
        const namespace: string = config.host.type + 'Stream';
        const streamId: string = new UUID().generateUUIDv5(namespace);
        const rtmpStreamUrl = `${config.rtmpServerConfig.serverUrl}/${streamId}?token=${config.rtmpServerConfig.password}`;
        const rtmpStreamData: any = {
            streamId,
            cameraId: streamData['cameraId'],
            userId: streamData['userId'],
            provenanceStreamId: streamData['streamId'],
            sourceServerId: config.serverId,
            destinationServerId: config.serverId,
            streamName: 'Local Stream',
            streamUrl: rtmpStreamUrl,
            streamType: 'RTMP',
            type: 'rtmp',
            isPublic: streamData['isPublic'],
        };

        await this.streamRepo.registerStream(rtmpStreamData);
        this.processService.addStreamProcess(streamData['streamId'], streamId, rtmpStreamData.destinationServerId, rtmpStreamData.destinationServerId, streamData['streamUrl'], rtmpStreamUrl);
        return rtmpStreamData;
    }

    public async register(userId: string, streamData: any) {
        try {
            const namespace: string = config.host.type + 'Stream';
            const streamId: string = new UUID().generateUUIDv5(namespace);
            const isDuplicateStream = await this.streamRepo.findStream(streamData);
            const camera = await this.cameraRepo.findCamera({ cameraId: streamData['cameraId'] });

            if (!camera || isDuplicateStream) {
                return null;
            }

            streamData = {
                streamId,
                userId,
                provenanceStreamId: streamId,
                sourceServerId: config.serverId,
                destinationServerId: config.serverId,
                ...streamData,
            };

            await this.streamRepo.registerStream(streamData);
            const rtmpStreamData = await this.publishRegisteredStreams(streamData);
            return { streamData, rtmpStreamData };
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error Registering the data');
        }
    }

    public async findOne(streamId: string): Promise<any> {
        try {
            const fields = ['streamId', 'cameraId', 'streamName', 'streamType', 'streamUrl', 'streamType', 'type', 'isPublic'];

            return await this.streamRepo.findStream({ streamId, destinationServerId: config.serverId }, fields);
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error fetching the data');
        }
    }

    public async findAll(page: number, size: number, cameraId) {
        try {
            const fields = ['streamId', 'cameraId', 'sourceServerId', 'destinationServerId', 'streamName', 'streamType', 'isPublic', 'isActive', 'isPublishing'];
            const { limit, offset } = this.utilityService.getPagination(page, size);
            let streams = await this.streamRepo.listAllStreams(limit, offset, { type: 'rtmp', ...(cameraId && { cameraId }) }, fields);

            let response = this.utilityService.getPagingData(streams, page, limit);

            // TODO this change will break pagination
            response.results = response.results.reduce((res, stream) => {
                if (!res[stream.streamId]) {
                    res[stream.streamId] = stream;
                } else if (res[stream.streamId].destinationServerId !== config.serverId) {
                    res[stream.streamId] = stream;
                }
                return res;
            }, {});

            response.results = Object.values(response.results);

            response.results = response.results.map((stream) => {
                if (stream.isActive && stream.destinationServerId === config.serverId) {
                    return {
                        ...stream,
                        playbackUrlTemplate: `rtmp://${config.rtmpServerConfig.publicServerIp}:${config.rtmpServerConfig.publicServerPort}/live/${stream.streamId}?token=<TOKEN>`,
                    };
                }
                return stream;
            });

            return response;
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error fetching the data');
        }
    }

    public async deleteAssociatedStreams(streamId: string) {
        try {
            const streams = await this.streamRepo.getAllAssociatedStreams(streamId);

            if (Array.isArray(streams)) {
                streams.reverse();
            }

            for (const stream of streams) {
                if (stream.processId) {
                    const isProcessRunning = await this.ffmpegService.isProcessRunning(stream.processId);

                    if (isProcessRunning) {
                        await this.ffmpegService.killProcess(stream.processId);
                    }
                }
                await this.streamRepo.deleteStream({ streamId: stream.streamId });
            }
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error deleting streams');
        }
    }

    public async delete(streamId: string) {
        try {
            const streamData = await this.streamRepo.findStream({ streamId, type: 'camera' });

            if (!streamData) {
                return 0;
            }

            await this.deleteAssociatedStreams(streamData.streamId);
            return 1;
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error deleting the data');
        }
    }

    public async getStatus(streamId) {
        try {
            const status = await this.streamStatusService.getStatus(streamId);
            return status;
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error fetching status');
        }
    }

    public async streamRequest(streamId: string, requestType: any) {
        try {
            if (requestType === 'cloud') {
                // Checking if previously LMS to CMS stream was created, if its created we will have multiple records
                let existingStreamRecord = await this.streamRepo.findStream({ streamId, destinationServerId: config.serverId });

                let isExistingStream = !!existingStreamRecord;

                let lmsRtmpStream;
                let isPublishing = false;
                const lastAccessed = Date.now();

                // Get LMS RTMP Stream using stream id and server ids
                if (isExistingStream) {
                    lmsRtmpStream = await this.streamRepo.findStream({ streamId, destinationServerId: existingStreamRecord.sourceServerId });
                    isPublishing = lmsRtmpStream.isPublishing && existingStreamRecord.isActive;

                    // Sync stream last access data
                    const streamQuery: any = { streamId, destinationServerId: config.serverId };
                    const message: any = { taskIdentifier: 'updateStreamData', data: { query: streamQuery, streamData: { lastAccessed } } };
                    await this.kafkaManager.publish(`${existingStreamRecord.sourceServerId}.downstream`, message, KafkaMessageType.DB_REQUEST);
                    await this.streamRepo.updateStream(streamQuery, { lastAccessed });
                } else {
                    lmsRtmpStream = await this.streamRepo.findStream({ streamId });
                    isPublishing = false;
                }

                return {
                    apiResponse: {
                        streamId,
                        playbackUrlTemplate: `rtmp://${config.rtmpServerConfig.publicServerIp}:${config.rtmpServerConfig.publicServerPort}/live/${streamId}?token=<TOKEN>`,
                        isPublishing: isPublishing,
                        ...(!isPublishing && { message: 'Stream will be available shortly, please check status API to know the status' }),
                    },
                    kafkaRequestData: {
                        serverId: lmsRtmpStream.sourceServerId,
                        data: {
                            cmsServerId: config.serverId,
                            isExistingStream,
                            streamData: {
                                streamId: lmsRtmpStream['streamId'],
                                cameraId: lmsRtmpStream['cameraId'],
                                userId: lmsRtmpStream['userId'],
                                provenanceStreamId: lmsRtmpStream['streamId'],
                                sourceServerId: lmsRtmpStream['sourceServerId'],
                                destinationServerId: config.serverId,
                                streamName: 'Cloud Stream',
                                streamUrl: lmsRtmpStream['streamUrl'],
                                lastAccessed,
                            },
                        },
                    },
                };
            } else if (requestType === 'local') {
                const stream = await this.streamRepo.findStream({ streamId });
                const server = await this.serverRepo.findServer(stream.sourceServerId);

                return {
                    apiResponse: {
                        streamId,
                        playbackUrlTemplate: `rtmp://${server.serverHost}:${server.serverRtmpPort}/live/${streamId}?token=<TOKEN>`,
                        isPublishing: !!stream.isPublishing,
                        ...(!stream.isPublishing && { message: 'Stream will be available shortly, please check status API to know the status' }),
                    },
                };
            }
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error getting playback url');
        }
    }

    public async publishStreamToCloud(cmsServerId: string, lmsStreamData: any, isExistingStream: boolean) {
        try {
            const { data } = await axios.post(config.cmsTokenApiUrl, {
                email: config.lmsAdminConfig.email,
                password: config.lmsAdminConfig.password,
            });
            const token = data.token;
            const rtmpStreamUrl = `rtmp://${config.rtmpServerConfig.cmsServerIp}:${config.rtmpServerConfig.cmsServerPort}/live/${lmsStreamData['streamId']}?token=${config.rtmpServerConfig.password}`;
            const cmsRtmpStreamData: any = {
                streamId: lmsStreamData['streamId'],
                cameraId: lmsStreamData['cameraId'],
                userId: lmsStreamData['userId'],
                provenanceStreamId: lmsStreamData['streamId'],
                sourceServerId: lmsStreamData['sourceServerId'],
                destinationServerId: cmsServerId,
                streamName: lmsStreamData['streamName'],
                streamUrl: rtmpStreamUrl,
                streamType: 'RTMP',
                type: 'rtmp',
                isPublic: true,
                lastAccessed: lmsStreamData['lastAccessed'],
            };

            // confirm if stream already present in DB
            const foundStream = await this.streamRepo.findStream({
                streamId: cmsRtmpStreamData.streamId,
                destinationServerId: cmsRtmpStreamData.destinationServerId,
            });

            if (!isExistingStream && !foundStream) {
                await this.streamRepo.registerStream(cmsRtmpStreamData);
            }

            const sourceUrl = lmsStreamData['streamUrl'].replace(/token=.*$/, `token=${token}`);
            this.processService.addStreamProcess(lmsStreamData['streamId'], lmsStreamData['streamId'], lmsStreamData['sourceServerId'], cmsServerId, sourceUrl, rtmpStreamUrl);
            return cmsRtmpStreamData;
        } catch (e) {
            Logger.error('Failed to publish stream');
            throw e;
        }
    }
}
