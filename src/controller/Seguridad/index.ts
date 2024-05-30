import { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { getDatasource, SitranDS } from '../../db/config/DataSource';
import Views from '../../db/global/models/Views';
import s_viewXprofile from '../../db/global/models/ViewsXProfile';
import Agregador from '../../db/sitran/models/Agregador';
import Department from '../../db/sitran/models/Department';
import GlobalViews from '../../db/sitran/models/Global_Views';
import Params from '../../db/sitran/models/Params';
import { default as Prefijo, default as Prefijos } from '../../db/sitran/models/Prefijo';
import Profile from '../../db/sitran/models/Profile';
import Roles from '../../db/sitran/models/Roles';
import Status from '../../db/sitran/models/Status';
import UsuariosSitran from '../../db/sitran/models/Usuarios';
import { newExpirationUser } from '../../functions/addDays';
import { getViewsByAgregador, getViewsByProfile } from '../auth/formatData';
import saveLogs from '../logs';
// @ts-ignore

interface body {
	transType: any;
}

interface Querys {
	transOption: number;
	monthoption: string;
}

interface msg {
	message: string;
	info?: any;
}

export const options = ['Aprobados', 'Rechazos', 'CierreDeLote', 'Reversos'];

export default {
	async allWorker(req: Request, res: Response<{ message: string; info: UsuariosSitran[] }>) {
		try {
			//buscar los usuarios agregados a reporte dinamico

			const sitraners = await SitranDS.getRepository(UsuariosSitran).find({
				select: ['name', 'login', 'email', 'id', 'id_type', 'ident', 'updatedAt'],
			});

			if (!sitraners) throw { message: 'No existen Usuario' };

			const info: UsuariosSitran[] = sitraners.map((worker: any) => {
				const { contrasena, ...data } = worker;

				return data;
			});

			res.status(200).json({ message: 'data del usuario', info });
		} catch (err) {
			res.status(400).json(err);
		}
	},

	async allDepartment(req: Request, res: Response<{ message: string; info: Department[] }>) {
		try {
			const info = await SitranDS.getRepository(Department).find();

			res.status(200).json({ message: 'departments', info });
		} catch (err) {
			res.status(400).json(err);
		}
	},

	async allAgregador(req: Request, res: Response<{ message: string; info: Agregador[] }>) {
		try {
			const info = await SitranDS.getRepository(Agregador).find();

			res.status(200).json({ message: 'agregadores', info });
		} catch (err) {
			console.log(err);
			res.status(400).json(err);
		}
	},

	async allParams(req: Request, res: Response<{ message: string; info: Params[] }>) {
		try {
			const info = await SitranDS.getRepository(Params).find();

			res.status(200).json({ message: 'agregadores', info });
		} catch (err) {
			console.log(err);
			res.status(400).json(err);
		}
	},

	async allRoles(req: Request, res: Response<{ message: string; info: Roles[] }>) {
		try {
			const info = await SitranDS.getRepository(Roles).find();

			res.status(200).json({ message: 'roles', info });
		} catch (err) {
			res.status(400).json(err);
		}
	},

	async allStatus(req: Request, res: Response<{ message: string; info: Status[] }>) {
		try {
			const info = await SitranDS.getRepository(Status).find();

			res.status(200).json({ message: 'Estatus', info });
		} catch (err) {
			res.status(400).json(err);
		}
	},

	async dataUser(req: Request<body>, res: Response<msg>) {
		try {
			//const info = await SitranDS.getRepository(Roles).find();

			res.status(200).json({ message: 'user', info: {} });
		} catch (err) {
			res.status(400).json(err);
		}
	},
};

//seguir aqui 3312
export const dataUserData = async (req: Request<{ id: number }>, res: Response<msg>): Promise<void> => {
	try {
		const id = req.params.id;
		if (!id) throw { message: 'No existe el usuario' };

		const user = await SitranDS.getRepository(UsuariosSitran).findOne({
			where: {
				id,
			},
			relations: ['profile', 'profile.rol', 'profile.department', 'status', 'prefijos', 'agregador'],
		});

		if (!user) throw { message: 'No existe el usuario' };

		let info = {};

		info = {
			id_rol: user.profile.rol,
			id_department: user.profile.department,
			id_status: user.status,
			prefijos: user.prefijos,
			agregador: user.agregador,
		};

		// console.log('info', info);

		res.status(200).json({ message: 'user', info });
	} catch (err) {
		console.log('Error al obtener data', err);
		res.status(400).json(err);
	}
};

interface BodyUpdateUser {
	id_rol: number;
	id_department: number;
	id_status: number;
	prefix_arr?: number[];
	id_agr?: number;
	//params
	id?: number;
}

export const updateUserData = async (
	req: Request<BodyUpdateUser>,
	res: Response<{ message: string; info: any }>
): Promise<void> => {
	try {
		const idUser: number = req.params.id;

		let { id_rol, id_department, id_status, prefix_arr, id_agr }: BodyUpdateUser = req.body;

		const resUser = await SitranDS.getRepository(UsuariosSitran).findOne({ where: { id: idUser } });

		if (!resUser) throw { message: 'Usuario no existe' };

		if (!id_rol || !id_department || !id_status) throw { message: 'Faltan departamento, rol o estatus' };

		if (id_department === 1) {
			id_rol = 1;
		}

		const rol = await SitranDS.getRepository(Roles).findOne({ where: { id: id_rol } });
		const department = await SitranDS.getRepository(Department).findOne({ where: { id: id_department } });
		const status = await SitranDS.getRepository(Status).findOne({ where: { id: id_status } });
		const agregador = await SitranDS.getRepository(Agregador).findOne({ where: { key: id_agr } });
		let prefijos: Prefijos[] = [];
		if (prefix_arr)
			prefijos = await Promise.all(
				prefix_arr.map(async (item) => await SitranDS.getRepository(Prefijo).findOne({ where: { id: item } }))
			);

		if (!rol) throw { message: 'Rol no existe' };
		if (!department) throw { message: 'Departamento no existe' };
		if (!status) throw { message: 'Estatus no existe' };
		if (!agregador) throw { message: 'Agregador no existe' };
		// if (!prefijos) throw { message: 'No se encontraron los prefijos' };

		let profile = await SitranDS.getRepository(Profile).findOne({
			where: {
				department,
				rol,
			},
		});

		if (!profile) profile = await SitranDS.getRepository(Profile).save({ department, rol });

		await SitranDS.getRepository(UsuariosSitran).save({
			...resUser,
			status,
			profile,
			prefijos,
			agregador,
		});

		const { password, ...userData } = resUser;

		const info = {
			...userData,
			status,
			profile,
		};

		await saveLogs(req, `Modifico el usuario: [${idUser}], Perfil [${resUser.id}]`, SitranDS);

		res.status(200).json({ message: 'update user', info });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

export const createDepartment = async (req: Request<{ nameDep: string }>, res: Response<msg>): Promise<void> => {
	try {
		const nameDep = req.body.nameDep;

		if (!nameDep || nameDep.length < 3) throw { message: 'Nombre del Departmento invalido' };

		const existDep = await SitranDS.getRepository(Department).findOne({
			where: { name: nameDep },
		});

		if (existDep) throw { message: `Ya existe el departamento ${nameDep}` };

		const newDep = await SitranDS.getRepository(Department).save({
			name: nameDep,
		});

		const listRoles: Roles[] = await SitranDS.getRepository(Roles).find();
		if (!listRoles.length) throw { message: 'No existen roles en la base de datos' };
		await Promise.all(
			listRoles.map(
				async (rol: Roles) =>
					await SitranDS.getRepository(Profile).save({
						department: newDep,
						rol: rol,
					})
			)
		);
		//await SitranDS.getRepository(Profile).save(listProfiles);

		await saveLogs(req, `Creo el departamento: ${nameDep}`, SitranDS);

		//
		res.status(200).json({ message: 'Departamento creado', info: newDep });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

export const getPermissions = async (req: Request<any, msg, body, Querys>, res: Response<msg>): Promise<void> => {
	try {
		const DS: DataSource = getDatasource(req.headers.key_agregador);
		const { id_dep, id_rol }: { id_dep: number; id_rol: number } = req.params;

		const viewsXdep = await DS.getRepository(Department).findOne({
			where: { active: 1, id: id_dep },
			relations: ['access_views', 'access_views.id_views', 'access_views.id_views.actions'],
		});

		//[3312]
		const access_views = [];

		if (!access_views.length) {
			throw { message: 'No tiene niguna vista asignada' };
		}

		let actions: any = [];

		/*
		access_views.forEach((item: any) => {
			const { actions: acc, ...vis }: any = item.id_views;
			if (item.active) {
				item.id_views.actions.forEach((el: Actions) => {
					console.log('save', el);
					actions.push({
						...el,
						id_views: vis,
					});
				});
			}
		});
		*/

		const rol = await DS.getRepository(Roles).findOne({
			where: { id: id_rol },
		});

		const permiss = [];
		const getListFormat = (perm: any[], action: any[]) => {
			let list: any = [];
			for (let j = 0; j < action.length; j++) {
				let flag = false;
				for (let i = 0; i < perm.length; i++) {
					if (action[j].id === perm[i].id_action.id) {
						flag = true;
						list.push({
							id: action[j].id,
							view: action[j].id_views,
							name: action[j].name,
							description: action[j].description,
							status: perm[i].active ? true : false,
						});
					}
				}
				if (!flag) {
					list.push({
						id: action[j].id,
						name: action[j].name,
						description: action[j].description,
						view: action[j].id_views,
						status: false,
					});
				}
			}
			return list;
		};

		let info = [];

		info = getListFormat(permiss, actions);

		res.status(200).json({ message: 'permisos', info });
	} catch (err) {
		res.status(400).json(err);
	}
};

export const updatePermissions = async (req: Request<any>, res: Response<msg>): Promise<void> => {
	try {
		const DS: DataSource = getDatasource(req.headers.key_agregador);
		const { id_dep, id_rol }: any = req.params;
		const newAction: any = req.body;

		await saveLogs(req, `Edito los permisos dep: ${id_dep}, Rol:${id_rol}`, DS);

		res.status(200).json({ message: 'updated permisses' });
	} catch (err) {
		res.status(400).json(err);
	}
};

interface ParamsGetViews {
	depId: number;
	rolId: number;
	agrId: number;
}

interface ListView {
	id: number;
	name: string;
	status: boolean;
	description: string;
}

export const getViewXProfile = async (
	req: Request<ParamsGetViews>,
	res: Response<{ message: string; info: ListView[] }>
): Promise<void> => {
	try {
		const { depId, rolId, agrId } = req.params;

		const department = await SitranDS.getRepository(Department).findOne({ where: { id: depId } });
		const role = await SitranDS.getRepository(Roles).findOne({ where: { id: rolId } });
		const agregador = await SitranDS.getRepository(Agregador).findOne({ where: { id: agrId } });

		if (!department) throw { message: `No existe el departamento` };
		if (!role) throw { message: `No existe el rol` };
		if (!agregador) throw { message: `No existe el agregador` };

		const profile = await SitranDS.getRepository(Profile).findOne({ where: { department, rol: role } });
		if (!profile) throw { message: `No existe el perfil` };

		const DS: DataSource = getDatasource(`${agregador.id}`);
		if (!DS) throw { message: 'El agregador no tiene una base de datos activa' };

		const viewsByProfile = await getViewsByProfile(DS, profile.id);
		// console.log('ViewsByProfile', viewsByProfile);

		//Todas las vistas del agregador
		const viewsByAgregador = await getViewsByAgregador(DS);

		// console.log('ViesByAgregador', viewsByAgregador);

		if (!viewsByAgregador.length) throw { message: 'El agregador no tiene vistas disponibles' };

		const getListFormat = (item_access: GlobalViews[], item_views: GlobalViews[]): ListView[] => {
			let list: ListView[] = [];
			for (let j = 0; j < item_views.length; j++) {
				let flag = false;
				for (let i = 0; i < item_access.length; i++) {
					//Si es tranred muestas Gestion de usuario
					if (item_views[j].root === 'seguridad') {
						flag = true;
					} else if (item_views[j].id === item_access[i].id) {
						flag = true;
						list.push({
							id: item_views[j].id,
							name: item_views[j].name,
							status: item_access[i].active ? true : false,
							description: item_views[i].description,
						});
					}
				}
				if (!flag && item_views[j].root !== 'seguridad') {
					list.push({
						id: item_views[j].id,
						name: item_views[j].name,
						status: false,
						description: item_views[j].description,
					});
				}
			}
			return list;
		};

		const info = getListFormat(viewsByProfile, viewsByAgregador);

		res.status(200).json({ message: 'viewsByProfile', info });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

export const getViewsXAgregador = async (
	req: Request<{ agrId: number }>,
	res: Response<{ message: string; info: ListView[] }>
): Promise<void> => {
	try {
		const { agrId } = req.params;

		const agregador = await SitranDS.getRepository(Agregador).findOne({ where: { id: agrId } });
		if (!agregador) throw { message: `No existe el agregador` };
		const DS: DataSource = getDatasource(`${agregador.id}`);
		if (!DS) throw { message: 'El agregador no tiene una base de datos activa' };

		//Todas las vistas de sitran
		const viewsAll = await SitranDS.getRepository(GlobalViews).find({ where: { active: 1 } });

		//Todas las vistas que tiene acceso el agregador
		const viewsByAgregador = await getViewsByAgregador(DS);

		const getListFormat = (item_access: GlobalViews[], item_views: GlobalViews[]): ListView[] => {
			let list: ListView[] = [];
			for (let j = 0; j < item_views.length; j++) {
				let flag = false;
				for (let i = 0; i < item_access.length; i++) {
					if (item_views[j].root === 'seguridad') {
						flag = true;
					} else if (item_views[j].id === item_access[i].id) {
						flag = true;
						list.push({
							id: item_views[j].id,
							name: item_views[j].name,
							status: item_access[i].active ? true : false,
							description: item_views[j].description,
						});
					}
				}
				if (!flag) {
					list.push({
						id: item_views[j].id,
						name: item_views[j].name,
						status: false,
						description: item_views[j].description,
					});
				}
			}
			return list;
		};

		const info = getListFormat(viewsByAgregador, viewsAll);

		res.status(200).json({ message: 'viewsByAgregador', info });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

export const updateViewsXAgregador = async (
	req: Request<{ agrId: number; views: ListView[] }>,
	res: Response<msg>
): Promise<void> => {
	try {
		const agrId: number = req.params.agrId;
		const views: ListView[] = req.body;

		const agregador = await SitranDS.getRepository(Agregador).findOne({ where: { id: agrId } });
		if (!agregador) throw { message: `No existe el agregador` };
		const DS: DataSource = getDatasource(`${agregador.id}`);
		if (!DS) throw { message: 'El agregador no tiene una base de datos activa' };

		for (let i = 0; i < views.length; i++) {
			// console.log('editar', views[i]);
			const resData = await DS.createQueryBuilder()
				.update(Views)
				.set({ active: views[i].status ? 1 : 0 })
				.where('views.viewId = :id', { id: views[i].id })
				.execute();
			// console.log(resData.affected);
			if (!resData.affected && views[i].status) {
				await DS.getRepository(Views).save({
					viewId: views[i].id,
				});
			}
		}

		//logs
		await saveLogs(req, `Modifico las vistas del agregador: ${agregador.name} `, SitranDS);

		res.status(200).json({ message: 'Se edito las vistas del agregador' });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

export const updateViewXProfile = async (
	req: Request<{
		depId: number;
		rolId: number;
		agrId: number;
		views: ListView[];
	}>,
	res: Response<msg>
): Promise<void> => {
	try {
		const { depId, rolId, agrId } = req.params;
		const views: ListView[] = req.body;

		const department = await SitranDS.getRepository(Department).findOne({ where: { id: depId } });
		const role = await SitranDS.getRepository(Roles).findOne({ where: { id: rolId } });
		const agregador = await SitranDS.getRepository(Agregador).findOne({ where: { id: agrId } });
		if (!department) throw { message: `No existe el departamento` };
		if (!role) throw { message: `No existe el rol` };
		if (!agregador) throw { message: `No existe el agregador` };

		const profile = await SitranDS.getRepository(Profile).findOne({ where: { department, rol: role } });
		if (!profile) throw { message: `No existe el perfil` };

		console.log({
			dep: department.name,
			rol: role.name,
			agr: agregador.name,
		});

		const DS: DataSource = getDatasource(`${agregador.id}`);
		if (!DS) throw { message: 'El agregador no tiene una base de datos activa' };

		for (let i = 0; i < views.length; i++) {
			let view: Views = await DS.getRepository(Views).findOne({ where: { viewId: views[i].id } });
			// console.log(profile.id, view.id);
			const resData = await DS.createQueryBuilder()
				.update(s_viewXprofile)
				.set({ active: views[i].status ? 1 : 0 })
				.where('profileId = :idP and viewId = :idV', { idP: profile.id, idV: view.id })
				.execute();

			// console.log(views[i].name, resData.affected);
			if (!resData.affected && views[i].status) {
				// console.log(profile.id, view);
				await DS.getRepository(s_viewXprofile).save({
					profileId: profile.id,
					view,
				});
			}
		}

		//logs
		await saveLogs(
			req,
			`Modifico las vistas [Perfil: ${department.name}/${role.name}] en  el agregador: ${agregador.name} `,
			SitranDS
		);

		res.status(200).json({ message: 'Se edito las vistas del agregador' });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

export const updateViewDesc = async (
	req: Request<{
		viewId: number;
		description: string;
	}>,
	res: Response<msg>
): Promise<void> => {
	try {
		const { viewId, description } = req.body;

		const view = await SitranDS.getRepository(GlobalViews).findOne({ where: { id: viewId } });
		if (!view) throw { message: `No existe la vista` };

		await SitranDS.getRepository(GlobalViews).update(view.id, {
			description: description,
		});

		//logs
		await saveLogs(req, `Modifico la descripcion de ${view.name}`, SitranDS);

		res.status(200).json({ message: `Se edito las descripcion de la vista ${view.name}` });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

export const updateDepartments = async (req: Request, res: Response<msg>): Promise<void> => {
	try {
		const DS: DataSource = getDatasource(req.headers.key_agregador);
		const { listDeps }: any = req.body;
		listDeps.forEach(async (dep: any) => {
			await SitranDS.getRepository(Department).update(dep.id, {
				active: dep.active,
			});
		});

		//Logs
		await saveLogs(req, `Cambio de departamentos disponibles`, DS);

		res.status(200).json({ message: 'updated department' });
	} catch (err) {
		res.status(400).json(err);
	}
};

interface InterfaceBody {
	login: string;
	name: string;
	email: string;
	type_doc: string;
	doc: string;
	rol: Roles;
	dep: Department;
}

export const createUser = async (req: Request<any>, res: Response<msg>): Promise<void> => {
	try {
		const { login, name, email, type_doc, doc, rol, dep }: InterfaceBody = req.body;

		const validIdent = await SitranDS.getRepository(UsuariosSitran).findOne({
			where: {
				id_type: type_doc,
				ident: doc,
			},
		});
		if (validIdent) throw { message: 'El documento de identidad ya existe' };

		const validLogin = await SitranDS.getRepository(UsuariosSitran).findOne({
			where: { login },
		});
		if (validLogin) throw { message: 'El login ya existe' };

		const validMail = await SitranDS.getRepository(UsuariosSitran).findOne({
			where: { email },
		});
		if (validMail) throw { message: 'El correo ya existe' };

		const nuevo: Status = await SitranDS.getRepository(Status).findOne({
			where: { id: 1 },
		});

		const profile: Profile = await SitranDS.getRepository(Profile).findOne({
			where: {
				department: dep,
				rol: rol,
			},
		});
		if (!profile) throw { message: 'Perfil no existe' };

		const expiration = await newExpirationUser(SitranDS);

		await SitranDS.getRepository(UsuariosSitran).save({
			login,
			password: '',
			name,
			id_type: type_doc,
			ident: doc,
			email,
			status: nuevo,
			profile,
			estatus: 1,
			expiration,
		});

		saveLogs(req, `Creo el usuario ${login}`, SitranDS);

		res.status(200).json({ message: 'Usuario creado' });
	} catch (err) {
		res.status(400).json(err);
	}
};

export const getPrefijos = async (req: Request<any, msg, body, Querys>, res: Response<msg>): Promise<void> => {
	try {
		const prefijos = await SitranDS.getRepository(Prefijos).find();

		const info = prefijos;

		res.status(200).json({ message: 'prefijos', info });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

interface IParams {
	description: string;
	id: number;
	key: string;
	name: string;
	value: string;
}

export const updateParams = async (req: Request<{ listParams: IParams[] }>, res: Response<msg>): Promise<void> => {
	try {
		const listParams = req.body.listParams;
		if (!listParams.length) throw { message: 'No se modifco nada' };
		for (const param of listParams) {
			await SitranDS.getRepository(Params).update(param.id, {
				value: param.value,
			});
		}

		//Logs
		await saveLogs(req, `Cambio de parametros seguridad`, SitranDS);

		res.status(200).json({ message: 'updated params' });
	} catch (err) {
		res.status(400).json(err);
	}
};
