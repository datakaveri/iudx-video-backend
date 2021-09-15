import Container from 'typedi';
import { CronJob } from 'cron';

import Logger from '../common/Logger';
import config from '../config';
import StreamStatusService from '../services/StreamStatusService';
import MonitoringService from '../services/MonitoringService';
import HeartbeatService from '../services/HeartbeatService';

export default class SchedulerManager {
    private streamStatusService: StreamStatusService;
    private monitoringService: MonitoringService;
    private checkStatusJob: CronJob;
    private monitorMetricsJob: CronJob;
    private heartbeatService: HeartbeatService;
    private heartbeatJob: CronJob;

    constructor() {
        this.streamStatusService = Container.get(StreamStatusService);
        this.monitoringService = Container.get(MonitoringService);
        this.heartbeatService = Container.get(HeartbeatService);
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
                    console.log(err);
                }
            },
            null,
            true,
            'Asia/Kolkata'
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
            console.log(err);
        }
    }

    public async startMetricsMonitoring() {
        const cronTime: string = `*/${config.schedulerConfig.metricsMonitor.jobInterval} * * * * *`;

        this.monitorMetricsJob = new CronJob(
            cronTime,
            async () => {
                try {
                    this.monitoringService.pushMetricsToPrometheus();
                } catch (err) {
                    Logger.error(err);
                    console.log(err);
                }
            },
            null,
            true,
            'Asia/Kolkata'
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
            console.log(err);
        }
    }

    public async startHeartbeatService() {
        const cronTime: string = `*/${config.schedulerConfig.hearbeat.jobInterval} * * * *`;

        await this.heartbeatService.statusPing();

        this.heartbeatJob = new CronJob(
            cronTime,
            async () => {
                try {
                    await this.heartbeatService.statusPing();
                } catch (err) {
                    Logger.error(err);
                    console.log(err);
                }
            },
            null,
            true,
            'Asia/Kolkata'
        );
        this.heartbeatJob.start();
    }

    public async stopHeartbeatService() {
        try {
            if (this.heartbeatJob) {
                this.heartbeatJob.stop();
            }
        } catch (err) {
            Logger.error(err);
            console.log(err);
        }
    }
}
