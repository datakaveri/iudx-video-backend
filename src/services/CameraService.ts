import { Service } from 'typedi';
import Logger from '../common/Logger';

import Utility from '../common/Utility';
import ServiceError from '../common/Error';
import UUID from '../common/UUID';
import config from '../config';
import CameraRepo from '../repositories/CameraRepo';
import StreamRepo from '../repositories/StreamRepo';
import PolicyRepo from '../repositories/PolicyRepo';
import StreamService from './StreamService';

@Service()
export default class CameraService {
    constructor(
        private utilityService: Utility,
        private cameraRepo: CameraRepo,
        private streamRepo: StreamRepo,
        private policyRepo: PolicyRepo,
        private streamService: StreamService,
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
                'cameraId',
                'provenanceStreamId',
                'sourceServerId',
                'destinationServerId',
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

    public async findAll(userId: string, role: string, page: number, size: number) {
        try {
            const fields = ['cameraId', 'cameraNum', 'cameraName', 'cameraType', 'cameraUsage', 'cameraOrientation', 'city', 'location'];
            const { limit, offset } = this.utilityService.getPagination(page, size);
            let data: any;

            switch (role) {
                case 'cms-admin':
                    data = await this.cameraRepo.listAllCameras(limit, offset, null, fields);
                    break;

                case 'lms-admin':
                case 'provider':
                    data = await this.cameraRepo.listAllCameras(limit, offset, { userId }, fields);
                    break;

                case 'consumer':
                    data = await this.cameraRepo.listCamerasBasedOnUserPolicy(limit, offset, userId, fields);
                    break;

                default:
                    throw new Error();
            }

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
            const streams = await this.streamRepo.findAllStreams({ cameraId, type: 'camera' });

            for (const stream of streams) {
                await this.streamService.deleteAssociatedStreams(stream.streamId);
            }

            await this.policyRepo.removePolicyByCamera(cameraId);

            return await this.cameraRepo.deleteCamera({ cameraId });
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error deleting the data');
        }
    }
}
