import Container from 'typedi';
import { CronJob } from 'cron';

import Logger from '../common/Logger';
import config from '../config';
import StreamStatusService from '../services/StreamStatusService';
import MonitoringService from '../services/MonitoringService';

export default class SchedulerManager {
    private streamStatusService: StreamStatusService;
    private monitoringService: MonitoringService;
    private checkStatusJob: CronJob;
    private monitorMetricsJob: CronJob;

    constructor() {
        this.streamStatusService = Container.get(StreamStatusService);
        this.monitoringService = Container.get(MonitoringService);
    }

    // TODO: - Consider running status check in a seperate thread   

    public async startStatusCheck() {
        const cronTime: string = `*/${config.schedulerConfig.statusCheck.jobInterval} * * * *`;

        await this.streamStatusService.checkStatus();

        this.checkStatusJob = new CronJob(
            cronTime,
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
        try {
            if (this.checkStatusJob) {
                this.checkStatusJob.stop();
            }
        } catch (err) {
            Logger.error(err);
            console.log(err)
        }
    }

    public async startMetricsMonitoring() {
        const cronTime: string = `*/${config.schedulerConfig.metricsMonitor.jobInterval} * * * * *`;

        this.monitorMetricsJob = new CronJob(
            cronTime,
            async () => {
                try {
                    const register = this.monitoringService.registerPrometheusMetrics();
                    this.monitoringService.pushMetricsToPrometheus(register);
                } catch (err) {
                    Logger.error(err);
                    console.log(err)
                }
            },
            null,
            true,
            "Asia/Kolkata"
        );
        this.monitorMetricsJob.start();
    }

    public async stopMetricsMonitoring() {
        try {
            if (this.monitorMetricsJob) {
                this.monitorMetricsJob.stop();
            }
        } catch (err) {
            Logger.error(err);
            console.log(err)
        }
    }
}
