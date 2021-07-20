import { Service } from 'typedi';
import prometheusClient, { Registry } from 'prom-client';

import Logger from '../common/Logger';
import config from '../config';

@Service()
export default class MonitoringService {

    constructor() { }

    public registerPrometheusMetrics() {
        try {
            const register = new prometheusClient.Registry();
            prometheusClient.collectDefaultMetrics({ register });
            const registers = prometheusClient.Registry.merge([register, prometheusClient.register]);
            registers.setDefaultLabels({
                app: 'video-server',
                serverId: config.serverId,
            });
            return registers;
        }
        catch (err) {
            Logger.error(err);
            throw err;
        }
    }

    public pushMetricsToPrometheus(register: Registry) {
        try {
            const gateway = new prometheusClient.Pushgateway(
                config.prometheusConfig.pushGatewayUrl,
                { timeout: config.prometheusConfig.requestTimeout },
                register
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
}