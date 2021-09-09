import { Service } from 'typedi';
import promClient from 'prom-client';

import Logger from '../common/Logger';
import config from '../config';

@Service()
export default class MonitoringService {
    private promRegister;

    constructor() { }

    public init() {
        this.registerPromMetrics();
        Object.freeze(this);
    }

    private registerPromMetrics() {
        const register = new promClient.Registry();
        this.promRegister = promClient.Registry.merge([register, promClient.register]);
        this.promRegister.setDefaultLabels({
            app: 'video-server',
            serverId: config.serverId,
        });
        promClient.collectDefaultMetrics({ register: this.promRegister });
    }

    public pushMetricsToPrometheus() {
        try {
            const gateway = new promClient.Pushgateway(
                config.prometheusConfig.pushGatewayUrl,
                { timeout: config.prometheusConfig.requestTimeout * 1000 },
                this.promRegister
            );

            gateway.push({ jobName: 'lms-metrics' }, (err, resp, body) => {
                if (err) throw err;
            });
        }
        catch (err) {
            Logger.error(err);
            throw err;
        }
    }

    public async getPromMetrics() {
        return await this.promRegister.metrics();
    }

    public getPromRegisterContentType() {
        return this.promRegister.contentType;
    }
}