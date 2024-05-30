import { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { getDatasource } from '../../db/config/DataSource';
import { FormatQueryMetricas, selects } from '../../functions/MetricasPtoConsulta';

interface body {}

interface Querys {
	init: string;
	end: string;
}

interface msg {
	message: string;
	info: any;
}

export const MetricasPtoConsulta = async (req: Request<any, msg, body, Querys>, res: Response<msg>) => {
	try {
		// definimos variables
		const {} = req.body;
		const DS: DataSource = getDatasource(req.headers.key_agregador);
		const { init, end }: any = req.query;

		// formateamos la data
		const query = FormatQueryMetricas({ init, end });

		// ejecucion del querys ya formateado
		const info: any = await DS.query(query);
		// const info: any = {};

		// retornar data al cliente
		res.status(200).json({ message: 'reporte exitoso', info });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

export const keys = async (req: Request<any, msg, body, Querys>, res: Response<msg>) => {
	try {
		let info: any = {};
		selects.forEach((item: any) => {
			const { key }: any = item;

			info[key] = true;
		});

		res.status(200).json({ message: 'keys devueltas', info });
	} catch (err) {
		res.status(400).json(err);
	}
};

export default MetricasPtoConsulta;
