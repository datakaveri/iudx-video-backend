"use strict";
exports.__esModule = true;
var sequelize_1 = require("sequelize");
function PolicyModel(Database) {
    var model = Database.define('Policy', {
        policyId: {
            allowNull: false,
            primaryKey: true,
            type: sequelize_1.DataTypes.UUID
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false
        },
        cameraId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false
        },
        providerId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false
        },
        constraints: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true
        }
    }, {
        timestamps: true
    });
    return model;
}
exports.PolicyModel = PolicyModel;
