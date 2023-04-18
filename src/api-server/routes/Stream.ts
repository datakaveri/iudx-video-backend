import { Router } from 'express';
import passport from 'passport';

import StreamExpressController from '../controllers/StreamExpressController';
import { AuthorizeRole, ValidateStreamAccess, ValidatePolicy } from '../middlewares/Authorization';
import { validatePaginationQuery } from '../middlewares/ValidateQuery';

const route = Router();

export default (app: Router) => {

    const StreamController = new StreamExpressController();

    app.use('/streams', passport.authenticate('jwt', { session: false }), route);

    route.post('/',
        AuthorizeRole(['cms-admin', 'lms-admin', 'provider']),
        (req, res, next) => StreamController.register(req, res, next)
    );

    route.get('/:streamId',
        (req, res, next) => StreamController.findOne(req, res, next)
    );

    route.get('/',
        validatePaginationQuery(['page', 'size']),
        (req, res, next) => StreamController.findAll(req, res, next)
    );

    route.delete('/:streamId',
        AuthorizeRole(['cms-admin', 'lms-admin', 'provider']),
        ValidateStreamAccess,
        (req, res, next) => StreamController.delete(req, res, next)
    );

    route.get('/status/:streamId',
        (req, res, next) => StreamController.getStatus(req, res, next)
    );

    route.get('/request/:streamId',
        ValidatePolicy,
        (req, res, next) => StreamController.streamRequest(req, res, next)
    );
}