"use strict";
exports.__esModule = true;
var sequelize_1 = require("sequelize");
function CameraModel(Database) {
    var CameraModel = Database.define('Camera', {
        cameraId: {
            type: sequelize_1.DataTypes.UUID,
            primaryKey: true
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false
        },
        serverId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false
        },
        cameraName: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
        cameraNum: {
            type: sequelize_1.DataTypes.TEXT
        },
        cameraType: {
            type: sequelize_1.DataTypes.TEXT
        },
        cameraUsage: {
            type: sequelize_1.DataTypes.TEXT
        },
        cameraOrientation: {
            type: sequelize_1.DataTypes.TEXT
        },
        city: {
            type: sequelize_1.DataTypes.TEXT
        },
        junction: {
            type: sequelize_1.DataTypes.TEXT
        },
        location: {
            type: sequelize_1.DataTypes.TEXT
        }
    }, {
        timestamps: true,
        defaultScope: {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }
    });
    return CameraModel;
}
exports.CameraModel = CameraModel;
