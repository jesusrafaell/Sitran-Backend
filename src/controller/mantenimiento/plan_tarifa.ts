import { Request, Response } from 'express';
import { FormatQuery, selectQuery, selects } from '../../functions/mantenimineto/sin_plan';
// @ts-ignore
import { MilpagosDS } from '../../db/config/DataSource';

interface body {
	keys: string[];
}

interface Querys {
	init: string;
	end: string;
}

interface msg {
	message: string;
	info: any;
}

export default class plan_tarifa {
	async all(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			// definimos variables
			const { keys } = req.body;

			// formateamos la data
			const selects = selectQuery(keys);
			const query = FormatQuery(selects);
			// ejecucion del querys ya formateado
			const info: any = await MilpagosDS.query(query);

			// retornar data al cliente
			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			res.status(400).json(err);
		}
	}

	async keys(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			let keys: any = {};
			selects.forEach((item: any) => {
				const { key }: any = item;

				keys[key] = key === 'TERMINAL';
			});

			const { TERMINAL, ...resto } = keys;

			const info: any = { TERMINAL, ...resto };

			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			res.status(400).json(err);
		}
	}
}
