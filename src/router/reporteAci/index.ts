import { Application } from 'express';
import ReporteACIRoutes from './reporteAci.routes';

//
export default (app: Application) => {
	app.use('/reporte_aci', ReporteACIRoutes);
};
