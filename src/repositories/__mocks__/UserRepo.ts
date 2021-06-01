import { Service } from 'typedi';
import _ from 'lodash';

const testData = [
    {
        id: 1,
        email: 'swarup@datakaveri.org',
        name: 'Swarup E',
        password: 'admin123',
        verificationCode: 'xkj38jnjnn',
        verified: true,
        role: 'user',
    },
    {
        id: 2,
        email: 'test@datakaveri.org',
        name: 'Test',
        password: 'admin123',
        verificationCode: '12345',
        verified: false,
        role: 'user',
    },
];

@Service()
export default class UserRepo {
    public findUser: any = jest.fn().mockImplementation((user) => {
        const userData = _.find(testData, (obj) => {
            return obj.email === user.email || obj.verificationCode === user.verificationCode;
        });
        if (userData) {
            return userData;
        } else {
            return null;
        }
    });

    public createUser: any = jest.fn().mockImplementation((user) => {
        return true;
    });

    public updateUser: any = jest.fn().mockImplementation((user) => {
        return true;
    });

    public validatePassword: any = jest.fn().mockImplementation((query, password) => {
        const userData = _.find(testData, (obj) => {
            return obj.email === query.email;
        });
        if (userData.password === password) {
            return true;
        } else {
            return false;
        }
    });
}
