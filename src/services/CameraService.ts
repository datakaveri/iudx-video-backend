import { Service } from 'typedi';
import Logger from '../common/Logger';

import Utility from '../common/Utility';
import CameraRepo from '../repositories/CameraRepo';
import ServiceError from '../common/Error';

@Service()
export default class CameraService {
    constructor(private utilityService: Utility, private cameraRepo: CameraRepo) { }

    async register(cameraData: any) {
        try {
            await this.cameraRepo.registerCamera(cameraData);
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error Registering the data');
        }
    }

    async findOne(userId: string, cameraName: string): Promise<any> {
        try {
            return await this.cameraRepo.findCamera(userId, cameraName);
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error fetching the data');
        }
    }

    async findAll(page: number, size: number) {
        const { limit, offset } = this.utilityService.getPagination(page, size);

        try {
            const data = await this.cameraRepo.listAllCameras(limit, offset);
            const cameras = this.utilityService.getPagingData(data, page, limit);
            return cameras;
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error fetching the data');
        }
    }

    async update(userId: string, cameraName: string, params: any) {
        try {
            return await this.cameraRepo.updateCamera(userId, cameraName, params);
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error updating the data');
        }
    }

    async delete(userId: string, cameraName: string) {
        try {
            return await this.cameraRepo.deleteCamera(userId, cameraName);
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error deleting the data');
        }
    }
}
