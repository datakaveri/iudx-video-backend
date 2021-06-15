
// import Logger from '../common/Logger';

// import Utility from '../common/Utility';
import { Container } from 'typedi';
import StreamRepo from '../repositories/StreamRepo';

// import ServiceError from '../common/Error';
// import config from '../config';
// const { parentPort } = require('worker_threads');

const checkStatus = async () => {
    try {
        const streamRepo: StreamRepo = Container.get(StreamRepo);

    }
    catch (e) {
        console.log(e);
    }
}

export default {
    checkStatus
}