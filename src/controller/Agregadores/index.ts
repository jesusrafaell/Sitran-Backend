import { Request, Response } from 'express';
import { SitranDS } from '../../db/config/DataSource';
import Agregador from '../../db/sitran/models/Agregador';
import saveLogs from '../logs';
// @ts-ignore

export async function allAgregador(req: Request, res: Response<{ message: string; info: Agregador[] }>) {
	try {
		const info = await SitranDS.getRepository(Agregador).find();

		res.status(200).json({ message: 'agregadores', info });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
}

export async function UpdateStatusAgregador(
	req: Request<{ id: number; active: number }>,
	res: Response<{ message: string }>
) {
	try {
		const { id, active } = req.params;

		await SitranDS.getRepository(Agregador).update(id, {
			active,
		});

		await saveLogs(req, `Modifico agregador: [${id}] / status:[${active}] `, SitranDS);

		res.status(200).json({ message: `status agregador ${id} modificado` });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
}
