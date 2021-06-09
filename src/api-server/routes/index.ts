import { Router } from 'express';
import Auth from './Auth';
import Camera from './Camera';
import Stream from './Stream';

export default () => {
	const app = Router();
	Auth(app);
	Camera(app);
	Stream(app);

	return app;
}