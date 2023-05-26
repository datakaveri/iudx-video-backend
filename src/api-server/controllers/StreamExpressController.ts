import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';

import Logger from '../../common/Logger';
import StreamService from '../../services/StreamService';
import StreamKafkaController from '../../kafka/controllers/StreamKafkaController';

export default class StreamExpressController {
    private streamService: StreamService;
    private streamKafkaController: StreamKafkaController;

    constructor() {
        this.streamService = Container.get(StreamService);
        this.streamKafkaController = new StreamKafkaController();
    }

    async register(req: Request, res: Response, next: NextFunction) {

        const userId: string = req.user['userId'];
        let params: any = req.body;
        const serverId: string = (req.query as any)['serverId'];
        let result: any;

        Logger.debug('Calling Register Stream endpoint with body: %o', params);
        try {
            if (serverId) {
                Logger.debug(`serverId recieved: ${serverId}`);
                result = await this.streamKafkaController.register(serverId, userId, params);
            } else {
                result = await this.streamService.register(userId, params);
            }

            if (result) {
                result = {
                    streamId: result.streamData.streamId,
                    ...params,
                };
            }

            const response = {
                type: result ? 201 : 400,
                title: result ? 'Success' : 'Bad Request',
                result: result ? result : 'Camera Not Registered | Stream Already Registered | Request Timeout',
            };
            return res.status(response.type).json(response);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction) {
        const streamId: string = req.params.streamId;

        Logger.debug('Calling Find one Stream endpoint of stream id: %s', streamId);
        try {
            const result = await this.streamService.findOne(streamId);
            const response = {
                type: result ? 200 : 404,
                title: result ? 'Success' : 'Not Found',
                result: result ? result : 'Stream Not Found',
            };
            return res.status(response.type).json(response);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction) {
        const page: number = +req.query.page;
        const size: number = +req.query.size;
        const cameraId = req.query.cameraId || null;

        Logger.debug('Calling Find all Stream endpoint');
        try {
            const result = await this.streamService.findAll(page, size, cameraId);
            const response = {
                type: 200,
                title: 'Success',
                results: result,
            };
            return res.status(response.type).json(response);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const streamId: string = req.params.streamId;
        const serverId: string = (req.query as any)['serverId'];
        let result: any;

        Logger.debug('Calling Delete Stream endpoint of stream id: %s', streamId);
        try {
            if (serverId) {
                result = await this.streamKafkaController.delete(serverId, streamId);
            } else {
                result = await this.streamService.delete(streamId);
            }

            const response = {
                type: result ? 200 : 404,
                title: result ? 'Success' : 'Not Found',
                detail: result ? 'Stream deleted' : 'Stream Not Found | Request Timeout',
            };
            return res.status(response.type).send(response);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async getStatus(req: Request, res: Response, next: NextFunction) {
        const streamId: string = req.params.streamId;

        Logger.debug('Calling Stream status endpoint of stream id: %s', streamId);
        try {
            const result = await this.streamService.getStatus(streamId);
            const response = {
                type: 200,
                title: 'Success',
                results: result,
            };
            return res.status(response.type).send(response);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async streamRequest(req: Request, res: Response, next: NextFunction) {
        const streamId: string = req.params.streamId;
        const requestType = req.query.type || 'local' ;

        Logger.debug('Calling Stream Request endpoint of stream id: %s', streamId);
        try {
            const data = await this.streamService.streamRequest(streamId, requestType);
            const response = {
                type: 200,
                title: 'Success',
                data: data.apiResponse,
            };

            if (!data.apiResponse.isPublishing && requestType === 'cloud') {
                await this.streamKafkaController.streamRequest(data.kafkaRequestData.serverId, data.kafkaRequestData.data);
            }
            return res.status(200).send(response);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }
}
