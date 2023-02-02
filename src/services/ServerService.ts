import { Service } from 'typedi';
import Logger from '../common/Logger';

import ServiceError from '../common/Error';
import UUID from '../common/UUID';
import config from '../config';
import KafkaUtilService from './KafkaUtilService';
import ServerRepo from '../repositories/ServerRepo';
import BaseKafkaController from '../kafka/controllers/BaseKafkaController';

@Service()
export default class ServerService {
    constructor(private kafkaUtilService: KafkaUtilService, private serverRepo: ServerRepo) { }

    public async register(serverName: string, serverHost: string, serverRtmpPort: number, serverType: string, serverId?: string, consumerGroupId?: string) {
        try {
            const newServerId: string = serverId || new UUID().generateUUIDv5(serverName);

            // Create upstream and downstream topics for the server
            const upstreamTopicName = `${newServerId}.upstream`;
            const downstreamTopicName = `${newServerId}.downstream`;
            await this.kafkaUtilService.createTopic(upstreamTopicName);
            await this.kafkaUtilService.createTopic(downstreamTopicName);

            // Subscribe to new topics created
            if (serverType === 'LMS') {
                const baseKafkaController = new BaseKafkaController();
                await baseKafkaController.subscribeToNewTopics();
            }

            // Create consumer group id for the server
            const newConsumerGroupId = consumerGroupId || `${newServerId}-group`;

            // Update data in database
            await this.serverRepo.addServer({
                serverId: newServerId,
                serverName,
                serverType,
                serverHost,
                serverRtmpPort,
                upstreamTopic: upstreamTopicName,
                downstreamTopic: downstreamTopicName,
                consumerGroupId: newConsumerGroupId,
            });

            // return data
            return {
                serverId: newServerId,
                serverName,
                serverType,
                upstreamTopic: upstreamTopicName,
                downstreamTopic: downstreamTopicName,
                consumerGroupId: newConsumerGroupId,
                consumerUsername: config.kafkaConfig.consumerUsername,
                consumerPassword: config.kafkaConfig.consumerPassword,
                producerUsername: config.kafkaConfig.producerUsername,
                producerPassword: config.kafkaConfig.producerPassword,
            };
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error registering server');
        }
    }

    public async findServer(serverId) {
        try {
            const server = await this.serverRepo.findServer(serverId);
            return server;
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error fetching server data');
        }
    }

    public async listAllServers() {
        try {
            const server = await this.serverRepo.findAllLmsServers();
            return server;
        } catch (e) {
            Logger.error(e);
            throw new ServiceError('Error fetching server data');
        }
    }
}
