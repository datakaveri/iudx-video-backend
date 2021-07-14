import { Service } from 'typedi';
import _ from 'lodash';

import { Streams } from '../../../test/data/Streams';

@Service()
export default class StreamRepo {
    public registerStream: any = jest.fn().mockImplementation((streamData: any) => {
        return streamData;
    });

    public findStream: any = jest.fn().mockImplementation((query: any, columns: Array<string> = null) => {
        const stream = _.find(Streams, (obj) => {
            return (query.streamId ? obj.streamId === query.streamId : true) &&
                (query.cameraId ? obj.cameraId === query.cameraId : true) &&
                (query.streamName ? obj.streamName === query.streamName : true) &&
                (query.streamUrl ? obj.streamUrl === query.streamUrl : true);
        });

        if (!stream) {
            return null;
        }

        return columns ? _.pick(stream, columns) : stream;
    });

    public listAllStreams: any = jest.fn().mockImplementation((limit: number, offset: number, columns: Array<string> = null) => {
        return {
            count: Streams.length,
            rows: Streams.slice(offset, limit),
        }
    });

    public deleteStream: any = jest.fn().mockImplementation((query: any) => {
        const result = _.find(Streams, (obj) => {
            return (query.streamId ? obj.streamId === query.streamId : true) &&
                (query.cameraId ? obj.cameraId === query.cameraId : true) &&
                (query.streamName ? obj.streamName === query.streamName : true);
        });

        if (!result) {
            return 0;
        }

        return 1;
    });

    public updateStream: any = jest.fn().mockImplementation((query: any, updateData: any) => {
        const result = _.find(Streams, (obj) => {
            return obj.streamId === query.streamId;
        });

        if (!result) {
            return [0];
        }

        return [1, result];
    });

    public findAllStreams: any = jest.fn().mockImplementation((query: any = {}, columns: Array<string> = null) => {
        let streams: any = _.filter(Streams, (obj) => {
            return obj.cameraId === query.cameraId;
        });

        if (!streams) {
            return null;
        }

        streams = _.map(streams, stream => {
            return columns ? _.pick(stream, columns) : stream;
        });

        return streams;
    });

    public getAllAssociatedStreams: any = jest.fn().mockImplementation((streamId: string) => {
        const { cameraId, streamName } = _.find(Streams, (obj) => {
            return obj.streamId === streamId;
        });
        const streams = _.filter(Streams, (obj => {
            return obj.cameraId === cameraId && obj.streamName === streamName;
        }));

        return streams;
    });

    public getStreamsForStatusCheck: any = jest.fn().mockImplementation(() => {
        return Streams;
    });
}
