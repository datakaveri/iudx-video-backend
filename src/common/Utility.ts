import { Service } from 'typedi';
import fs from 'fs';
import config from '../config';

@Service()
export default class Utility {
    constructor() {}

    public getPrivateKey(): Buffer {
        return fs.readFileSync(config.authConfig.jwtPrivateKeyPath);
    }

    public generateCode(): string {
        const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const length = 25;
        let code = '';
        for (let i = 0; i < length; i++) {
            code += characters[Math.floor(Math.random() * characters.length)];
        }
        return code;
    }
}
