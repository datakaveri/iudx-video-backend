import Container from 'typedi';
import { CronJob } from 'cron';

import Logger from '../common/Logger';
import StreamStatusService from '../services/StreamStatusService';


export default class SchedulerManager {
    private streamStatusService: StreamStatusService;
    private checkStatusJob: CronJob;

    constructor() {
        this.streamStatusService = Container.get(StreamStatusService);
    }

    // TODO: - Consider running status check in a seperate thread   

    public async startStatusCheck() {
        this.checkStatusJob = new CronJob(
            "*/3 * * * *", // Every 3 minutes 
            async () => {
                try {
                    await this.streamStatusService.checkStatus();
                } catch (err) {
                    Logger.error(err);
                    console.log(err)
                }
            },
            null,
            true,
            "Asia/Kolkata"
        );
        this.checkStatusJob.start();
    }

    public async stopStatusCheck() {
        if (this.checkStatusJob) {
            this.checkStatusJob.stop();
        }
    }
}
