import { Application } from 'express';
import TransaccionalRoutes from './transaccional.routes';

//
export default (app: Application) => {
	app.use('/transaccional', TransaccionalRoutes);
};
