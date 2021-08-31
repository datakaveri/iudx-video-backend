import { Router } from 'express';
import Auth from './Auth';
import Camera from './Camera';
import Policy from './Policy';
import Stream from './Stream';
import Monitor from './Monitor';
import Server from './Server';

export default () => {
	const app = Router();
	Auth(app);
	Camera(app);
	Stream(app);
	Policy(app);
	// Monitor(app);
	Server(app);

	return app;
}