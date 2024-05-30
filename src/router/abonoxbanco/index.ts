import { Application } from 'express';
import AbonoXBancoRoutes from './abonoxbanco.routes';

//
export default (app: Application) => {
	app.use('/abonoxbanco', AbonoXBancoRoutes);
};
