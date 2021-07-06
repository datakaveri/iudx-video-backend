import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';

import Logger from '../../common/Logger';
import CameraService from '../../services/CameraService';

export default class CameraManagementController {
    private cameraService: CameraService;

    constructor() {
        this.cameraService = Container.get(CameraService);
    }

    async register(req: Request, res: Response, next: NextFunction) {
        const userId: string = req.user['userId'];
        let params: any = req.body;

        Logger.debug('Calling Register Camera endpoint with body: %o', params);
        try {
            const result = await this.cameraService.register(userId, params);
            const response = {
                type: 201,
                title: 'Success',
                results: result
            }
            return res.status(response.type).json(response);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction) {

        const userId: string = req.user['userId'];
        const cameraId: string = req.params.id;

        Logger.debug('Calling Find one Camera endpoint of camera id: %s', cameraId);
        try {
            const result = await this.cameraService.findOne(userId, cameraId);
            const response = {
                type: result ? 200 : 404,
                title: result ? 'Success' : 'Not Found',
                result: result ? result : 'Camera Not Found',
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

        Logger.debug('Calling Find all Camera endpoint');
        try {
            const result = await this.cameraService.findAll(page, size);
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

    async update(req: Request, res: Response, next: NextFunction) {

        const userId: string = req.user['userId'];
        const cameraId: string = req.params.id;
        const params: any = req.body;

        Logger.debug('Calling Update Camera endpoint with body: %o', params);
        try {
            const result = await this.cameraService.update(userId, cameraId, params);
            const response = {
                type: result ? 201 : 404,
                title: result ? 'Success' : 'No Found',
                results: result ? result : 'Camera Not Found',
            }
            return res.status(response.type).json(response);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {

        const userId: string = req.user['userId'];
        const cameraId: string = req.params.id;

        Logger.debug('Calling Delete Camera endpoint of camera id: %s', cameraId);
        try {
            const result = await this.cameraService.delete(userId, cameraId);
            const response = {
                type: result ? 200 : 404,
                title: result ? 'Success' : 'Not Found',
                detail: result ? 'Camera deleted' : 'Camera Not Found',
            }
            return res.status(200).send(response);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

}