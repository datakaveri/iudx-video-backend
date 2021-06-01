import { Router } from 'express';
import Container from 'typedi';

import CameraManagementController from '../controllers/CameraManagementController';
import { validatePaginationQuery } from '../middlewares/ValidateQuery';
import passport from 'passport';

const route = Router();

export default (app: Router) => {

    const CameraController = Container.get(CameraManagementController);

    app.use('/cameras', passport.authenticate('jwt', { session: true }), route);

    route.post('/',
        (req, res, next) => CameraController.register(req, res, next)
    );

    route.get('/:name',
        (req, res, next) => CameraController.findOne(req, res, next)
    );

    route.get('/',
        validatePaginationQuery(['page', 'size']),
        (req, res, next) => CameraController.findAll(req, res, next)
    );

    route.put('/:name',
        (req, res, next) => CameraController.update(req, res, next)
    );

    route.delete('/:name',
        (req, res, next) => CameraController.delete(req, res, next)
    );
}