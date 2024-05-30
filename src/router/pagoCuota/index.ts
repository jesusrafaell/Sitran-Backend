import { Application } from 'express';
import PagoCuotaRoutes from './pagoCuota.routes';

//
export default (app: Application) => {
	app.use('/pago-cuota', PagoCuotaRoutes);
};
