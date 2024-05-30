import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import Department from '../../db/sitran/models/Department';
import Global_Views from '../../db/sitran/models/Global_Views';
import Params from '../../db/sitran/models/Params';
import Prefijo from '../../db/sitran/models/Prefijo';
import Roles from '../../db/sitran/models/Roles';
import Status from '../../db/sitran/models/Status';
import UsuariosSitran from '../../db/sitran/models/Usuarios';
import { newExpirationUser } from '../../functions/addDays';
import { validPasswordParams } from '../../functions/password';
import saveLogs from '../logs';
import createToken from '../token';
import { getDatasource, SitranDS } from './../../db/config/DataSource';
import { getViewsByProfile } from './formatData';

interface UserRes {
	login: string;
	name: string;
	id_department: Department;
	id_rol: Roles;
}

interface body {
	user: string;
	password: string;
}

interface ResLogin {
	message: string;
	user: UserRes;
	views: Global_Views[];
	permiss: any[];
	access_token?: string;
	prefijos?: Prefijo[];
}

export const login = async (req: Request<body>, res: Response<ResLogin>) => {
	try {
		const { user, password } = req.body;
		if (!user || !password) throw { message: 'Debe ingresar usuario y contrasena' };

		const key_agr = req.headers.key_agregador;
		const DS: DataSource = getDatasource(key_agr);

		const salt: string = await bcrypt.genSalt(10);
		const passEncript = await bcrypt.hash(password, salt);

		const resUserDS = await SitranDS.getRepository(UsuariosSitran).findOne({
			where: [
				{
					login: user,
				},
			],
			relations: ['status', 'profile', 'profile.department', 'profile.rol', 'prefijos'],
		});

		const expDate = new Date(resUserDS.expiration);
		const now = new Date();

		if (expDate < now && resUserDS.status.id !== 1) {
			await SitranDS.getRepository(UsuariosSitran).update(resUserDS.id, {
				status: { id: 1 },
			});
			throw { message: 'Su contraseña expiro ingrese una nueva contraseña' };
		}

		if (!resUserDS) throw { message: 'Correo o Contraseña incorrecta', code: 401 };

		switch (resUserDS.status.id) {
			case 1: //Nuevo
				const activo = await SitranDS.getRepository(Status).findOne({
					where: { id: 2 },
				});
				if (resUserDS.password !== '' && (await bcrypt.compare(password, resUserDS.password))) {
					throw { message: 'La contraseña debe ser diferente a la anterior' };
				}
				const passwordParams = await SitranDS.getRepository(Params).find({
					where: { name: 'passwordFormat' },
				});
				const params = validPasswordParams(passwordParams, password);
				if (params.length) throw { message: `Contraseña invalida: ${params[0]}` };
				let newDateExpire = expDate;
				if (expDate < now) {
					newDateExpire = await newExpirationUser(SitranDS);
				}
				await SitranDS.getRepository(UsuariosSitran).update(resUserDS.id, {
					password: passEncript,
					expiration: newDateExpire, //param time
					status: activo,
				});
				break;
			case 2: //Activo
				const validPassword = await bcrypt.compare(password, resUserDS.password);
				//console.log(validPassword);
				if (!validPassword) {
					throw { message: 'Contraseña incorrecta', code: 400 };
				}
				break;
			case 3: //Bloqueado
				throw { message: 'Usuario Bloquado', code: 401 };
			case 4: //Inactivo
				throw { message: 'Usuario Inactivo', code: 401 };
		}

		const department = resUserDS.profile.department;
		if (!department.active) throw { message: `El departamento de ${department.name} esta Bloqueado`, code: 401 };

		const profileId = resUserDS.profile.id;

		let views = await getViewsByProfile(DS, profileId);

		if (!views.length) {
			views = await SitranDS.getRepository(Global_Views).find({ where: { name: 'Inicio' } });
		}

		let permiss: any = [];

		const token: string = await createToken(resUserDS.id, resUserDS.email, resUserDS.profile);

		const userRes: UserRes = {
			login: resUserDS.login,
			name: resUserDS.name,
			id_department: department,
			id_rol: resUserDS.profile.rol,
		};

		const info = {
			user: userRes,
			views,
			permiss,
			prefijos: resUserDS.prefijos,
		};

		//save in log
		const reqAux: any = req;
		reqAux.headers.token = { email: resUserDS.email };
		await saveLogs(reqAux, `Login de Usuario`, SitranDS);

		res.status(200).json({ message: 'login', ...info, access_token: token });
	} catch (err) {
		console.log(err);
		res.status(err.code || 400).json(err);
	}
};

export const getLogin = async (req: Request, res: Response<ResLogin>) => {
	try {
		const { id }: any = req.headers.token;

		const resUserDS = await SitranDS.getRepository(UsuariosSitran).findOne({
			where: [
				{
					id,
				},
			],
			relations: ['status', 'profile', 'profile.department', 'profile.rol', 'prefijos'],
		});

		if (!resUserDS) throw { message: 'Usuario no existe en Sitran' };

		const key_agr = req.headers.key_agregador;
		const DS: DataSource = getDatasource(key_agr);

		const department = resUserDS.profile.department;
		if (!department.active) throw { message: `El departamento de ${department.name} esta Bloqueado`, code: 401 };

		const profileId = resUserDS.profile.id;

		// console.log({ perfil: profileId, arg: key_agr });

		let views = await getViewsByProfile(DS, profileId);

		//console.log('views', views);

		//console.log('views', views);

		if (!views.length) {
			views = await SitranDS.getRepository(Global_Views).find({ where: { name: 'Inicio' } });
			//	throw { message: 'El perfil del usuario no tiene vistas asignadas en el agregador', code: 406 };
		}

		let permiss: any = [];

		const userRes: UserRes = {
			login: resUserDS.login,
			name: resUserDS.name,
			id_department: department,
			id_rol: resUserDS.profile.rol,
		};

		const info = {
			user: userRes,
			views,
			permiss,
			prefijos: resUserDS.prefijos,
		};

		res.status(200).json({ message: 'Usuario', ...info });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};
