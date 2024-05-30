import { Application } from 'express';
import Seguridad from './seguridad.routes';

export default (app: Application) => {
	app.use('/seguridad', Seguridad);
};
