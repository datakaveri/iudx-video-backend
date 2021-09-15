import { Service, Inject } from 'typedi';

@Service()
export default class ServerRepo {
    @Inject('ServerModel') private serverModel;

    async addServer(serverData: any) {
        await this.serverModel.create(serverData);
    }

    async findServer(serverId: string): Promise<any> {
        const server = await this.serverModel.findOne({
            where: {
                serverId,
            },
        });

        return server;
    }

    async findAllLmsServers(): Promise<any> {
        const servers = await this.serverModel.findAll({
            where: {
                serverType: 'LMS'
            },
            attributes: ['serverId', 'serverName', 'lastPingTime']
        });
        return servers;
    }

    async updateServerData(query: any, updateData: any) {
        return await this.serverModel.update(updateData, { where: query });
    }
}
