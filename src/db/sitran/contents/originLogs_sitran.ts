import { DataSource } from 'typeorm';
import origin_logs from '../../global/models/origin_logs';

export const origin: origin_logs[] = [
	{
		//1
		name: 'Sitran',
	},
	{
		//1
		name: 'ApiPgTerm',
	},
];

const originLogs_sitran = async (db: DataSource): Promise<void> => {
	//
	const valid = await db.getRepository(origin_logs).findOne({ where: origin });
	if (!valid) await db.getRepository(origin_logs).save(origin);
	console.log('logs ✅');
};

export default originLogs_sitran;
