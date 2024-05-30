import { Application } from 'express';
import ContabilidadRoutes from './contabilidad.routes';

//
export default (app: Application) => {
	app.use('/contabilidad', ContabilidadRoutes);
};
