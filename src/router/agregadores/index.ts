import { Application } from 'express';
import Agregadores from './agregadores.routes';

//
export default (app: Application) => {
	app.use('/agregadores', Agregadores);
};
