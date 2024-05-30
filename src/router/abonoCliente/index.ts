import { Application } from 'express';
import AbonoClienteRechazado from './abonoClienteRechazado.routes';

//
export default (app: Application) => {
	app.use('/abonocliente/rechazado', AbonoClienteRechazado);
};
