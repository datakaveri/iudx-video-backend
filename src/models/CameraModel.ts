import { DataTypes, Model, Sequelize } from 'sequelize';
import { CameraInterface } from '../interfaces/CameraInterface';

interface ICameraModel extends Model<CameraInterface, any> { }

export function CameraModel(Database: Sequelize) {
    const CameraModel = Database.define<ICameraModel>(
        'Camera',
        {
            cameraId: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.UUID,
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
        },
        {
            timestamps: true,
            defaultScope: {
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
        }
    );

    return CameraModel;
}
