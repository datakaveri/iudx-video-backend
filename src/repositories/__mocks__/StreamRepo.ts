import { Service } from 'typedi';
import _ from 'lodash';

import { Streams } from '../../../test/data/Streams';

@Service()
export default class StreamRepo {
    public registerStream: any = jest.fn().mockImplementation((streamData: any) => {
        for (const data of streamData) {
            const isDuplicate = _.find(Streams, { streamId: data.streamId });
            if (isDuplicate) {
                throw new Error();
            }
        }

        return true;
    });

    public findStream: any = jest.fn().mockImplementation((userId: string, streamId: string) => {
        const streamData = _.find(Streams, (obj) => {
            return obj.userId === userId && obj.streamId === streamId;
        });

        if (!streamData) {
            throw new Error();
        }
        const streams = _.pick(streamData, [
            'cameraId',
            'streamId',
            'streamName',
            'streamType',
            'streamUrl',
            'isPublic'
        ]);

        return streams;
    });

    public listAllStreams: any = jest.fn().mockImplementation((limit: number, offset: number) => {
        const data = Streams.slice(offset, limit);

        return {
            count: Streams.length,
            rows: data
        }
    });


    public deleteStream: any = jest.fn().mockImplementation((userId: string, streamId: string) => {
        const streamData = _.find(Streams, (obj) => {
            return obj.userId === userId && obj.streamId === streamId;
        });

        if (!streamData) {
            throw new Error();
        }
    });

    public getStreamPid: any = jest.fn().mockImplementation((userId: string, streamId: string) => {
        const streamData = _.find(Streams, (obj) => {
            return obj.userId === userId && obj.streamId === streamId;
        });

        if (!streamData) {
            throw new Error();
        }

        return _.pick(streamData, ['processId']);
    });

    public updateStream: any = jest.fn().mockImplementation((streamId, updateData) => {
        const streamData = _.find(Streams, (obj) => {
            return obj.streamId === streamId;
        });
        if (!streamData) {
            throw new Error();
        }
        return true;
    });

    public findAllStreams: any = jest.fn().mockImplementation((param: any = {}) => {
        return Streams;
    });

    public getAllAssociatedStreams: any = jest.fn().mockImplementation((streamId: string) => {
        const { cameraId, streamName } = _.find(Streams, (obj) => {
            return obj.streamId === streamId;
        });
        const streams = _.filter(Streams, (obj => {
            return obj.cameraId === cameraId && obj.streamName === streamName;
        }));

        if (streams.length == 0) {
            throw new Error();
        }

        return streams;
    });

    public getStreamsForStatusCheck: any = jest.fn().mockImplementation(() => {
        return Streams;
    });
}
