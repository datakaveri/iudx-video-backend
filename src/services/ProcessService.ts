import { Inject, Service } from 'typedi';
import Logger from '../common/Logger';
import FfmpegService from './FfmpegService';
import Queue from '../managers/Queue';
import StreamRepo from '../repositories/StreamRepo';
import MediaMtxService from './MediaMtxService';

@Service()
export default class ProcessService {
    @Inject('queue') private queue: typeof Queue;
    constructor(private ffmpegService: FfmpegService, private streamRepo: StreamRepo, private MediaMtxService: MediaMtxService) { }

    /**
     * 
     * @param streamInputId - Input stream id (input and output stream id will be different during stream registration process)
     * @param streamOutputId - Ouput stream id
     * @param streamInputServerId - input stream id's server id ( input and output stream id will be different during LMS to CMS push stream)
     * @param streamOutputServerId - output stream id's server id
     * @param streamInputUrl - input stream url
     * @param streamOutputUrl - output stream url
     */
    addStreamProcess(streamInputId, streamOutputId, streamInputServerId, streamOutputServerId, streamInputUrl, streamOutputUrl) {
        Logger.debug(`Adding stream creation process to the queue for the stream ${streamInputId}`);
        this.queue.add(async () => {
            try {
                const isActiveStream = await this.ffmpegService.isStreamActive(streamInputUrl);
                const isOutputStreamActive = await this.ffmpegService.isStreamActive(streamOutputUrl);

                Logger.debug(`Is input stream active: ",${isActiveStream}`);
                Logger.debug(`Is input stream active: ",${isOutputStreamActive}`);
                
                if (isActiveStream && !isOutputStreamActive) {

                    Logger.debug(streamOutputId);
                    Logger.debug(streamInputUrl);    
                
                    const processId = await this.MediaMtxService.createRtspProcess(streamOutputId, streamInputUrl);
                    Logger.debug(processId);
                    // const processId = await this.ffmpegService.createProcess(streamInputUrl, streamOutputUrl);
                    await this.streamRepo.updateStream({ streamId: streamInputId, destinationServerId: streamInputServerId }, { isPublishing: true, isActive: true, isStable: true });
                    await this.streamRepo.updateStream({ streamId: streamOutputId, destinationServerId: streamOutputServerId }, { processId, isActive: true, isStable: true });
                }
            }
            catch (err) {
                Logger.error('Failed to create process');
                Logger.error(err);
            }
        });
    }
}
