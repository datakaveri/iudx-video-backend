import { Service, Inject } from 'typedi';
import { StreamInterface } from '../interfaces/StreamInterface';
import { Op, QueryTypes } from 'sequelize';
import { Database } from '../managers/Database';
import config from '../config';

export interface Data {
    streamId: string;
    cameraId: any;
    userId: any;
    provenanceStreamId: any;
    sourceServerId: string;
    destinationServerId: string;
    streamName: string;
    streamUrl: string;
    streamType: string;
    type: string;
    isPublic: any;
}

@Service()
export default class StreamRepo {
    @Inject('StreamModel') private streamModel;

    async registerLMSStream(streamId:string, cameraId:any, userId:any, provenanceStreamId:any, sourceServerId:string, destinationServerId:string, streamName:string, streamUrl:string, streamType:string, type:string, isPublic:any) {
        var streamData = {
            streamId,
            cameraId,
            userId,
            provenanceStreamId,
            sourceServerId,
            destinationServerId,
            streamName,
            streamUrl,
            streamType,
            type,
            isPublic
        }
        return await this.streamModel.create(streamData);
    }

    async registerCMSStream(streamId:string, cameraId:any, userId:any, provenanceStreamId:any, sourceServerId:string, destinationServerId:string, streamName:string, streamUrl:string, streamType:string, type:string, isPublic:any, lastAccessed:any) {
        var streamData = {
            streamId,
            cameraId,
            userId,
            provenanceStreamId,
            sourceServerId,
            destinationServerId,
            streamName,
            streamUrl,
            streamType,
            type,
            isPublic,
            lastAccessed
        }
        return await this.streamModel.create(streamData);
    }

    async registerOriginalStream(streamData:Array<any>)
    {
        return await this.streamModel.create(streamData);
    }

    async findStream(query: any, columns: Array<string> = null): Promise<any> {
        return await this.streamModel.findOne({ where: query, attributes: columns });
    }

    async listAllStreams(limit: number, offset: number, query: any = {}, columns: Array<string> = null): Promise<any> {
        return await this.streamModel.findAndCountAll({ where: query, limit, offset, attributes: columns, raw: true });
    }

    async deleteStream(query: any) {
        return await this.streamModel.destroy({ where: query });
    }

    public async updateStream(query: any, updateData: any) {
        return await this.streamModel.update(updateData, { where: query });
    }

    public async findAllStreams(query: any = {}, columns: Array<string> = null): Promise<[StreamInterface]> {
        return await this.streamModel.findAll({ where: query, attributes: columns, raw: true });
    }

    async getAllAssociatedStreams(streamId: string): Promise<any> {
        const query = `
            WITH RECURSIVE streamhierarchy AS (
                SELECT *
                FROM "Streams"
                WHERE "streamId" = '${streamId}'
                UNION
                    SELECT s.*
                    FROM "Streams" s
                    INNER JOIN streamhierarchy h ON h."streamId" = s."provenanceStreamId"
            ) 
            SELECT * FROM streamhierarchy; 
        `;

        return await Database.query(query, { type: QueryTypes.SELECT, raw: true });
    }

    async getStreamsForStatusCheck(): Promise<any> {
        const lastActiveInterval: number = config.schedulerConfig.statusCheck.lastActiveInterval;

        return await this.streamModel.findAll({
            where: {
                destinationServerId: config.serverId,
                [Op.or]: [
                    {
                        lastActive: {
                            [Op.is]: null,
                        },
                    },
                    {
                        lastActive: {
                            [Op.lt]: new Date(Date.now() - 60000 * lastActiveInterval),
                        },
                    },
                ],
            },
            raw: true,
        });
    }
}
