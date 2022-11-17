import { DataTypes, Sequelize } from 'sequelize';
import { PolicyInterface } from '../interfaces/PolicyInterface';

export function PolicyModel(Database: Sequelize) {
    const model = Database.define<PolicyInterface>(
        'Policy',
        {
            policyId: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            cameraId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            providerId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            constraints: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
        },
        {
            timestamps: true,
        }
    );

    return model;
}
