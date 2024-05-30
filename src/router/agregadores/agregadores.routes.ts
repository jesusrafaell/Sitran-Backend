import { Router } from 'express';
import { allAgregador, UpdateStatusAgregador } from '../../controller/Agregadores';
import Seguridad from '../../controller/Seguridad';

const Agregadores: Router = Router();

Agregadores.route('/all').get(allAgregador);

Agregadores.route('/:id/:active').put(UpdateStatusAgregador);

export default Agregadores;
