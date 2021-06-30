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

    public addStreamProcess(streamId, streamInputUrl, streamOutputUrl) {
        Logger.debug(`Adding stream creation process to the queue for the stream ${streamId}`);
        this.queue.add(async () => {
            const isActiveStream = await this.ffmpegService.isStreamActive(streamInputUrl);
            if (isActiveStream) {
                const processId = await this.ffmpegService.createProcess(streamInputUrl, streamOutputUrl);
                this.streamRepo.updateStream(streamId, { processId, isActive: true, isPublishing: true, isStable: true });
            }
        });
    }

    public async initializeStreamProcess() {
        const streams = await this.streamRepo.findAllStreams({ type: 'camera' });
        for (let stream of streams) {
            try {
                this.addStreamProcess(stream.streamId, stream.streamUrl, `${config.rtmpServerConfig.serverUrl}/${stream.streamName}?password=${config.rtmpServerConfig.password}`);
            } catch (err) {
                console.log(err);
                Logger.error(err);
            }
        }
    }
}
