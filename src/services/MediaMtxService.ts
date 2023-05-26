import { Service } from 'typedi';
import axios from 'axios';

import config from '../config';
import Logger from '../common/Logger';
import Utility from '../common/Utility';
import ServiceError from '../common/Error';
import UUID from '../common/UUID';
import { KafkaMessageType } from '../common/Constants';
import StreamRepo from '../repositories/StreamRepo';
import CameraRepo from '../repositories/CameraRepo';
import ProcessService from './ProcessService';
import FfmpegService from './FfmpegService';
import StreamStatusService from './StreamStatusService';
import ServerRepo from '../repositories/ServerRepo';
import KafkaManager from '../managers/Kafka';
import { Error } from 'sequelize';

@Service()
export default class MediaMtxService {
    constructor(private Utility: Utility){}

    async createRtspProcess(streamId, streamInputUrl) {
        try{
        const response = await axios.post(`${config.rtspServerConfig.publishURL}/${streamId}`, {
            source: streamInputUrl
          });
        }catch (err) {
            Logger.error(err);
            throw err;
        }
    }
}