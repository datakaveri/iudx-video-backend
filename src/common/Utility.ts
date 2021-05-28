import { Service } from 'typedi';
import fs from 'fs';
import path from 'path';
import config from '../config';

@Service()
export default class Utility {
    constructor() {}

    public getPrivateKey(): Buffer {
        const rootDir = path.dirname(require.main.filename);
        return fs.readFileSync(config.authConfig.jwtPrivateKeyPath);
    }

    public readFile(filepath): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            fs.readFile(filepath, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }
}
