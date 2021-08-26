import { Service, Inject } from 'typedi';

@Service()
export default class CameraRepo {
    @Inject('CameraModel') private cameraModel;
    @Inject('PolicyModel') private policyModel;

    async registerCamera(cameraData: any) {
        return await this.cameraModel.create(cameraData);
    }

    async findCamera(query: any): Promise<any> {
        return await this.cameraModel.findOne({ where: query });
    }

    async listAllCameras(limit: number, offset: number, query: any = null, columns: Array<string> = null): Promise<any> {
        return await this.cameraModel.findAndCountAll({ where: query, limit, offset, attributes: columns });
    }

    async updateCamera(data: any, query: any, columns: Array<string> = []): Promise<any> {
        return await this.cameraModel.update(data, { where: query, returning: columns });
    }

    async deleteCamera(query: any) {
        return await this.cameraModel.destroy({ where: query });
    }

    async listCamerasBasedOnUserPolicy(limit: number, offset: number, userId: string, columns: Array<string> = null) {
        this.cameraModel.hasMany(this.policyModel, { foreignKey: 'cameraId' });

        return await this.cameraModel.findAndCountAll(
            {
                include: [{ model: this.policyModel, where: { userId }, attributes: [] }],
                limit,
                offset,
                attributes: columns,
            }
        );
    }
}
