import { Application } from 'express';
import AboTerminal from './aboTerminal.routes';

//
export default (app: Application) => {
	app.use('/aboterminal', AboTerminal);
};
