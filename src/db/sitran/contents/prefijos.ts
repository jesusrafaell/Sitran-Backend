import { DataSource } from 'typeorm';
import Prefijos from '../models/Prefijo';

export const listPrefijos: Prefijos[] = [
	{
		//1
		value: '01',
		subname: '',
		name: 'Milpagos',
	},
	{
		//1
		value: '02',
		subname: '',
		name: 'Milpagos',
	},
	{
		//1
		value: '03',
		subname: '',
		name: 'Milpagos',
	},
	{
		//1
		value: '49',
		subname: '',
		name: 'BPlaza',
	},
	{
		//1
		value: '56',
		subname: '',
		name: 'Carropago',
	},
];

const prefijos = async (db: DataSource): Promise<void> => {
	//
	const valid = await db.getRepository(Prefijos).find({ where: listPrefijos });
	if (!valid.length) await db.getRepository(Prefijos).save(listPrefijos);
	console.log('prefijos ✅');
};

export default prefijos;
