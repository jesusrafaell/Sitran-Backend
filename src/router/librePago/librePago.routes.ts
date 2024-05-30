import { Router } from 'express';
import LibrePago from '../../controller/LibrePago';

const LibrePagoRoutes: Router = Router();
//
LibrePagoRoutes.route('').post(LibrePago.allHistory);
//
LibrePagoRoutes.route('/keys').get(LibrePago.keys);

export default LibrePagoRoutes;
