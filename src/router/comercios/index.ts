import { Application } from 'express';
import Comercios from './comercios.routes';

export default (app: Application) => {
	app.use('/comercios', Comercios);
};
