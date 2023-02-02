import { Service } from 'typedi';
import _ from 'lodash';

@Service()
export default class ServerRepo {
    public findServer: any = jest.fn().mockImplementation((serverId: string) => {
        return true;
    });
}
