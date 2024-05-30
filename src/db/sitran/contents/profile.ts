import { DataSource } from 'typeorm';
import Department from '../models/Department';
import Profile from '../models/Profile';
import Roles from '../models/Roles';

const profiles = async (db: DataSource): Promise<void> => {
	const ninguno = await db.getRepository(Department).findOne({ where: { name: 'Ninguno' } });
	const department = await db.getRepository(Department).findOne({ where: { name: 'Seguridad' } });

	const department2 = await db.getRepository(Department).findOne({ where: { name: 'Operaciones' } });

	const department3 = await db.getRepository(Department).findOne({ where: { name: 'API' } });

	const roles = await db.getRepository(Roles).find();

	let data: Profile[] = [];

	data.push({
		department: ninguno,
		rol: roles[0],
	});

	//Crear todos los roles para el dep seguridad, operaciones y api
	roles.map(async (rol: Roles) => {
		data.push({
			department,
			rol: rol,
		});
		data.push({
			department: department2,
			rol: rol,
		});
		data.push({
			department: department3,
			rol: rol,
		});
	});

	const valid = await db.getRepository(Profile).find();
	if (!valid.length) await db.getRepository(Profile).save(data);
	console.log('Perfiles ✅');
};

export default profiles;
