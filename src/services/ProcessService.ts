import { Inject, Service } from 'typedi';
import Logger from '../common/Logger';
import FfmpegService from './FfmpegService';
import Queue from '../managers/Queue';
import StreamRepo from '../repositories/StreamRepo';

@Service()
export default class ProcessService {
    @Inject('queue') private queue: typeof Queue;
    constructor(private ffmpegService: FfmpegService, private streamRepo: StreamRepo) { }

    /**
     * 
     * @param streamInputId - Input stream id (input and output stream id will be different during stream registration process)
     * @param streamOutputId - Ouput stream id
     * @param streamInputServerId - input stream id's server id ( input and output stream id will be different during LMS to CMS push stream)
     * @param streamOutputServerId - output stream id's server id
     * @param streamInputUrl - input stream url
     * @param streamOutputUrl - output stream url
     */
    public addStreamProcess(streamInputId, streamOutputId, streamInputServerId, streamOutputServerId, streamInputUrl, streamOutputUrl) {
        Logger.debug(`Adding stream creation process to the queue for the stream ${streamInputId}`);
        this.queue.add(async () => {
            const isActiveStream = await this.ffmpegService.isStreamActive(streamInputUrl);
            const isOutputStreamActive = await this.ffmpegService.isStreamActive(streamOutputUrl);

            if (isActiveStream && !isOutputStreamActive) {
                const processId = await this.ffmpegService.createProcess(streamInputUrl, streamOutputUrl);

                await this.streamRepo.updateStream(
                    { streamId: streamInputId, destinationServerId: streamInputServerId },
                    { isPublishing: true, isActive: isActiveStream, isStable: isActiveStream }
                );
                await this.streamRepo.updateStream(
                    { streamId: streamOutputId, destinationServerId: streamOutputServerId },
                    { processId, isActive: isActiveStream, isStable: isActiveStream }
                );
            }
        });
    }
}
