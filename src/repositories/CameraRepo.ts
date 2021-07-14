import { Service, Inject } from 'typedi';

@Service()
export default class CameraRepo {
    @Inject('CameraModel') private cameraModel;

    async registerCamera(cameraData: any) {
        const cameras = await this.cameraModel.bulkCreate(cameraData);
        const data = cameras.map(camera => {
            return {
                cameraId: camera.cameraId,
                cameraNum: camera.cameraNum,
                cameraName: camera.cameraName,
                cameraType: camera.cameraType,
                cameraUsage: camera.cameraUsage,
                cameraOrientation: camera.cameraOrientation,
                city: camera.city,
            }
        })

        return data;
    }

    async findCamera(cameraId: string): Promise<any> {
        const camera = await this.cameraModel.findOne({
            where: {
                cameraId,
            }
        })
        if (!camera) {
            throw new Error();
        }

        return camera;
    }

    async listAllCameras(limit: number, offset: number): Promise<any> {
        return await this.cameraModel.findAndCountAll({
            limit,
            offset,
        })
    }

    async updateCamera(cameraId: string, params: any): Promise<any> {
        const [updated, data] = await this.cameraModel.update(params, {
            where: {
                cameraId,
            },
            returning: [
                'cameraId',
                'cameraNum',
                'cameraName',
                'cameraType',
                'cameraUsage',
                'cameraOrientation',
                'city',
            ],
        })
        if (!updated) {
            throw new Error();
        }

        return data;
    }

    async deleteCamera(cameraId: string) {
        const deleted = await this.cameraModel.destroy({
            where: {
                cameraId,
            }
        })
        if (!deleted) {
            throw new Error();
        }
    }
}
