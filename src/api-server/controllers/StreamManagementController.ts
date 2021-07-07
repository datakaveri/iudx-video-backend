import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';

import Logger from '../../common/Logger';
import StreamService from '../../services/StreamService';

export default class StreamManagementController {
    private streamService: StreamService;

    constructor() {
        this.streamService = Container.get(StreamService);
    }

    async register(req: Request, res: Response, next: NextFunction) {
        const userId: string = req.user['userId'];
        let params: any = req.body;

        Logger.debug('Calling Register Stream endpoint with body: %o', params);
        try {
            const result = await this.streamService.register(userId, params);
            const response = {
                type: result ? 201 : 400,
                title: result ? 'Success' : 'Bad Request',
                results: result ? result : 'Camera Not Registered | Stream Already Registered',
            }
            return res.status(response.type).json(response);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction) {

        const userId: string = req.user['userId'];
        const streamId: string = req.params.id;

        Logger.debug('Calling Find one Stream endpoint of stream id: %s', streamId);
        try {
            const result = await this.streamService.findOne(userId, streamId);
            const response = {
                type: result ? 200 : 404,
                title: result ? 'Success' : 'Not Found',
                result: result ? result : 'Stream Not Found',
            }
            return res.status(response.type).json(response);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction) {

        const page: number = +req.query.page;
        const size: number = +req.query.size;

        Logger.debug('Calling Find all Stream endpoint');
        try {
            const result = await this.streamService.findAll(page, size);
            const response = {
                type: 200,
                title: 'Success',
                results: result
            }
            return res.status(response.type).json(response);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {

        const userId: string = req.user['userId'];
        const streamId: string = req.params.id;

        Logger.debug('Calling Delete Stream endpoint of stream id: %s', streamId);
        try {
            const result = await this.streamService.delete(userId, streamId);
            const response = {
                type: result ? 200 : 404,
                title: result ? 'Success' : 'Not Found',
                detail: result ? 'Stream deleted' : 'Stream Not Found',
            }
            return res.status(response.type).send(response);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async getStatus(req: Request, res: Response, next: NextFunction) {

        const userId: string = req.user['userId'];
        const streamId: string = req.params.id;

        Logger.debug('Calling Stream status endpoint of stream id: %s', streamId);
        try {
            const result = await this.streamService.getStatus(userId, streamId);
            const response = {
                type: 200,
                title: 'Success',
                results: result
            }
            return res.status(response.type).send(response);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async playBackUrl(req: Request, res: Response, next: NextFunction) {

        const userId: string = req.user['userId'];
        const streamId: string = req.params.id;

        Logger.debug('Calling Playback endpoint of stream id: %s', streamId);
        try {
            const data = await this.streamService.playBackUrl(userId, streamId);
            const response = {
                type: 200,
                title: 'Success',
                data
            }
            return res.status(200).send(response);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }
}