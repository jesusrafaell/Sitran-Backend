import { Router } from 'express';
import plan_comision_inactivo from '../../controller/mantenimiento/plan_comision_inactivo';
import plan_mantenimiento_inactivo from '../../controller/mantenimiento/plan_mantenimiento_inactivo';
import sin_comision from '../../controller/mantenimiento/sin_comision';
import sin_plan from '../../controller/mantenimiento/sin_plan';

const MantenimientoRoutes: Router = Router();
//
MantenimientoRoutes.route('/0').post(sin_plan.all);
//
MantenimientoRoutes.route('/0/keys').get(sin_plan.keys);
//
MantenimientoRoutes.route('/1').post(sin_comision.all);
//
MantenimientoRoutes.route('/1/keys').get(sin_comision.keys);
//
MantenimientoRoutes.route('/2').post(plan_mantenimiento_inactivo.all);
//
MantenimientoRoutes.route('/2/keys').get(plan_mantenimiento_inactivo.keys);
//
MantenimientoRoutes.route('/3').post(plan_comision_inactivo.all);
//
MantenimientoRoutes.route('/3/keys').get(plan_comision_inactivo.keys);

export default MantenimientoRoutes;
