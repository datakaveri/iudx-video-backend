import { Inject, Service } from 'typedi';
import Logger from '../common/Logger';
import FfmpegService from './FfmpegService';
import Queue from '../managers/Queue';
import StreamRepo from '../repositories/StreamRepo';

@Service()
export default class ProcessService {
    @Inject('queue') private queue: typeof Queue;
    constructor(private ffmpegService: FfmpegService, private streamRepo: StreamRepo) { }

    public addStreamProcess(streamInputId, streamOutputId, streamInputUrl, streamOutputUrl) {
        Logger.debug(`Adding stream creation process to the queue for the stream ${streamInputId}`);
        this.queue.add(async () => {
            const isActiveStream = await this.ffmpegService.isStreamActive(streamInputUrl);
            let processId = null;
            if (isActiveStream) {
                processId = await this.ffmpegService.createProcess(streamInputUrl, streamOutputUrl);
            }
            await this.streamRepo.updateStream(
                { streamId: streamInputId },
                { isPublishing: true, isActive: isActiveStream, isStable: isActiveStream }
            );
            await this.streamRepo.updateStream(
                { streamId: streamOutputId },
                { processId, isActive: isActiveStream, isStable: isActiveStream }
            );
        });
    }
}
