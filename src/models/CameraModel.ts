import { DataTypes, Model, Sequelize } from 'sequelize';
import { CameraInterface } from '../interfaces/CameraInterface';

interface ICameraModel extends Model<CameraInterface, any> { }

export function CameraModel(Database: Sequelize) {
    const CameraModel = Database.define<ICameraModel>(
        'Camera',
        {
            cameraId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            cameraNum: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            cameraName: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            streamName: {
                type: DataTypes.TEXT,
            },
            streamUrl: {
                type: DataTypes.TEXT,
            },
            cameraType: {
                type: DataTypes.TEXT,
            },
            cameraUsage: {
                type: DataTypes.TEXT,
            },
            cameraOrientation: {
                type: DataTypes.TEXT,
            },
            city: {
                type: DataTypes.TEXT,
            },
            location: {
                type: DataTypes.TEXT,
            },
            active: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            publishing: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            stable: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            }
        },
        {
            timestamps: true,
        }
    );

    return CameraModel;
}
