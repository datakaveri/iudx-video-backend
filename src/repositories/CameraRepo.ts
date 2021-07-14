import { Service, Inject } from 'typedi';

@Service()
export default class CameraRepo {
    @Inject('CameraModel') private cameraModel;

    async registerCamera(cameraData: any) {
        return await this.cameraModel.bulkCreate(cameraData);
    }

    async findCamera(query: any): Promise<any> {
        return await this.cameraModel.findOne({ where: query });
    }

    async listAllCameras(limit: number, offset: number): Promise<any> {
        return await this.cameraModel.findAndCountAll({ limit, offset });
    }

    async updateCamera(data: any, query: any, columns: Array<string> = []): Promise<any> {
        return await this.cameraModel.update(data, { where: query, returning: columns });
    }

    async deleteCamera(query: any) {
        return await this.cameraModel.destroy({ where: query });
    }
}
