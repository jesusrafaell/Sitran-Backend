import { Application } from 'express';
import LibrePagoRoutes from './librePago.routes';

//
export default (app: Application) => {
	app.use('/libre-pago', LibrePagoRoutes);
};
