import { Router } from 'express';
import CuotasResumidas from '../../controller/CuotasResumidas';

const CuotasResumidasRoutes: Router = Router();
//
CuotasResumidasRoutes.route('').post(CuotasResumidas.all);
//
CuotasResumidasRoutes.route('/keys').get(CuotasResumidas.keys);

export default CuotasResumidasRoutes;
