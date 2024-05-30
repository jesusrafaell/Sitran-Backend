import { Router } from 'express';
import {
	createCommerce,
	getComercioByRif,
	getComercioByTerminal,
	getComerciosByAgr,
} from '../../controller/Comercios';

const Comercios: Router = Router();

Comercios.route('/agregador/all').get(getComerciosByAgr);

//By rif
Comercios.route('/:comerRif').get(getComercioByRif);

//By terminal
Comercios.route('/terminal/:term').get(getComercioByTerminal);

Comercios.route('/create').post(createCommerce);

export default Comercios;
