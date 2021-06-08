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

    public getPagination(page: number, size: number) {
        const limit = size ? size : 2;
        const offset = page ? (page - 1) * limit : 0;

        return {
            limit,
            offset,
        };
    }

    public getPagingData(data: any, page: number, limit: number) {
        const { count: totalItems, rows: results } = data;
        const currentPage = page ? page : 1;
        const totalPages = Math.ceil(totalItems / limit);

        return {
            currentPage,
            totalItems,
            totalPages,
            results,
        };
    }

    public isValidStreamUrl(url) {
        const regex = /^((rtmps?|rtsp?):\/\/.*\/.*)/;
        if (regex.test(url)) {
            return true;
        }
        return false;
    }
}
