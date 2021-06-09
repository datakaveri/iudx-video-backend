import { Router } from 'express';
import passport from 'passport';

import CameraManagementController from '../controllers/CameraManagementController';
import { validatePaginationQuery } from '../middlewares/ValidateQuery';

const route = Router();

export default (app: Router) => {

    const CameraController = new CameraManagementController();

    app.use('/cameras', passport.authenticate('jwt', { session: true }), route);

    route.post('/',
        (req, res, next) => CameraController.register(req, res, next)
    );

    route.get('/:id',
        (req, res, next) => CameraController.findOne(req, res, next)
    );

    route.get('/',
        validatePaginationQuery(['page', 'size']),
        (req, res, next) => CameraController.findAll(req, res, next)
    );

    route.put('/:id',
        (req, res, next) => CameraController.update(req, res, next)
    );

    route.delete('/:id',
        (req, res, next) => CameraController.delete(req, res, next)
    );
}