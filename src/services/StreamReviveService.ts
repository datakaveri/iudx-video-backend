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
            const provenanceStream = await this.streamRepo.findStream(
                { streamId: stream.provenanceStreamId }
            );
            if (provenanceStream.isActive) {
                this.processService.addStreamProcess(provenanceStream.streamId, stream.streamId,
                    provenanceStream.streamUrl, stream.streamUrl);
            }
        }
        catch (err) {
            Logger.error(err);
            throw new Error();
        }
    }
}