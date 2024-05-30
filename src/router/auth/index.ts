import { Application } from 'express';
import Auth from './auth.routes';

//
export default (app: Application) => {
	app.use('/auth', Auth);
};
