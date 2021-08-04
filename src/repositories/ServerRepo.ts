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
}
