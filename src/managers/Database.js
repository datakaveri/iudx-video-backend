"use strict";
exports.__esModule = true;
var sequelize_1 = require("sequelize");
var typedi_1 = require("typedi");
var config_1 = require("../config");
var UserModel_1 = require("../models/UserModel");
var CameraModel_1 = require("../models/CameraModel");
var StreamModel_1 = require("../models/StreamModel");
var PolicyModel_1 = require("../models/PolicyModel");
var ServerModel_1 = require("../models/ServerModel");
var Database = new sequelize_1.Sequelize(config_1["default"].databaseURL, { dialect: 'postgres' });
exports.Database = Database;
var ModelDependencyInjector = function () {
    var models = [
        {
            name: 'UserModel',
            model: UserModel_1.UserModel(Database)
        },
        {
            name: 'CameraModel',
            model: CameraModel_1.CameraModel(Database)
        },
        {
            name: 'StreamModel',
            model: StreamModel_1.StreamModel(Database)
        },
        {
            name: 'PolicyModel',
            model: PolicyModel_1.PolicyModel(Database)
        },
        {
            name: 'ServerModel',
            model: ServerModel_1.ServerModel(Database)
        }
    ];
    models.forEach(function (m) {
        typedi_1["default"].set(m.name, m.model);
    });
};
exports.ModelDependencyInjector = ModelDependencyInjector;
