import { Service } from 'typedi';

import Logger from '../common/Logger';
import StreamRepo from '../repositories/StreamRepo';
import ProcessService from './ProcessService';

@Service()
export default class StreamReviveService {
    constructor(
        private streamRepo: StreamRepo,
        private processService: ProcessService,
    ) { }

    public async reviveStream(stream: any) {
        try {
            const streams = await this.streamRepo.getAllAssociatedStreams(stream.streamId);
            let outputStream: any;

            switch (stream.type) {
                case 'camera':
                    outputStream = streams.find(stream => stream.type === 'rtmp' &&
                        stream.sourceServerId === stream.destinationServerId);
                    break;
                case 'rtmp':
                    outputStream = streams.find(stream => stream.type === 'rtmp' &&
                        stream.sourceServerId !== stream.destinationServerId);
                    break;
                default:
                    throw new Error();
            }

            if (outputStream) {
                this.processService.addStreamProcess(stream.streamId, stream.streamUrl, outputStream.streamUrl);
            }
        }
        catch (err) {
            Logger.error(err);
            throw new Error();
        }
    }
}



