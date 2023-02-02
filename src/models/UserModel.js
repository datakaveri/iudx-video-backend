"use strict";
exports.__esModule = true;
var sequelize_1 = require("sequelize");
var bcrypt_1 = require("bcrypt");
function UserModel(Database) {
    var model = Database.define('User', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize_1.DataTypes.UUID
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            get: function () {
                var _this = this;
                return function () { return _this.getDataValue('password'); };
            }
        },
        salt: {
            type: sequelize_1.DataTypes.STRING,
            get: function () {
                var _this = this;
                return function () { return _this.getDataValue('salt'); };
            }
        },
        verificationCode: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        verified: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false
        },
        role: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        approved: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: true
        }
    }, {
        timestamps: true
    });
    model.prototype.generateSalt = function () {
        return bcrypt_1["default"].genSaltSync();
    };
    model.prototype.encryptPassword = function (password, salt) {
        return bcrypt_1["default"].hashSync(password, salt);
    };
    model.prototype.isValidPassword = function (inputPassword) {
        return model.prototype.encryptPassword(inputPassword, this.salt()) === this.password();
    };
    var setSaltAndPassword = function (user) {
        if (user.changed('password')) {
            user.salt = model.prototype.generateSalt();
            user.password = model.prototype.encryptPassword(user.password(), user.salt());
        }
    };
    model.beforeCreate(setSaltAndPassword);
    return model;
}
exports.UserModel = UserModel;
