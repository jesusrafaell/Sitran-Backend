import { Router } from 'express';
import Transaccional from '../../controller/Transaccional';

const TransaccionalRoutes: Router = Router();
//
TransaccionalRoutes.route('').post(Transaccional.all);
//
TransaccionalRoutes.route('/transType').get(Transaccional.transType);
//
TransaccionalRoutes.route('/options').get(Transaccional.options);
//
TransaccionalRoutes.route('/keys').get(Transaccional.keys);

export default TransaccionalRoutes;
