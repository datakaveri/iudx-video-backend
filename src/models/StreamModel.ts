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
