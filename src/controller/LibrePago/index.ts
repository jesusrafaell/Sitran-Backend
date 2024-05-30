import { Request, Response } from 'express';
import { MilpagosDS } from '../../db/config/DataSource';
import { dateRang, FormatQuery, selects } from '../../functions/LibrePago';

interface body {
	terminales: string;
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
			const { terminales } = req.body;

			const { init, end }: any = req.query;

			// formateamos la data
			const Dates = dateRang(init, end);
			const query = FormatQuery({ init, end }, terminales);

			// ejecucion del querys ya formateado
			const info: any = await MilpagosDS.query(query);
			// const info: any = {};

			// retornar data al cliente
			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			res.status(400).json(err);
		}
	},

	async keys(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			let info: any = {};
			selects.forEach((item: any) => {
				const { key }: any = item;

				info[key] = true;
			});

			// const { TERMINAL, ...resto } = keys;

			// const info: any = { TERMINAL, ...resto };

			res.status(200).json({ message: 'keys devueltas', info });
		} catch (err) {
			res.status(400).json(err);
		}
	},
};
