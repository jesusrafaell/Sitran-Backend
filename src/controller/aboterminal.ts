import { Request, Response } from 'express';
import { FormatQuery, selectQuery, selects } from '../functions/Abotermial';
// @ts-ignore
import axios, { AxiosResponse } from 'axios';
import { DataSource } from 'typeorm';
import { devAPT } from '../config';
import { getDatasource, MilpagosDS } from '../db/config/DataSource';

import Comercios from '../db/agregadores/models/Comercios';
import Abonos from '../db/agregadores/models/Abonos';
import { validAccountNumber } from './banco/validCuentaBank';
import ComerciosXafiliado from '../db/agregadores/models/ComerciosXafliado';

import 'dotenv/config';
import saveLogs from './logs';
const { REACT_APP_APIURL_APT } = process.env;

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
	async all(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			const { keys } = req.body;

			// console.log('holaaaaaa');

			// date today with in format yyyy-MM-dd luxon js

			// formateamos la data
			const selects = selectQuery(keys);
			const sql = FormatQuery(selects);

			// ejecucion del querys ya formateado
			const info = await MilpagosDS.query(sql);
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

interface ResTerminales {
	id: string;
	comerRif: string;
	aboNroCuenta: string;
	aboCodAfi: string;
}

export const getAllTerminal = async (
	req: Request,
	res: Response<{ message: string; terminales: ResTerminales[] }>
): Promise<void> => {
	try {
		const DS: DataSource = getDatasource(req.headers.key_agregador);

		const terminales: ResTerminales[] = await DS.query(`
			SELECT 
				aboTerminal as id, 
				c.comerRif as comerRif,
				aboNroCuenta,
				aboCodAfi,
				c.comerDesc as comerDesc
			FROM "abonos" "abonos" 
			INNER JOIN comercios c on c.comerCod = aboCodComercio 
		`);

		// console.log(terminales);
		if (!terminales) throw { message: 'No existen Terminales' };

		res.status(200).json({ message: 'terminales', terminales });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

export const getDataTerminal = async (
	req: Request<{ term: string }>,
	res: Response<{ message: string; terminales: ResTerminales[] }>
): Promise<void> => {
	try {
		const DS: DataSource = getDatasource(req.headers.key_agregador);

		const term = req.params.term;

		const terminales: ResTerminales[] = await DS.query(`
			SELECT 
				aboTerminal as id, 
				c.comerRif as comerRif,
				aboNroCuenta,
				aboCodAfi,
				c.comerDesc as comerDesc
			FROM "abonos" "abonos" 
			INNER JOIN comercios c on c.comerCod = aboCodComercio 
			where aboTerminal = ${term}
		`);

		// console.log(terminales);
		if (!terminales) throw { message: 'No existen Terminales' };

		res.status(200).json({ message: 'terminales', terminales });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

interface BodyCreateTerm {
	prefijo: string;
	cantidad: string;
	nroCuenta: string;
	comerRif: string;
}

export const createTerminal = async (
	req: Request<BodyCreateTerm>,
	res: Response<{ message: string; terminales: string }>
): Promise<void> => {
	try {
		const DS: DataSource = getDatasource(req.headers.key_agregador);

		console.log('data', req.body);
		const { cantidad, prefijo, nroCuenta, comerRif }: BodyCreateTerm = req.body;

		//validar comercio y numero de cuenta
		const commerce = await DS.getRepository(Comercios).findOne({ where: { comerRif: comerRif } });
		if (!commerce) throw { message: 'Comercio no existe' };

		const nroAfiliado = await DS.getRepository(ComerciosXafiliado).findOne({
			where: { cxaCodComer: commerce.comerCod },
		});
		if (!nroAfiliado) throw { message: 'Afiliado no existe en este comercio' };

		const validBanco = await validAccountNumber(nroCuenta, DS);
		if (!validBanco.ok) {
			throw { message: validBanco.message };
		}

		const aboCodBanco = nroCuenta.slice(0, 4);

		const baseURL = REACT_APP_APIURL_APT ? REACT_APP_APIURL_APT : devAPT;
		const resAPT: AxiosResponse<{ Terminal: string[]; ok: boolean }> = await axios.post(
			`${baseURL}new`,
			{
				afiliado: `${Number(nroAfiliado.cxaCodAfi)}`,
				cantidad,
				prefijo,
			},
			{ headers: { authorization: req.headers['authorization'] } }
		);
		console.log('APT api', resAPT.data.Terminal[0]);
		const termAPt = resAPT.data.Terminal[0].split(',');
		if (!termAPt.length) throw { message: 'No se crearon terminales' };
		for (let i = 0; i < termAPt.length; i++) {
			let term = termAPt[i];
			console.log(term);
			await DS.getRepository(Abonos).save({
				aboTerminal: term,
				aboCodAfi: nroAfiliado.cxaCodAfi,
				aboCodComercio: commerce.comerCod,
				aboCodBanco: aboCodBanco,
				aboNroCuenta: nroCuenta,
				aboTipoCuenta: '01',
				estatusId: 23,
			});
		}

		await saveLogs(
			req,
			`Se crearon ${termAPt.length}, comercio: ${comerRif}, prefijo: ${prefijo}, solicitaron: ${cantidad}`,
			DS
		);

		res.status(200).json({ message: 'terminales creadas', terminales: resAPT.data.Terminal[0] });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

export const editDataTerminal = async (
	req: Request<{ term: string; aboNroCuenta: string }>,
	res: Response<{ message: string }>
): Promise<void> => {
	try {
		const DS: DataSource = getDatasource(req.headers.key_agregador);
		const term = req.params.term;
		const aboNroCuenta = req.body.aboNroCuenta;

		const terminal = await DS.getRepository(Abonos).findOne({ where: { aboTerminal: term } });

		const validBanco = await validAccountNumber(aboNroCuenta, DS);
		if (!validBanco.ok) {
			throw { message: validBanco.message };
		}

		const aboCodBanco = aboNroCuenta.slice(0, 4);

		await DS.getRepository(Abonos).update(terminal.aboCod, {
			aboCodBanco,
			aboNroCuenta,
		});

		await saveLogs(
			req,
			`Se edito el terminal ${term}, new: "${aboNroCuenta}" / old: "${terminal.aboNroCuenta}"`,
			DS
		);

		res.status(200).json({ message: `Banco: ${validBanco.message}` });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};
