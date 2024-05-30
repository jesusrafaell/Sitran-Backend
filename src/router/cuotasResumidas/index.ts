import { Application } from 'express';
import CuotasResumidasRoutes from './cuotasResumidas.routes';

//
export default (app: Application) => {
	app.use('/cuotas_resumidas', CuotasResumidasRoutes);
};
