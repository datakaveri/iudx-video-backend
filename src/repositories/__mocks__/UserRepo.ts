import { Service } from 'typedi';
import _ from 'lodash';
import { Users } from '../../../test/data/Users';

@Service()
export default class UserRepo {
    public findUser: any = jest.fn().mockImplementation((query) => {
        const userData = _.find(Users, (obj) => {
            return (obj.email === query.email || obj.verificationCode === query.verificationCode);
        });
        if (userData) {
            return (userData);
        } else {
            return (null);
        }
    });

    public createUser: any = jest.fn().mockImplementation((user) => {
        return true;
    });

    public updateUser: any = jest.fn().mockImplementation((user) => {
        return true;
    });

    public validatePassword: any = jest.fn().mockImplementation((query, password) => {
        const userData = _.find(Users, (obj) => {
            return obj.email === query.email;
        });
        if (userData.password === password) {
            return true;
        } else {
            return false;
        }
    });
}
