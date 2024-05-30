import { DataSource } from 'typeorm';
import Status from '../models/Status';

const list: Status[] = [
	{
		name: 'Nuevo',
	},
	{
		name: 'Activo',
	},
	{
		name: 'Bloqueado',
	},
	{
		name: 'Inactivo',
	},
	{
		name: 'No expira',
	},
];

const status = async (db: DataSource): Promise<void> => {
	//
	const valid = await db.getRepository(Status).find({ where: list });
	if (!valid.length) await db.getRepository(Status).save(list);
	console.log('Status ✅');
};

export default status;
