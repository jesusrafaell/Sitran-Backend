import { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import Afiliados from '../db/agregadores/models/Afiliados';
import { getDatasource } from '../db/config/DataSource';
// @ts-ignore

interface body {
	transType: any;
}

interface Querys {
	transOption: number;
	monthoption: string;
}

interface msg {
	message: string;
	info?: any;
}

export const getAllAfiliados = async (
	req: Request<{ comerRif: string }>,
	res: Response<{ message: string; info: Afiliados[] }>
): Promise<void> => {
	try {
		const DS: DataSource = getDatasource(req.headers.key_agregador);
		const afiliados = await DS.getRepository(Afiliados).find({
			select: ['afiCod'],
		});
		console.log(afiliados);
		res.status(200).json({ message: 'Data Comercio', info: afiliados });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};
