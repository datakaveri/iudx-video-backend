import { Service } from 'typedi';
import fs from 'fs';
import { parseString } from 'xml2js';

import config from '../config';

@Service()
export default class Utility {
    constructor() { }

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
        const defaultLimit: number = 2;
        const defaultOffset: number = 0;

        let limit: number = null;
        let offset: number = null;

        if (page || size) {
            limit = size ? size : defaultLimit;
            offset = page ? (page - 1) * limit : defaultOffset;
        }

        return {
            limit,
            offset,
        };
    }

    public getPagingData(data: any, page: number, limit: number) {
        const { count: totalItems, rows: results } = data;
        const currentPage = page ? page : 1;
        const totalPages = Math.ceil(totalItems / (limit ? limit : totalItems));

        return {
            currentPage,
            totalItems,
            totalPages,
            results,
        };
    }

    public isValidStreamUrl(url) {
        const regex = /^((rtmps?|rtsps?):\/\/.*\/?.*)/;
        if (regex.test(url)) {
            return true;
        }
        return false;
    }

    public parseNginxRtmpStat(response): Promise<Array<any>> {
        return new Promise(async (resolve, reject) => {
            parseString(response.body, function (err, result) {
                try {
                    const stat = err !== null ? result : result.rtmp;
                    let streams = stat.server[0].application[0].live[0].stream;

                    if (streams) {
                        streams = streams.map((stream) => {
                            const active = stream.hasOwnProperty('active');
                            let metaData = null;

                            if (active) {
                                const videoMetaData = stream.meta[0].video[0];
                                metaData = {
                                    codec: videoMetaData.codec[0],
                                    profile: videoMetaData.profile[0],
                                    level: videoMetaData.level[0],
                                    width: videoMetaData.width[0],
                                    height: videoMetaData.height[0],
                                    frameRate: videoMetaData.frame_rate[0],
                                }
                            }

                            return {
                                streamId: stream.name[0],
                                nClients: stream.nclients[0] - 1,
                                active: active,
                                bwIn: stream.bw_in[0],
                                bwOut: stream.bw_out[0],
                                bytesIn: stream.bw_video[0],
                                bytesOut: stream.bytes_out[0],
                                time: stream.time[0],
                                metaVideo: metaData,
                            };
                        });

                        return resolve(streams);
                    }

                    return resolve([]);
                }
                catch (err) {
                    reject(err);
                }
            });
        })
    }
}
