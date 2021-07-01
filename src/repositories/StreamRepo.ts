import { Service, Inject } from 'typedi';
import { StreamInterface } from '../interfaces/StreamInterface';
import { Op, QueryTypes } from 'sequelize';
import { Database } from '../managers/Database';
import config from '../config';

@Service()
export default class StreamRepo {
    @Inject('StreamModel') private streamModel;

    async registerStream(streamData: any) {
        const streams = await this.streamModel.bulkCreate(streamData);
        const data = streams.map((stream) => {
            return {
                streamId: stream.streamId,
                cameraId: stream.cameraId,
                streamName: stream.streamName,
                streamUrl: stream.streamUrl,
                streamType: stream.streamType,
                type: stream.type,
                isPublic: stream.isPublic,
            };
        });

        return data;
    }

    async findStream(userId: string, streamId: string): Promise<any> {
        const stream = await this.streamModel.findOne({
            where: {
                userId,
                streamId,
            },
            attributes: [
                'streamId',
                'cameraId',
                'streamName',
                'streamType',
                'streamUrl',
                'streamType',
                'type',
                'isPublic',
                'isActive'
            ],
        })
        if (!stream) {
            throw new Error();
        }

        return stream;
    }

    async listAllStreams(limit: number, offset: number): Promise<any> {
        return await this.streamModel.findAndCountAll({
            limit,
            offset,
            raw: true,
        });
    }

    async deleteStream(userId: string, streamId: string) {
        const deleted = await this.streamModel.destroy({
            where: {
                userId,
                streamId,
            },
        });
        if (!deleted) {
            throw new Error();
        }
    }

    async getStreamPid(userId: string, streamId: string): Promise<any> {
        const stream = await this.streamModel.findOne({
            where: {
                userId,
                streamId,
            },
            attributes: ['processId'],
        })
        if (!stream) {
            throw new Error();
        }

        return stream.processId;
    }

    public async updateStream(streamId, updateData) {
        await this.streamModel.update(updateData, { where: { streamId } });
    }

    public async findAllStreams(): Promise<[StreamInterface]> {
        return await this.streamModel.findAll({ raw: true });
    }

    async getStreamStatus(userId: string, streamId: string): Promise<any> {
        const query = `
            SELECT * 
            FROM "Streams"
            WHERE ("cameraId", "streamName") IN 
                    ( 
                        SELECT "cameraId", "streamName" 
                        FROM "Streams" 
                        WHERE 
                            "userId" = '${userId}' 
                            AND
                            "streamId" = '${streamId}'
                        LIMIT 1
                    ) 
        `;
        let streams: any = await Database.query(query, { type: QueryTypes.SELECT, raw: true });

        if (!streams || streams.length == 0) {
            throw new Error();
        }

        streams = streams.map(stream => {
            return {
                streamId: stream.streamId,
                cameraId: stream.cameraId,
                streamName: stream.streamName,
                streamUrl: stream.streamUrl,
                type: stream.type,
                isActive: stream.isActive,
            }
        })

        return streams;
    }

    async updateStreamStatus(streamId: string, params: any): Promise<any> {
        const [updated, data] = await this.streamModel.update(params, {
            where: {
                streamId
            },
            returning: [
                'streamId',
                'cameraId',
                'streamName',
                'streamUrl',
                'type',
                'isActive',
            ],
        })
        if (!updated) {
            throw new Error();
        }

        return data;
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
            attributes: ['streamId', 'streamName', 'streamUrl', 'type'],
            raw: true,
        })
    }
}
