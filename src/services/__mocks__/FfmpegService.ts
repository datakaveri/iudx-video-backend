import { Service } from 'typedi';

import Utility from '../../common/Utility';


const utilityService = new Utility();

@Service()
export default class FfmpegService {

    public isStreamActive: any = jest.fn().mockImplementation((streamUrl: any) => {
        if (!utilityService.isValidStreamUrl(streamUrl)) {
            throw new Error();
        }
        return true;
    });

    public isProcessRunning: any = jest.fn().mockImplementation((pid: any) => {
        const pids = [1583, 1584];

        if (!pid) {
            throw new Error();
        }
        if (pids.includes(pid)) {
            return false;
        }
        return true;
    });

    public killProcess: any = jest.fn().mockImplementation((pid: any) => {
        if (!pid) {
            throw new Error();
        }
        return true;
    });
}
