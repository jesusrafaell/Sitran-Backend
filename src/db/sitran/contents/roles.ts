import { DataSource } from 'typeorm';
import Roles from '../models/Roles';

export const listRoles: Roles[] = [
	{
		name: 'Base',
	},
	{
		name: 'Especialista',
	},
	{
		name: 'Supervisor',
	},
	{
		name: 'Admin',
	},
];

const roles = async (db: DataSource): Promise<void> => {
	//
	const valid = await db.getRepository(Roles).find({ where: listRoles });
	if (!valid.length) await db.getRepository(Roles).save(listRoles);
	console.log('Roles ✅');
};

export default roles;
