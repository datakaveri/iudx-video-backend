import Bree from 'bree';
import Logger from '../common/Logger';
import Graceful from '@ladjs/graceful';

import StreamStatusService from '../services/StreamStatusService';

export default class SchedulerManager {

    constructor() { }

    public startStatusCheck() {

        const bree = new Bree({
            logger: console,
            root: false,
            jobs: [
                {
                    name: 'statusCheck',
                    interval: '1s',
                    path: StreamStatusService.checkStatus
                }
            ]
        });
        const graceful = new Graceful({ brees: [bree] });
        graceful.listen();

        bree.start();
    }
}
