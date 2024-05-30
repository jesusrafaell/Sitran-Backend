import { Application } from 'express';
import ContracargoRoutes from './contracargo.routes';

//
export default (app: Application) => {
	app.use('/1000pagos/contracargo', ContracargoRoutes);
};
