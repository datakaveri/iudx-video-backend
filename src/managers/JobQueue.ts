import { Service } from 'typedi';
import { run, Runner, WorkerEvents } from 'graphile-worker';

import config from '../config';
import { taskList } from '../common/TaskList';
import Logger from '../common/Logger';

@Service()
export default class JobQueueManager {
    private runner: Runner;

    constructor() { }

    public async init() {
        try {
            this.runner = await run({
                connectionString: config.databaseURL,
                concurrency: 4,
                noHandleSignals: false,
                taskList,
            });
            this.runner.events.on('job:start', ({ worker, job }) => {
                console.log(`Worker ${worker.workerId} assigned to job ${job.id}`);
            });
            Object.freeze(this);
        }
        catch (err) {
            Logger.error('error: %o', err);
            throw err;
        }
    }

    public async add(taskIdentifier: string, payload: any, maxAttempts: number = 1) {
        try {
            await this.runner.addJob(taskIdentifier, payload, { maxAttempts });
        }
        catch (err) {
            Logger.error('error: %o', err);
            throw err;
        }
    }

    public events(): WorkerEvents {
        return this.runner.events;
    }
}

