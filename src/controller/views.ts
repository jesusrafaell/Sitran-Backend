import { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { getDatasource, SitranDS } from '../db/config/DataSource';
import GlobalViews from '../db/sitran/models/Global_Views';
import Views from '../db/global/models/Views';
import UsuariosSitran from '../db/sitran/models/Usuarios';
import saveLogs from './logs';
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

export const options = ['Aprobados', 'Rechazos', 'CierreDeLote', 'Reversos'];
//seguir aqui 3312

export const createView = async (req: Request<{ view: GlobalViews }>, res: Response<msg>): Promise<void> => {
	try {
		const { name, root, key, description } = req.body.view;

		const exist = await SitranDS.getRepository(GlobalViews).findOne({
			where: [{ name }, { root }, { key }],
		});
		if (exist) throw { message: 'Nombre/Path/Key ya existe' };

		const newView = await SitranDS.getRepository(GlobalViews).save({
			name: name,
			root: root,
			key: key,
			description: description,
		});

		await saveLogs(req, `Creo la vista : ${name}`, SitranDS);

		//
		res.status(200).json({ message: 'Vista Creada', info: newView });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

// interface ListView {
// 	id: number;
// 	name: string;
// 	status: boolean;
// 	description: string;
// }

export const getViewsAll = async (
	req: Request<{ agrId: number }>,
	res: Response<{ message: string; info: GlobalViews[] }>
): Promise<void> => {
	try {
		const { agrId } = req.params;

		//Todas las vistas de sitran
		const viewsAll = await SitranDS.getRepository(GlobalViews).find({ where: { active: 1 } });

		//const info = getListFormat(viewsByAgregador, viewsAll);

		res.status(200).json({ message: 'viewsByAgregador', info: viewsAll });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};
