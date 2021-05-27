import { DataTypes, Model, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import { UserInterface } from '../interfaces/UserInterface';

interface IUserModel extends Model<UserInterface, any> {
    generateSalt: () => string;
    encryptPassword: (password: string, salt: string) => string;
    isValidPassword: (password: string) => boolean;
}

export function UserModel(Database: Sequelize) {
    const model = Database.define<IUserModel>(
        'user',
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                get() {
                    return () => this.getDataValue('password');
                },
            },
            salt: {
                type: DataTypes.STRING,
                get() {
                    return () => this.getDataValue('salt');
                },
            },
            verificationCode: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            verified: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            timestamps: true,
        }
    );

    model.prototype.generateSalt = () => {
        return bcrypt.genSaltSync();
    };

    model.prototype.encryptPassword = (password, salt) => {
        return bcrypt.hashSync(password, salt);
    };

    model.prototype.isValidPassword = function (inputPassword) {
        return model.prototype.encryptPassword(inputPassword, this.salt()) === this.password();
    };

    const setSaltAndPassword = (user: any) => {
        if (user.changed('password')) {
            user.salt = model.prototype.generateSalt();
            user.password = model.prototype.encryptPassword(user.password(), user.salt());
        }
    };

    model.beforeCreate(setSaltAndPassword);

    return model;
}
