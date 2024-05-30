import { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { dateRang, FormatQuery, selectQuery, selects, selectsCP } from '../functions/history';
import { getDatasource } from './../db/config/DataSource';

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

export default {
	async allHistory(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			// definimos variables
			const { keys } = req.body;
			const key_agr = req.headers.key_agregador as string;
			const DS: DataSource = getDatasource(key_agr);
			const { init, end, sponsor }: any = req.query;

			// formateamos la data
			const Dates = dateRang(init, end);
			const selects = selectQuery(keys, key_agr);
			const query = FormatQuery({ init, end }, selects, key_agr, sponsor);

			// console.log('query', query);

			// ejecucion del querys ya formateado
			const info: any = await DS.query(query);

			// retornar data al cliente
			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			res.status(400).json(err);
		}
	},

	async keys(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		const key_agr = req.headers.key_agregador;
		let select_Arr = [];
		switch (key_agr) {
			case '1':
				select_Arr = selectsCP;
				break;
			case '3':
				select_Arr = selectsCP;
				break;
			default:
				select_Arr = selects;
				break;
		}
		try {
			let keys: any = {};
			select_Arr.forEach((item: any) => {
				const { key }: any = item;

				keys[key] = key === 'TERMINAL';
			});

			const { TERMINAL, ...resto } = keys;

			const info: any = { TERMINAL, ...resto };

			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			res.status(400).json(err);
		}
	},
};
