import { Service, Inject } from 'typedi';

@Service()
export default class UserRepo {
    @Inject('UserModel') private userModel;
    constructor() {}

    public async createUser(userData) {
        await this.userModel.create(userData);
    }

    public async findUser(query): Promise<any> {
        const user = await this.userModel.findOne({ where: query });
        if (!user) {
            return null;
        }
        return user.get({ plain: true });
    }

    public async validatePassword(query, inputPassword): Promise<any> {
        const user = await this.userModel.findOne({ where: query });
        return user.isValidPassword(inputPassword);
    }

    public async updateUser(query, updateData) {
        await this.userModel.update(updateData, { where: query });
    }
}
