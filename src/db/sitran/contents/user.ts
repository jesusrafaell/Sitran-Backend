import { DateTime } from 'luxon';
import { DataSource } from 'typeorm';
import Agregador from '../models/Agregador';
import Department from '../models/Department';
import Profile from '../models/Profile';
import Roles from '../models/Roles';
import Status from '../models/Status';
import Usuarios from '../models/Usuarios';

const preUsuario = (profile: Profile, status: Status): Usuarios => ({
	login: 'test',
	password: '',
	name: 'Armando Rivas',
	id_type: 'V',
	ident: '12345678',
	email: 'test@correo.com',
	profile,
	status,
	expiration: new Date(),
});

const preUsuario2 = (profile: Profile, status: Status): Usuarios => ({
	login: 'test2',
	password: '',
	name: 'Jesus Hernandez',
	id_type: 'V',
	ident: '12345679',
	email: 'testx@correo.com',
	profile,
	status,
	expiration: new Date(),
});

const preUsuario3 = (profile: Profile, status: Status, agregador: Agregador): Usuarios => ({
	login: 's_librep',
	password: '',
	name: 'API Librepago',
	id_type: 'J',
	ident: '12345670',
	email: 'librepago@correo.com',
	profile,
	status,
	agregador,
	expiration: new Date(),
});

const preUsuario4 = (profile: Profile, status: Status, agregador: Agregador): Usuarios => ({
	login: 's_carrop',
	password: '',
	name: 'API Carropago',
	id_type: 'J',
	ident: '12345601',
	email: 'carropago@correo.com',
	profile,
	status,
	agregador,
	expiration: new Date(),
});

const preUser = async (db: DataSource): Promise<void> => {
	const department = await db.getRepository(Department).findOne({ where: { name: 'Seguridad' } });

	const department2 = await db.getRepository(Department).findOne({ where: { name: 'Operaciones' } });
	const department3 = await db.getRepository(Department).findOne({ where: { name: 'API' } });

	const rol = await db.getRepository(Roles).findOne({ where: { name: 'Admin' } });

	const profile = await db.getRepository(Profile).findOne({ where: { department, rol } });
	const profile2 = await db.getRepository(Profile).findOne({ where: { department: department2, rol } });
	const profile3 = await db.getRepository(Profile).findOne({ where: { department: department3, rol } });

	const status = await db.getRepository(Status).findOne({ where: { name: 'Nuevo' } });

	const agrL = await db.getRepository(Agregador).findOne({ where: { name: 'Librepago' } });
	const agrC = await db.getRepository(Agregador).findOne({ where: { name: 'Carropago' } });

	const user = preUsuario(profile, status);
	const user2 = preUsuario2(profile2, status);
	const user3 = preUsuario3(profile3, status, agrL);
	const user4 = preUsuario4(profile3, status, agrC);
	//
	const valid = await db.getRepository(Usuarios).findOne({ where: { login: user.login } });
	if (!valid) await db.getRepository(Usuarios).save(user);

	const valid2 = await db.getRepository(Usuarios).findOne({ where: { login: user2.login } });
	if (!valid2) await db.getRepository(Usuarios).save(user2);

	const valid3 = await db.getRepository(Usuarios).findOne({ where: { login: user3.login } });
	if (!valid3) await db.getRepository(Usuarios).save(user3);

	const valid4 = await db.getRepository(Usuarios).findOne({ where: { login: user4.login } });
	if (!valid4) await db.getRepository(Usuarios).save(user4);
	console.log('Users ✅');
};

export default preUser;
