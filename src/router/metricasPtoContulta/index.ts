import { Application } from 'express';
import MetricasPtoConsultaRoutes from './metricasptoconsulta.routes';

//
export default (app: Application) => {
	app.use('/metricaspconsulta', MetricasPtoConsultaRoutes);
};
