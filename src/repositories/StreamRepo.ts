import { Service, Inject } from 'typedi';



@Service()
export default class StreamRepo {
    @Inject('StreamModel') private streamModel;

    async registerStream(streamData: any) {
        const streams = await this.streamModel.bulkCreate(streamData);
        const data = streams.map(stream => {
            return {
                streamId: stream.streamId,
                cameraId: stream.cameraId,
                streamName: stream.streamName,
                streamUrl: stream.streamUrl,
                streamType: stream.streamType,
                isPublic: stream.isPublic,
            }
        })

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
                'isPublic'
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
        })
    }

    async deleteStream(userId: string, streamId: string): Promise<any> {
        const deleted = await this.streamModel.destroy({
            where: {
                userId,
                streamId,
            }
        })
        if (!deleted) {
            throw new Error();
        }
    }
}
