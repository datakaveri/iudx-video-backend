import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';

import Logger from '../../common/Logger';
import PolicyService from '../../services/PolicyService';

export default class PolicyExpressController {
    private policyService: PolicyService;

    constructor() {
        this.policyService = Container.get(PolicyService);
    }

    async addPolicy(req: Request, res: Response, next: NextFunction) {
        const providerId: string = req.user['userId'];
        let params: any = req.body;

        Logger.debug('Calling create Policy endpoint with body: %o', params);
        try {
            const result = await this.policyService.create(providerId, params.email, params.cameraId, params.constraints);
            return res.status(201).json(result);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async removePolicy(req: Request, res: Response, next: NextFunction) {
        let params: any = req.body;
        Logger.debug('Calling delete policy endpoint of policy id: %s', params);
        try {
            const result = await this.policyService.delete(params.email, params.cameraId);
            return res.status(200).json(result);
        } catch (e) {
            Logger.error('error: %o', e);
            return next(e);
        }
    }

    async getPolicy(req: Request, res: Response, next: NextFunction) {
        Logger.debug('Calling Find all Policy endpoint');
        try {
            const result = await this.policyService.findAllUserPolicy(req.params.userId);
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

}