import { Model } from "sequelize";

export interface ServerInterface extends Model {
    serverId: string;
    serverName: string;
    serverType: string;
    upstreamTopic: string;
    downstreamTopic: string;
    consumerGroupId: string;
    lastPingTime: Date;
}
