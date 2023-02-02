"use strict";
exports.__esModule = true;
var sequelize_1 = require("sequelize");
function StreamModel(Database) {
    var StreamModel = Database.define('Stream', {
        streamId: {
            type: sequelize_1.DataTypes.UUID,
            primaryKey: true
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false
        },
        cameraId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false
        },
        provenanceStreamId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false
        },
        sourceServerId: {
            type: sequelize_1.DataTypes.INTEGER
        },
        destinationServerId: {
            type: sequelize_1.DataTypes.INTEGER
        },
        processId: {
            type: sequelize_1.DataTypes.INTEGER
        },
        streamName: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
        streamUrl: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
        streamType: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
        type: {
            type: sequelize_1.DataTypes.TEXT
        },
        isPublic: {
            type: sequelize_1.DataTypes.BOOLEAN
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN
        },
        isPublishing: {
            type: sequelize_1.DataTypes.BOOLEAN
        },
        isStable: {
            type: sequelize_1.DataTypes.BOOLEAN
        },
        totalClients: {
            type: sequelize_1.DataTypes.INTEGER
        },
        codec: {
            type: sequelize_1.DataTypes.TEXT
        },
        resolution: {
            type: sequelize_1.DataTypes.TEXT
        },
        frameRate: {
            type: sequelize_1.DataTypes.INTEGER
        },
        bandwidthIn: {
            type: sequelize_1.DataTypes.BIGINT
        },
        bandwidthOut: {
            type: sequelize_1.DataTypes.BIGINT
        },
        bytesIn: {
            type: sequelize_1.DataTypes.BIGINT
        },
        bytesOut: {
            type: sequelize_1.DataTypes.BIGINT
        },
        activeTime: {
            type: sequelize_1.DataTypes.INTEGER
        },
        lastAccessed: {
            type: sequelize_1.DataTypes.DATE
        },
        lastActive: {
            type: sequelize_1.DataTypes.DATE
        }
    }, {
        timestamps: true,
        defaultScope: {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }
    });
    return StreamModel;
}
exports.StreamModel = StreamModel;
