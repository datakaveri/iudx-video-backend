import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';

import Logger from '../../common/Logger';
import StreamService from '../../services/StreamService';
import StreamStatusService from '../../services/StreamStatusService';

export default class StreamManagementController {
    private streamService: StreamService;
    private streamStatusService: StreamStatusService;

    constructor() {
        this.streamService = Container.get(StreamService);
        this.streamStatusService = Container.get(StreamStatusService);
    }

    async register(req: Request, res: Response, next: NextFunction) {
        const userId: string = req.user['userId'];
        let params: any = req.body;

        Logger.debug('Calling Register Stream endpoint with body: %o', params);
        try {
            const streams = await this.streamService.register(userId, params);
            const response = {
                type: 201,
                title: 'Success',
                results: streams
            }
            return res.status(201).json(response);
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
            const stream = await this.streamService.findOne(userId, streamId);
            const response = {
                type: 200,
                title: 'Success',
                results: stream
            }
            return res.status(200).json(response);
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
            const streams = await this.streamService.findAll(page, size);
            const response = {
                type: 200,
                title: 'Success',
                results: streams
            }
            return res.status(200).json(response);
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
            await this.streamService.delete(userId, streamId);
            const response = {
                type: 200,
                title: 'Success',
                detail: 'Stream Deleted'
            }
            return res.status(200).send(response);
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
            const status = await this.streamStatusService.getStatus(userId, streamId);
            const response = {
                type: 200,
                title: 'Success',
                results: status
            }
            return res.status(200).send(response);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }
}