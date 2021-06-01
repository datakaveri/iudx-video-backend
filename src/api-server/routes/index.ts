import { Router } from 'express';
import Auth from './Auth';
import Camera from './Camera';

export default () => {
	const app = Router();
	Auth(app);
	Camera(app);

	return app;
}