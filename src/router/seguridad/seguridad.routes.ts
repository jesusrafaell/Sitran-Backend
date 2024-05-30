import { Router } from 'express';
import Seguridad, {
	createDepartment,
	createUser,
	dataUserData,
	getPermissions,
	getPrefijos,
	getViewsXAgregador,
	getViewXProfile,
	updateDepartments,
	updateParams,
	updateUserData,
	updateViewDesc,
	updateViewsXAgregador,
	updateViewXProfile,
} from '../../controller/Seguridad';

const Security: Router = Router();

Security.route('/departments/all').get(Seguridad.allDepartment);

Security.route('/agregadores/all').get(Seguridad.allAgregador);

Security.route('/params/all').get(Seguridad.allParams);

Security.route('/roles/all').get(Seguridad.allRoles);

Security.route('/worker/all').get(Seguridad.allWorker);

Security.route('/status/all').get(Seguridad.allStatus);

Security.route('/workerSecurity/:id').get(dataUserData).put(updateUserData);

Security.route('/department/create').post(createDepartment);

Security.route('/departments/update').put(updateDepartments);

Security.route('/permissions/:id_dep/:id_rol').get(getPermissions); //.post(updatePermissions);

//Vistas Profile
Security.route('/views/dep/:depId/rol/:rolId/agr/:agrId').get(getViewXProfile).put(updateViewXProfile);
//Vistas Description
Security.route('/views/desc').put(updateViewDesc);

//Vistas Agregador
Security.route('/views/agr/:agrId').get(getViewsXAgregador).put(updateViewsXAgregador);

Security.route('/create/user').post(createUser);

Security.route('/prefijos').get(getPrefijos);

//
Security.route('/params').put(updateParams);

export default Security;
