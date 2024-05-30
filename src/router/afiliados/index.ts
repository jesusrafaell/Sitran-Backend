import { Application } from 'express';
import Afiliados from './afiliados.routes';

export default (app: Application) => {
	app.use('/afiliados', Afiliados);
};
