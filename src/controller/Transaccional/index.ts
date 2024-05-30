import { Request, Response } from 'express';
import { MilpagosDS } from '../../db/config/DataSource';
import { FormatQuery, selects } from '../../functions/Transaccional';
// @ts-ignore

interface body {
	transType: any;
}

interface Querys {
	transOption: string;
	initDate: string;
	endDate: string;
}

interface msg {
	message: string;
	info: any;
}

export const options = ['Aprobados', 'Rechazos', 'CierreDeLote', 'Reversos'];

export const organizations = [
	{ name: 'Venezolano Cred.', value: 'BVC' },
	{ name: 'Nacional Cred.', value: 'BNC' },
	{ name: 'Plaza', value: 'PLZ' },
	{ name: 'Milpagos', value: 'MPG' },
	{ name: 'Carropago', value: 'CPG' },
];

export default {
	async all(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			// definimos variables
			const { transOption, initDate, endDate } = req.query;
			// const { transType } = req.body;
			// const DS: DataSource = getDatasource(req.headers.key_agregador);

			// formateamos la data
			const query = FormatQuery(transOption, initDate, endDate);
			// ejecucion del querys ya formateado
			const info: any = await MilpagosDS.query(query);
			// retornar data al cliente
			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			//console.log(err);
			res.status(400).json(err);
		}
	},

	async options(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			res.status(200).json({ message: 'reporte exitoso', info: organizations });
		} catch (err) {
			res.status(400).json(err);
		}
	},

	async transType(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			let keys: any = {};

			options.forEach((item: any) => {
				if (item === 'Aprobados') {
					keys[item] = true;
				} else {
					keys[item] = false;
				}
			});

			const info: any = keys;

			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			console.log(err);
			res.status(400).json(err);
		}
	},

	async keys(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			let keys: any = {};
			selects.forEach((item: any) => {
				const { key }: any = item;
				keys[key] = false;
				// keys[key] = key === 'TERMINAL';
			});

			// const { TERMINAL, ...resto } = keys;

			const info: any = keys;

			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			console.log(err);
			res.status(400).json(err);
		}
	},
};
