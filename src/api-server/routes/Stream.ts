import { Router } from 'express';
import passport from 'passport';

import StreamManagementController from '../controllers/StreamManagementController';
import { validatePaginationQuery } from '../middlewares/ValidateQuery';

const route = Router();

export default (app: Router) => {

    const StreamController = new StreamManagementController();

    app.use('/streams', passport.authenticate('jwt', { session: true }), route);

    route.post('/',
        (req, res, next) => StreamController.register(req, res, next)
    );

    route.get('/:id',
        (req, res, next) => StreamController.findOne(req, res, next)
    );

    route.get('/',
        validatePaginationQuery(['page', 'size']),
        (req, res, next) => StreamController.findAll(req, res, next)
    );

    route.delete('/:id',
        (req, res, next) => StreamController.delete(req, res, next)
    );
}