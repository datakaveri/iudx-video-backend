import { Inject, Service } from 'typedi';
import Logger from '../common/Logger';
import FfmpegService from './FfmpegService';
import Queue from '../managers/Queue';
import StreamRepo from '../repositories/StreamRepo';
import config from '../config';

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

    public async initializeStreamProcess() {
        const streams = await this.streamRepo.findAllStreams({ type: 'camera' });
        for (let stream of streams) {
            try {
                const isRunning = await this.ffmpegService.isProcessRunning(stream.processId);
                if (!isRunning) {
                    // this.addStreamProcess(stream.streamId, stream.streamUrl, `${config.rtmpServerConfig.serverUrl}/${stream.streamId}?token=${config.rtmpServerConfig.password}`);
                }
            } catch (err) {
                console.log(err);
                Logger.error(err);
            }
        }
    }
}
