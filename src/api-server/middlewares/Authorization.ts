import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';

import Logger from '../../common/Logger';
import config from '../../config';
import CameraRepo from '../../repositories/CameraRepo';
import PolicyRepo from '../../repositories/PolicyRepo';
import StreamRepo from '../../repositories/StreamRepo';

const AuthorizeRole = (allowedRoles) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const role = req.user['role'];

        // If the server is standalone lms then allow lms admin all permissions which cms admin can perform
        if (config.isStandaloneLms) {
            allowedRoles.push('lms-admin');
        }

        if (!role) {
            return res.status(401).send('Authorization failed, invalid token provided');
        }
        if (allowedRoles.includes(role)) {
            return next();
        } else {
            return res.status(403).send('Forbidden');
        }
    };
};

const ValidatePolicy = async (req: Request, res: Response, next: NextFunction) => {
    const policyRepo = Container.get(PolicyRepo);
    try {
        const role = req.user['role'];
        if (role === 'cms-admin') {
            return next();
        }
        /** TODO
         *  Validate if LMS admin can access to requested stream
         */
        if (role === 'lms-admin') {
            return next();
        }
        const userId = req.user['userId'];
        if (!userId) {
            return res.status(401).send('Authorization failed, invalid token provided');
        }
        const streamId = req.params.streamId || req.query.streamId || req.body.streamId;

        if (!streamId) {
            return res.status(401).send('Authorization failed, stream id not provided');
        }

        const requestType = req.query.type || 'local';
        const streamRepo = Container.get(StreamRepo);
        const stream = await streamRepo.findStream({ streamId });
        const policy = await policyRepo.findPolicyByConstraints(userId, stream.cameraId, requestType);

        if (!policy) {
            return res.status(401).send('Authorization failed for requested resource');
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
    if (role === 'cms-admin') {
        return next();
    }
    if (role === 'consumer') {
        return res.status(401).send('Authorization failed');
    }
    /** TODO
     *  Validate if LMS admin can access to requested stream
     */
    if (role === 'lms-admin') {
        return next();
    }
    if (!userId) {
        return res.status(401).send('Authorization failed, invalid token provided');
    }
    const streamId = req.params.streamId || req.query.streamId || req.body.streamId;

    if (!streamId) {
        return res.status(401).send('Authorization failed, stream id not provided');
    }

    const streamRepo = Container.get(StreamRepo);
    try {
        let stream = await streamRepo.findStream({ userId, streamId });
        if (!stream) {
            return res.status(401).send('Authorization failed');
        }
        return next();
    } catch (err) {
        return res.status(401).send('Authorization failed');
    }
}

/**
 * This middleware is specifically for provider access validation for camera
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
 const ValidateCameraAccess = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user['userId'];
    const role = req.user['role'];
    if (role === 'cms-admin') {
        return next();
    }
    if (role === 'consumer') {
        return res.status(401).send('Authorization failed');
    }
    /** TODO
     *  Validate if LMS admin can access to requested stream
     */
    if (role === 'lms-admin') {
        return next();
    }
    if (!userId) {
        return res.status(401).send('Authorization failed, invalid token provided');
    }
    const cameraId = req.params.cameraId || req.query.cameraId || req.body.cameraId;

    if (!cameraId) {
        return res.status(401).send('Authorization failed, camera id not provided');
    }

    const cameraRepo = Container.get(CameraRepo);
    try {
        let camera = await cameraRepo.findCamera({ userId, cameraId });
        if (!camera) {
            return res.status(401).send('Authorization failed');
        }
        return next();
    } catch (err) {
        return res.status(401).send('Authorization failed');
    }
}

export {
    AuthorizeRole,
    ValidatePolicy,
    ValidateStreamAccess,
    ValidateCameraAccess,
};
