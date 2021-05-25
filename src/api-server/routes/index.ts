import { Router } from 'express';
import Auth from './Auth';

export default () => {
	const app = Router();
	Auth(app);

	return app
}