import { Service } from 'typedi';

import Utility from '../../common/Utility';


const utilityService = new Utility();

@Service()
export default class ProcessService {

    public addStreamProcess: any = jest.fn().mockImplementation((streamId, streamInputUrl, streamOutputUrl) => {
        return true;
    });
}
