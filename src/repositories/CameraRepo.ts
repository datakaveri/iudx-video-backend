import { Service, Inject } from 'typedi';

@Service()
export default class CameraRepo {
    @Inject('CameraModel') private cameraModel;

    async registerCamera(cameraData: any) {
        await this.cameraModel.bulkCreate(cameraData);
    }

    async findCamera(userId: string, cameraName: string): Promise<any> {
        return await this.cameraModel.findOne({
            where: {
                userId,
                cameraName
            },
            attributes: {
                exclude: ['cameraId', 'userId', 'createdAt', 'updatedAt']
            }
        });
    }

    async listAllCameras(limit: number, offset: number): Promise<any> {
        return await this.cameraModel.findAndCountAll({
            limit,
            offset,
            attributes: {
                exclude: ['cameraId', 'userId', 'createdAt', 'updatedAt']
            }
        });
    }

    async updateCamera(userId: string, cameraName: string, params: any): Promise<any> {
        return await this.cameraModel.update(params, {
            where: {
                userId,
                cameraName
            }
        });
    }

    async deleteCamera(userId: string, cameraName: string): Promise<any> {
        return await this.cameraModel.destroy({
            where: {
                userId,
                cameraName
            }
        });
    }
}
