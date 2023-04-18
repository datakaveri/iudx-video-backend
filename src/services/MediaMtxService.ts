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
        const response = await axios.post(`http://localhost:9997/v1/config/paths/add/${streamId}`, {
            source: streamInputUrl
          });
        try{
            if(response.status != 200)
            {
                throw new Error(response.status as unknown as string);
            }     
            return 101;
        }
        catch (err) {
            Logger.error(err);
            throw err;
        }
    }
}