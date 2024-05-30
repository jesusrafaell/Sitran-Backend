import { Application } from 'express';
import History from './history.routes';

//
export default (app: Application) => {
	app.use('/history', History);
};
