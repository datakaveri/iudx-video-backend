"use strict";
exports.__esModule = true;
var sequelize_1 = require("sequelize");
function ServerModel(Database) {
    var model = Database.define('Server', {
        serverId: {
            allowNull: false,
            primaryKey: true,
            type: sequelize_1.DataTypes.UUID
        },
        serverName: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
        serverHost: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
        serverRtmpPort: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false
        },
        serverType: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
        upstreamTopic: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
        downstreamTopic: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
        consumerGroupId: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
        lastPingTime: {
            type: sequelize_1.DataTypes.DATE
        }
    }, {
        timestamps: true
    });
    return model;
}
exports.ServerModel = ServerModel;
