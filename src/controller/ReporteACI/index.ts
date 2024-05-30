import { Request, Response } from 'express';
import { MilpagosDS } from '../../db/config/DataSource';
import { FormatQuerySP, selects } from '../../functions/ReporteACI';

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

interface ACIxClient {
	ACINOMBRES: string;
	CLIENTNOMBRES?: string;
	DIRECCION: string;
	NUMEROS: string;
	TERMINAL: string;
	AFILIADO: string;
	MONTOTOTAL: number;
	IVA: number;
	ESTATUS: string;
	CANT_CUOTAS: string;
	MONTOTOTAL_BS: number;
	MONTO: number;
}

export default {
	async all(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			// const keys = selects.map((val) => {
			// 	return val.key;
			// });

			// formateamos la data
			// const selects2 = selectQuery(keys);
			// const sql = FormatQuery(selects2);

			const sql = FormatQuerySP();

			// ejecucion del querys ya formateado
			const info = await MilpagosDS.query(sql);
			for (let index = 0; index < info.length; index++) {
				const {
					CLIENTNOMBRES,
					ACINOMBRES,
					DIRECCION,
					NUMEROS,
					TERMINAL,
					AFILIADO,
					MONTOTOTAL,
					IVA,
					ESTATUS,
					CANT_CUOTAS,
					MONTOTOTAL_BS,
					MONTO,
				} = info[index];

				if (CLIENTNOMBRES === 'CLIENTES') {
					info[index] = {
						ACINOMBRES,
						CLIENTNOMBRES: 'Clientes',
						DIRECCION,
						NUMEROS,
						TERMINAL,
						AFILIADO,
						MONTOTOTAL,
						IVA,
						ESTATUS,
						CANT_CUOTAS,
						MONTOTOTAL_BS,
						MONTO,
					};
				} else {
					info[index] = {
						ACINOMBRES: '',
						CLIENTNOMBRES,
						DIRECCION,
						NUMEROS,
						TERMINAL,
						AFILIADO,
						MONTOTOTAL,
						IVA,
						ESTATUS,
						CANT_CUOTAS,
						MONTOTOTAL_BS,
						MONTO,
					};
				}
				// formateando con key names
			}
			// retornar data al cliente
			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			console.log('err', err);

			res.status(400).json(err);
		}
	},

	async keys(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			// console.log('holaaaaaa keys');

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
	},
};
