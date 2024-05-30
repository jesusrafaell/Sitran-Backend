import { DataSource } from 'typeorm';
import Category_Job from '../models/category';

export const listCategory: Category_Job[] = [
	{
		//1
		name: 'Manana',
	},
	{
		//2
		name: 'Tarde',
	},
	{
		//3
		name: 'Madruga',
	},
];

const category_job = async (db: DataSource): Promise<void> => {
	//
	const valid = await db.getRepository(Category_Job).find({ where: listCategory });
	if (!valid.length) await db.getRepository(Category_Job).save(listCategory);
	console.log('Category Job ✅');
};

export default category_job;
