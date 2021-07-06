import { DataTypes, Model, Sequelize } from 'sequelize';
import { StreamInterface } from '../interfaces/StreamInterface';

interface IStreamModel extends Model<StreamInterface, any> { }

export function StreamModel(Database: Sequelize) {
    const StreamModel = Database.define<IStreamModel>(
        'Stream',
        {
            streamId: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            cameraId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            provenanceStreamId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            sourceServerId: {
                type: DataTypes.INTEGER
            },
            destinationServerId: {
                type: DataTypes.INTEGER
            },
            processId: {
                type: DataTypes.INTEGER,
            },
            streamName: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            streamUrl: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            streamType: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            type: {
                type: DataTypes.TEXT,
            },
            isPublic: {
                type: DataTypes.BOOLEAN,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
            },
            isPublishing: {
                type: DataTypes.BOOLEAN,
            },
            isStable: {
                type: DataTypes.BOOLEAN,
            },
            totalClients: {
                type: DataTypes.INTEGER,
            },
            codec: {
                type: DataTypes.TEXT,
            },
            resolution: {
                type: DataTypes.TEXT,
            },
            frameRate: {
                type: DataTypes.INTEGER,
            },
            bandwidthIn: {
                type: DataTypes.BIGINT,
            },
            bandwidthOut: {
                type: DataTypes.BIGINT,
            },
            bytesIn: {
                type: DataTypes.BIGINT,
            },
            bytesOut: {
                type: DataTypes.BIGINT,
            },
            activeTime: {
                type: DataTypes.INTEGER,
            },
            lastActive: {
                type: DataTypes.DATE,
            }
        },
        {
            timestamps: true,
            defaultScope: {
                attributes: {
                    exclude: ['userId', 'createdAt', 'updatedAt']
                }
            },

        }
    );

    return StreamModel;
}
