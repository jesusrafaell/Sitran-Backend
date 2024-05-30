import { Application } from 'express';
import MantenimientoRoutes from './mantenimiento.routes';

//
export default (app: Application) => {
	app.use('/mantenimiento', MantenimientoRoutes);
};
