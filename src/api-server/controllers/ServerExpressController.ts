import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';

import Logger from '../../common/Logger';
import ServerService from '../../services/ServerService';

export default class ServerExpressController {
    private serverService: ServerService;

    constructor() {
        this.serverService = Container.get(ServerService);
    }

    async registerServer(req: Request, res: Response, next: NextFunction) {
        let params: any = req.body;
        Logger.debug('Calling register server endpoint with body: %o', params);
        try {
            const result = await this.serverService.register(params.serverName, params.serverHost, params.serverRtmpPort, 'LMS');
            return res.status(201).json(result);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async listAllServers(req: Request, res: Response, next: NextFunction) {
        Logger.debug('Calling list all server endpoint with body');
        try {
            const result = await this.serverService.listAllServers();
            return res.status(200).json(result);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }
}