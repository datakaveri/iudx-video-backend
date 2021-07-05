import { Service, Inject } from 'typedi';
import { StreamInterface } from '../interfaces/StreamInterface';
import { Op, QueryTypes } from 'sequelize';
import { Database } from '../managers/Database';
import config from '../config';

@Service()
export default class StreamRepo {
    @Inject('StreamModel') private streamModel;

    async registerStream(streamData: Array<any>) {
        return await this.streamModel.bulkCreate(streamData);
    }

    async findStream(query: any, columns: Array<string> = null): Promise<any> {
        return await this.streamModel.findOne({ where: query, attributes: columns });
    }

    async listAllStreams(limit: number, offset: number): Promise<any> {
        return await this.streamModel.findAndCountAll({ limit, offset });
    }

    async deleteStream(query: any) {
        return await this.streamModel.destroy({ where: query });
    }

    public async updateStream(query: any, updateData: any) {
        return await this.streamModel.update(updateData, { where: query });
    }

    public async findAllStreams(query: any = {}): Promise<[StreamInterface]> {
        return await this.streamModel.findAll({ where: query, raw: true });
    }

    async getAllAssociatedStreams(streamId: string): Promise<any> {
        const query = `
            SELECT * 
            FROM "Streams"
            WHERE ("cameraId", "streamName") IN 
                    ( 
                        SELECT "cameraId", "streamName" 
                        FROM "Streams" 
                        WHERE "streamId" = '${streamId}'
                        LIMIT 1
                    ) 
        `;

        return await Database.query(query, { type: QueryTypes.SELECT, raw: true });
    }

    async getStreamsForStatusCheck(): Promise<any> {
        const lastActiveInterval: number = config.schedulers.statusCheck.lastActiveInterval;

        return await this.streamModel.findAll({
            where: {
                [Op.or]: [
                    {
                        lastActive: {
                            [Op.is]: null
                        }
                    },
                    {
                        lastActive: {
                            [Op.lt]: new Date(Date.now() - 60000 * lastActiveInterval)
                        }
                    }
                ]
            },
            raw: true,
        })
    }
}
