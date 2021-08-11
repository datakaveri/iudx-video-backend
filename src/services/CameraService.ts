import { Service } from 'typedi';
import Logger from '../common/Logger';

import Utility from '../common/Utility';
import CameraRepo from '../repositories/CameraRepo';
import ServiceError from '../common/Error';
import UUID from '../common/UUID';
import config from '../config';
import StreamRepo from '../repositories/StreamRepo';
import FfmpegService from './FfmpegService';

@Service()
export default class CameraService {
    constructor(
        private utilityService: Utility,
        private cameraRepo: CameraRepo,
        private streamRepo: StreamRepo,
        private ffmpegService: FfmpegService,
    ) { }

    public async register(userId: string, cameraData: any) {
        try {
            const namespace: string = config.host.type + 'Camera';
            const cameraId: string = new UUID().generateUUIDv5(namespace);
            const isDuplicateCamera: any = await this.cameraRepo.findCamera(cameraData);

            if (isDuplicateCamera) {
                return null;
            }

            cameraData = { cameraId, userId, ...cameraData };
            await this.cameraRepo.registerCamera(cameraData);
            return cameraData;
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error Registering the data');
        }
    }

    async findOne(cameraId: string): Promise<any> {
        try {
            return await this.cameraRepo.findCamera({ cameraId });
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error fetching the data');
        }
    }

    public async listAssociatedStreams(cameraId: string): Promise<any> {
        try {
            const fields = [
                'streamId',
                'provenanceStreamId',
                'streamName',
                'streamUrl',
                'streamType',
                'type',
                'isPublic',
            ];
            const streams: Array<any> = await this.streamRepo.findAllStreams({ cameraId }, fields);

            if (streams.length === 0) {
                return null;
            }

            return streams;
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error fetching the data');
        }
    }

    public async findAll(page: number, size: number) {
        try {
            const { limit, offset } = this.utilityService.getPagination(page, size);
            const data = await this.cameraRepo.listAllCameras(limit, offset);
            const cameras = this.utilityService.getPagingData(data, page, limit);
            return cameras;
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error fetching the data');
        }
    }

    public async update(cameraId: string, cameraData: any) {
        try {
            const fields = [
                'cameraId',
                'cameraNum',
                'cameraName',
                'cameraType',
                'cameraUsage',
                'cameraOrientation',
                'city',
            ];
            const [updated, result] = await this.cameraRepo.updateCamera(cameraData, { cameraId }, fields);

            if (!updated) {
                return null;
            }

            return result;
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error updating the data');
        }
    }

    public async delete(cameraId: string) {
        try {
            const streams: Array<any> = await this.streamRepo.findAllStreams({ cameraId });

            if (streams.length > 0) {
                for (const stream of streams) {
                    if (!stream.processId) continue;
                    const isProcessRunning = await this.ffmpegService.isProcessRunning(stream.processId);

                    if (isProcessRunning) {
                        await this.ffmpegService.killProcess(stream.processId);
                    }
                }
                await this.streamRepo.deleteStream({ cameraId });
            }

            return await this.cameraRepo.deleteCamera({ cameraId });
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error deleting the data');
        }
    }
}
