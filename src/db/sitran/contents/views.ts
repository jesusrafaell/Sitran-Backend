import { DataSource } from 'typeorm';
import Views from '../../global/models/Views';
import Global_Views from '../models/Global_Views';

const views = async (db: DataSource): Promise<void> => {
	const viewSeguridad = await db.getRepository(Global_Views).findOne({ where: { root: 'seguridad' } });

	const listViews: Views[] = [
		{
			viewId: viewSeguridad.id,
		},
	];
	//
	const valid = await db.getRepository(Views).find();
	if (!valid.length) await db.getRepository(Views).save(listViews);
	console.log('Views ✅');
};

export default views;
