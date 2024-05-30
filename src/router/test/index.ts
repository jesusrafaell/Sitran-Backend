import { Application } from 'express';
import Test from './test.routes';

export default (app: Application) => {
	app.use('/test', Test);
};
