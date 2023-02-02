import { DataTypes, Sequelize } from 'sequelize';
import { ServerInterface } from '../interfaces/ServerInterface';

export function ServerModel(Database: Sequelize) {
    const model = Database.define<ServerInterface>(
        'Server',
        {
            serverId: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
            },
            serverName: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            serverHost: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            serverRtmpPort: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            serverType: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            upstreamTopic: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            downstreamTopic: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            consumerGroupId: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            lastPingTime: {
                type: DataTypes.DATE,
            },
        },
        {
            timestamps: true,
        }
    );

    return model;
}
