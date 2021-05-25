import { DataTypes, Model } from 'sequelize/types';
import { Database } from '../managers/Database';
import bcrypt from 'bcrypt';
import { UserInterface } from '../interfaces/UserInterface';

interface IUserModel extends Model<UserInterface, any> {
    generateSalt: () => string;
    encryptPassword: (password: string, salt: string) => string;
    isValidPassword: (password: string) => boolean;
}

const UserModel = Database.define<IUserModel>(
    'User',
    {
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
            allowNull: false,
            get() {
                return () => this.getDataValue('salt');
            },
        },
    },
    {
        timestamps: true,
    }
);

UserModel.prototype.generateSalt = () => {
    return bcrypt.genSaltSync();
};

UserModel.prototype.encryptPassword = (password, salt) => {
    return bcrypt.hashSync(password, salt);
};

UserModel.prototype.isValidPassword = function (inputPassword) {
    return UserModel.prototype.encryptPassword(inputPassword, this.salt()) === this.password();
};

const setSaltAndPassword = (user: any) => {
    if (user.changed('password')) {
        user.salt = UserModel.prototype.generateSalt();
        user.password = UserModel.prototype.encryptPassword(user.password(), user.salt());
    }
};

UserModel.beforeCreate(setSaltAndPassword);

export default UserModel;
