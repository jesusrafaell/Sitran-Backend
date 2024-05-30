import { Application } from 'express';
import Views from './views.routes';

export default (app: Application) => {
	app.use('/views', Views);
};
