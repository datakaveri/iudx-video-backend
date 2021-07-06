import { spawn } from 'child_process';
import { Service } from 'typedi';
import ps from 'ps-node';
import Logger from '../common/Logger';
import config from '../config';
import Utility from '../common/Utility';
import ServiceError from '../common/Error';

@Service()
export default class FfmpegService {
    constructor(private utility: Utility) { }

    public async createProcess(streamInputUrl, streamOutputUrl) {
        try {
            if (!this.utility.isValidStreamUrl(streamInputUrl)) {
                throw new ServiceError('Invalid input url provided');
            }
            if (!this.utility.isValidStreamUrl(streamOutputUrl)) {
                throw new ServiceError('Invalid output url provided');
            }
            const command = 'ffmpeg';
            const ffmpegArgs = ['-i', streamInputUrl, '-c', 'copy', '-f', 'flv', streamOutputUrl];
            const proc = spawn(command, ffmpegArgs, { stdio: 'ignore' });
            return proc.pid;
        } catch (err) {
            Logger.error(err);
            throw err;
        }
    }

    public isProcessRunning(pid) {
        return new Promise((resolve, reject) => {
            if (!pid) {
                return reject(new ServiceError('Invalid process id provided'));
            }
            ps.lookup({ pid }, (err, processList) => {
                if (err) return reject(err);
                const process = processList[0];
                if (process && (process.command === 'ffmpeg' || process.command === 'ffprobe')) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    }

    public async isStreamActive(streamUrl): Promise<boolean> {
        if (!this.utility.isValidStreamUrl(streamUrl)) {
            throw new ServiceError('Invalid stream url provided');
        }
        const args = ['-v', 'quiet', '-print_format', 'json', '-show_streams', streamUrl];
        const cmd = 'ffprobe';
        const proc = spawn(cmd, args);

        let result = '';
        proc.stdout.on('data', (data) => {
            result += data.toString();
        });

        setTimeout(async () => {
            proc.kill('SIGKILL');
        }, config.ffmpegConfig.ffprobeTimeout * 1000);

        return new Promise((resolve, reject) => {
            proc.on('close', async (code) => {
                let streamPresent = false;
                if (result !== '') {
                    streamPresent = Object.keys(JSON.parse(result)).length > 0;
                }
                if (code === 0 && streamPresent) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    }

    public async streamToFile(streamInputUrl, filepath, duration) {
        if (!this.utility.isValidStreamUrl(streamInputUrl)) {
            throw new ServiceError('Invalid input url provided');
        }

        if (!duration) {
            throw new ServiceError('Invalid duration provided');
        }
        const command = 'ffmpeg';
        const ffmpegArguments = ['-i', streamInputUrl, '-an', '-vcodec', 'copy', filepath];
        const proc = await spawn(command, ffmpegArguments, { stdio: 'ignore' });
        setTimeout(() => {
            proc.kill();
        }, duration * 1000);
        return proc.pid;
    }

    public killProcess(pid) {
        return new Promise((resolve, reject) => {
            if (!pid) {
                return reject(new ServiceError('Invalid process id provided'));
            }
            ps.kill(pid, (err) => {
                if (err) return reject(err);
                return resolve(`Process ${pid} has been killed`);
            });
        });
    }
}
