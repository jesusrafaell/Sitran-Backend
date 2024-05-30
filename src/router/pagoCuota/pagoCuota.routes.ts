import { Router } from 'express';
import PagoCuota from '../../controller/PagoCuota';

const PagoCuotaRoutes: Router = Router();
//
PagoCuotaRoutes.route('').post(PagoCuota.allHistory);
//
PagoCuotaRoutes.route('/keys').get(PagoCuota.keys);

export default PagoCuotaRoutes;
