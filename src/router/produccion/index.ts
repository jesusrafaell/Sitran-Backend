import { Application } from 'express';
import ProduccionRoutes from './produccion.routes';

//
export default (app: Application) => {
	app.use('/procesos', ProduccionRoutes);
};
