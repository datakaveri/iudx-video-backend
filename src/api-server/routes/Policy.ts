import { Router } from 'express';
import passport from 'passport';
import PolicyExpressController from '../controllers/PolicyExpressController';
import { AuthorizeRole, ValidateCameraAccess } from '../middlewares/Authorization';

const route = Router();

export default (app: Router) => {
    const PolicyController = new PolicyExpressController();

    app.use('/policy', passport.authenticate('jwt', { session: true }), AuthorizeRole(['cms-admin', 'lms-admin', 'provider']), route);

    route.post('/', ValidateCameraAccess, (req, res, next) => PolicyController.addPolicy(req, res, next));

    route.get('/:userId', (req, res, next) => PolicyController.getPolicy(req, res, next));

    route.delete('/', ValidateCameraAccess, (req, res, next) => PolicyController.removePolicy(req, res, next));
};
