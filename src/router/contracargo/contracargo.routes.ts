import { Router } from 'express';
import Contracargo from '../../controller/Lote1000pagos/Contracargo';

const ContracargoRoutes: Router = Router();
//
ContracargoRoutes.route('').get(Contracargo.all);
//
ContracargoRoutes.route('/exec').post(Contracargo.execContracargo);
//
ContracargoRoutes.route('/keys').get(Contracargo.keys);
//
ContracargoRoutes.route('/up/lote').post(Contracargo.upFile);

export default ContracargoRoutes;
