import { Request } from 'express';
import { DataSource } from 'typeorm';
import general_logs from '../../db/global/models/general_logs';
import origin_logs from '../../db/global/models/origin_logs';
import { IToken } from '../token';

export default async function saveLogs(req: Request<any>, msg: string, DS: DataSource): Promise<void> {
	const { email } = req.headers.token as unknown as IToken;
	const { method, originalUrl: path } = req;
	try {
		let idLog = await DS.getRepository(origin_logs).findOne({ where: { name: 'Sitran' } });
		if (!idLog) {
			console.log('Error: Hubo un error no se consiguio el origin log de Sitran');
		}

		const log: general_logs = {
			email,
			descript: `[method:${method}]::[path:${path}]::[msg:${msg}]`,
			id_origin_logs: idLog, //Sitran
		};

		await DS.getRepository(general_logs).save(log);
	} catch (err) {
		console.log(err);
	}
}
