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

        params = params.map(param => {
            return {
                userId,
                ...param
            }
        })

        Logger.debug('Calling Register Camera endpoint with body: %o', params);
        try {
            await this.cameraService.register(params);
            const response = {
                type: 201,
                title: 'Success',
                detail: 'Registered succesfully'
            }
            return res.status(201).json(response);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async findOne(req: Request, res: Response, next: NextFunction) {

        const userId: string = req.user['userId'];
        const cameraName: string = req.params.name;

        Logger.debug('Calling Find one Camera endpoint');
        try {
            const camera = await this.cameraService.findOne(userId, cameraName);
            const response = {
                type: 200,
                title: 'Success',
                result: camera ? camera : 'No data found'
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

        Logger.debug('Calling Find all Camera endpoint');
        try {
            const result = await this.cameraService.findAll(page, size);
            const response = {
                type: 200,
                title: 'Success',
                results: result ? result : 'No data found'
            }
            return res.status(200).json(response);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {

        const userId: string = req.user['userId'];
        const cameraName: string = req.params.name;
        const params: any = req.body;

        Logger.debug('Calling Update Camera endpoint with body: %o', params);
        try {
            await this.cameraService.update(userId, cameraName, params);
            const response = {
                type: 201,
                title: 'Success',
                results: params
            }
            return res.status(201).json(response);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {

        const userId: string = req.user['userId'];
        const cameraName: string = req.params.name;

        Logger.debug('Calling Delete Camera endpoint of camera name: %s', cameraName);
        try {
            await this.cameraService.delete(userId, cameraName);
            const response = {
                type: 200,
                title: 'Success',
                detail: 'Camera Deleted'
            }
            return res.status(200).send(response);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

}