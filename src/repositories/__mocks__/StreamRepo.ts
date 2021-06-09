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

        return _.omit(streamData, ['userId']);
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
}
