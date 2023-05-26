import { Router } from 'express';
import passport from 'passport';

import CameraExpressController from '../controllers/CameraExpressController';
import { validatePaginationQuery } from '../middlewares/ValidateQuery';
import { AuthorizeRole } from '../middlewares/Authorization';

const route = Router();

export default (app: Router) => {

    const CameraController = new CameraExpressController();
//session:false due to passport version update
    app.use('/cameras', passport.authenticate('jwt', { session: false }), route);

    route.post('/',
        AuthorizeRole(['cms-admin', 'lms-admin', 'provider']),
        (req, res, next) => CameraController.register(req, res, next)
    );

    route.get('/:cameraId',
        (req, res, next) => CameraController.findOne(req, res, next)
    );

    route.get('/:cameraId/streams',
        AuthorizeRole(['cms-admin', 'lms-admin', 'provider']),
        (req, res, next) => CameraController.findAssociatedStreams(req, res, next)
    );

    route.get('/',
        validatePaginationQuery(['page', 'size']),
        (req, res, next) => CameraController.findAll(req, res, next)
    );

    route.put('/:cameraId',
        AuthorizeRole(['cms-admin', 'lms-admin', 'provider']),
        (req, res, next) => CameraController.update(req, res, next)
    );

    route.delete('/:cameraId',
        AuthorizeRole(['cms-admin', 'lms-admin', 'provider']),
        (req, res, next) => CameraController.delete(req, res, next)
    );
}