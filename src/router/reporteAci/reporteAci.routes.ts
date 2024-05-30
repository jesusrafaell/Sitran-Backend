import { Router } from 'express';
import ReporteACI from '../../controller/ReporteACI';

const ReporteACIRoutes: Router = Router();
//
ReporteACIRoutes.route('').get(ReporteACI.all);
//
ReporteACIRoutes.route('/keys').get(ReporteACI.keys);

export default ReporteACIRoutes;
