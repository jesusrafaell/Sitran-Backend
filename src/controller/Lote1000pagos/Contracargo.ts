import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import * as path from 'path';
import { getDatasource, MilpagosDS, SitranDS } from './../../db/config/DataSource';
import { getmail } from './../mail/index';
//
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import contra_cargo from '../../db/agregadores/models/contra_cargo';
import Historico_Contracargo from '../../db/agregadores/models/Historico_Contracargo';
import Agregador from '../../db/sitran/models/Agregador';
import { FormatQuery, selects } from '../../functions/Lote1000pagos/Contracargo';
import saveLogs from '../logs';
config();

const { MAIL_BUZON_CONTRACARGO } = process.env;

interface QueryContracargo {
	AFILIADO: string;
	TERMINAL: string;
	RIF: string;
	NOMBRE: string;
	MONTO_DISPUTA: string;
	MONTO_TRANSADO: string;
	MONTO_DESCONTADO: string;
	MONTO_PENDIENTE: string;
	MONTO_ABONAR: string;
	FECHA_EJECUCION: string;
}

interface Lote {
	Terminal: string;
	'Monto de Cuota ($)': number;
}

interface body {
	lote: Lote[];
	nameFile: string;
}

interface bodyContra {
	fecha: string;
}

interface Querys {
	init: string;
	end: string;
}

interface msg {
	message: string;
	info?: any;
}

export const base: string = path.resolve('static');

export default {
	async upFile(req: Request<body>, res: Response<msg>) {
		try {
			const DS: DataSource = getDatasource(req.headers.key_agregador);
			if (!req.body.lote && !req.body.nameFile) throw { message: 'No se encontro ningun lote' };

			const lote: Lote[] = JSON.parse(req.body.lote);

			if (!lote.length) throw { message: 'No se encontro ningun lote' };
			const iso = DateTime.now();

			const dateCargo = await DS.getRepository(contra_cargo)
				.createQueryBuilder()
				.where('createdAt= :f', { f: iso.toFormat('yyyy-MM-dd') })
				.getOne();

			if (dateCargo) {
				throw { message: 'El dia de hoy ya se cargo un archivo de ContraCargo' };
			}

			lote.forEach((item: Lote, index: number) => {
				const term = item[Object.keys(item)[0]];
				const monto: number = item[Object.keys(item)[1]];
				if (term.length !== 8) {
					throw { message: `Tamaño del terminal ${term} invalido, registro ${index + 2}` };
				}
				if (!monto) {
					throw { message: `Terminal: ${term} el monto es 0 o esta vacio, registro ${index + 2}` };
				}
			});

			for (let i = 0; i < lote.length; i++) {
				let item = lote[i];
				let term = item[Object.keys(item)[0]];
				let monto: number = item[Object.keys(item)[1]];
				if (term) {
					const terminal = await DS.getRepository(Historico_Contracargo).findOne({
						where: { TERMINAL: term },
					});
					if (terminal) {
						let suma = terminal.MONTO_COBRA + monto;
						await DS.getRepository(Historico_Contracargo).update(terminal.ID, {
							MONTO_COBRA: suma,
						});
					} else {
						await DS.getRepository(Historico_Contracargo).save({
							TERMINAL: term,
							MONTO_COBRA: monto,
							MONTO_PAGO: 0,
						});
					}
				}
			}

			const fileContracargo = await DS.getRepository(contra_cargo).save({
				name: req.body.nameFile,
			});

			await saveLogs(req, `Subio un archivo de contracardo id: [${fileContracargo.id}]`, DS);
			//Email parametros {lotelength: cantidad de registros en total, fecha: iso, nombre del archivo: req.body.nameFile  }
			const agr = await SitranDS.getRepository(Agregador).findOne({
				where: { key: Number(req.headers.key_agregador) },
			});
			const to = MAIL_BUZON_CONTRACARGO ? MAIL_BUZON_CONTRACARGO : `arivas@tranred.com.ve`;
			const fecha = iso.toFormat('dd-MM-yyyy');
			// const fecha = iso.toISOString().split('T')[0].split('-').reverse().join('-');
			// const hora = iso.toISOString().split('T')[1].replace('Z', '').split('.')[0];
			const hora = `${iso.hour + ':' + iso.minute + ':' + iso.second}`;
			const subject = `${agr.name} - Se colocó el archivo en forma satisfatoria`;
			const fileName = req.body.nameFile;
			const cantRegistros = lote.length;

			const emailSend = await getmail(to, subject, agr.name, 'cargaContracargo', {
				cantRegistros,
				fecha,
				hora,
				fileName,
			});
			if (!emailSend) throw { message: `Fallo el envio del correo de contracargo` };

			res.status(200).json({ message: 'File Saved' });
		} catch (err) {
			console.log(err);
			res.status(400).json(err);
		}
	},

	async all(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			const { init, end } = req.query;

			// formatear SP a ejecutar
			const sql = FormatQuery(init, end);

			// ejecucion del querys ya formateado
			const info: QueryContracargo[] | [] = await MilpagosDS.query(sql);
			//console.log(info);

			// retornar data al cliente
			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			//console.log('err', err);
			res.status(400).json(err);
		}
	},

	async keys(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			let keys: any = {};
			selects.forEach((item: any) => {
				const { key }: any = item;

				keys[key] = key === 'TERMINAL';
			});

			const { TERMINAL, ...resto } = keys;

			const info: any = { TERMINAL, ...resto };

			res.status(200).json({ message: 'columnas enviadas', info });
		} catch (err) {
			res.status(400).json(err);
		}
	},

	async execContracargo(req: Request<bodyContra, Querys>, res: Response<msg>) {
		const to = MAIL_BUZON_CONTRACARGO ? MAIL_BUZON_CONTRACARGO : `arivas@tranred.com.ve`;
		const { fecha } = req.body;
		if (!fecha) throw { message: 'fecha invalida' };
		const DS: DataSource = getDatasource(req.headers.key_agregador);
		const agr = await SitranDS.getRepository(Agregador).findOne({
			where: { key: Number(req.headers.key_agregador) },
		});
		const subject = `${agr.name} - Se da inicio al proceso de Descuento por Contracargo`;
		const subjectEnd = `${agr.name} - Se da por culminado el proceso de Descuento por Contracargo`;
		try {
			const date = new Date(fecha).toISOString().split('T')[0];
			const dateIn = DateTime.now();
			const fechaIn = dateIn.toFormat('dd-MM-yyyy');
			const hora = `${dateIn.hour + ':' + dateIn.minute + ':' + dateIn.second}`;
			await getmail(to, subject, agr.name, 'execContracargo', { fecha: fechaIn, hora });

			const SP_contracargo: any = await DS.query(`EXEC sp_contracargos '${date}'`);
			//console.log('Respuesta sp -> ', SP_contracargo);
			await saveLogs(req, `Ejecutado contracargo ${fechaIn} - ${hora}`, DS);

			const dateEnd = DateTime.now();
			const fechaend = dateEnd.toFormat('dd-MM-yyyy');
			const horaEnd = `${dateEnd.hour + ':' + dateEnd.minute + ':' + dateEnd.second}`;
			await getmail(to, subjectEnd, agr.name, 'successContracargo', { fecha: fechaend, hora: horaEnd });

			res.status(200).json({ message: 'contracargo ejecutado', info: { ok: true, line: 11, fecha: date } });
		} catch (err) {
			console.log(err);
			const dateErr = DateTime.now();
			const fechaend = dateErr.toFormat('dd-MM-yyyy');
			const horaEnd = `${dateErr.hour + ':' + dateErr.minute + ':' + dateErr.second}`;
			await getmail(to, subjectEnd, agr.name, 'errorContracargo', { fecha: fechaend, hora: horaEnd });
			res.status(400).json(err);
		}
	},
};
