import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';

import Logger from '../../common/Logger';
import PolicyRepo from '../../repositories/PolicyRepo';
import StreamRepo from '../../repositories/StreamRepo';

const AuthorizeRole = (allowedRoles) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const role = req.user['role'];
        if (!role) {
            return res.send(401).send('Authorization failed, invalid token provided');
        }
        if (allowedRoles.includes(role)) {
            return next();
        } else {
            return res.send(403).send('Forbidden');
        }
    };
};

const ValidatePolicy = async (req: Request, res: Response, next: NextFunction) => {
    const policyRepo = Container.get(PolicyRepo);
    try {
        const userId = req.user['userId'];
        if (!userId) {
            return res.send(401).send('Authorization failed, invalid token provided');
        }
        const streamId = req.params.streamId || req.query.streamId || req.body.streamId;

        if (!streamId) {
            return res.send(401).send('Authorization failed, stream id not provided');
        }

        const policy = await policyRepo.findPolicy(userId, streamId);

        if (!policy) {
            return res.send(401).send('Authorization failed for requested resource');
        }

        return next();
    } catch (err) {
        Logger.error('error in policy authorization middleware: %o', err);
        return res.status(500).send('Internal Server Error');
    }
};

/**
 * This middleware is specifically for provider access validation for stream
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
const ValidateStreamAccess = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user['userId'];
    const role = req.user['role'];
    if (role === 'admin') {
        return next();
    } 
    if (role === 'consumer') {
        return res.status(401).send('Authorization failed');
    }
    if (!userId) {
        return res.send(401).send('Authorization failed, invalid token provided');
    }
    const streamId = req.params.streamId || req.query.streamId || req.body.streamId;

    if (!streamId) {
        return res.send(401).send('Authorization failed, stream id not provided');
    }

    const streamRepo = Container.get(StreamRepo);
    try {
        let stream = await streamRepo.findStreamByUser(userId, streamId);
        if (!stream) {
            return res.send(401).send('Authorization failed');
        }
        return next();
    } catch(err) {
        return res.status(401).send('Authorization failed');
    }
}

export {
    AuthorizeRole,
    ValidatePolicy,
    ValidateStreamAccess
};
