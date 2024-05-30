import { DataSource } from 'typeorm';
import Department from '../models/Department';

export const listDeparment: Department[] = [
	{
		//1
		name: 'Ninguno',
	},
	{
		//2
		name: 'Seguridad',
	},
	{
		//3
		name: 'Operaciones',
	},
	{
		//3
		name: 'API',
	},
];

const department = async (db: DataSource): Promise<void> => {
	//
	const valid = await db.getRepository(Department).find({ where: listDeparment });
	if (!valid.length) await db.getRepository(Department).save(listDeparment);
	console.log('Departments ✅');
};

export default department;
