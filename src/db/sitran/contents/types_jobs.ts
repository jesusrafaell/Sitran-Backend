import { DataSource } from 'typeorm';
import Types_Jobs from '../models/types_jobs';

export const listTypes: Types_Jobs[] = [
	{
		//1
		name: 'DTS',
	},
	{
		//2
		name: 'Java',
	},
];

const types_jobs = async (db: DataSource): Promise<void> => {
	//
	const valid = await db.getRepository(Types_Jobs).find({ where: listTypes });
	if (!valid.length) await db.getRepository(Types_Jobs).save(listTypes);
	console.log('Types_Jobs ✅');
};

export default types_jobs;
