import { Service } from 'typedi';

import Utility from '../../common/Utility';


const utilityService = new Utility();

@Service()
export default class CameraRepo {

    public isStreamActive: any = jest.fn().mockImplementation((streamUrl: any) => {
        if (!utilityService.isValidStreamUrl(streamUrl)) {
            throw new Error();
        }
        return true;
    });
}
