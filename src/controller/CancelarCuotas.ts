import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import { MilpagosDS } from '../db/config/DataSource';
import { FormatQuery, selectQuery, selects } from '../functions/CancelarCuotas';
require('dotenv').config();

const { NODE_ENV } = process.env;

interface body {
	keys: string[];
	terminal: any;
}

interface Querys {
	init: string;
	end: string;
}

interface msg {
	message: string;
	info?: any;
}

export default class CancelarCuotas {
	async all(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			const { keys } = req.body;

			// formateamos la data
			const selects = selectQuery(keys);
			const sql = FormatQuery(selects, req.body.terminal);

			// ejecucion del querys ya formateado
			const info = await MilpagosDS.query(sql);

			// retornar data al cliente
			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			console.log('err', err);
			res.status(400).json(err);
		}
	}

	async keys(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
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
	}

	async dicom(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			// ejecucion del querys ya formateado
			const info = await MilpagosDS.query(
				`(SELECT * FROM OPENQUERY([${
					NODE_ENV === 'prod' ? 'POSTILION_7019' : 'POSTILION_DESA'
				}],'SELECT TOP 6 id, valorVenta FROM [rep_post_dia].[dbo].[tasas_dicom] WHERE valorVenta NOT IN (0) ORDER BY id DESC'))`
			);

			res.status(200).json({ message: 'reporte exitoso', info });
		} catch (err) {
			res.status(400).json(err);
		}
	}

	async update(req: Request<any, msg, body, Querys>, res: Response<msg>) {
		try {
			const { IVA, FECHPROCESO, MONTOTOTAL, dicomSelected }: any = req.body;

			const MONTOCOMISION = MONTOTOTAL * dicomSelected.valorVenta;
			const montoIVA = IVA * dicomSelected.valorVenta;

			// ejecucion del querys ya formateado
			await MilpagosDS.query(
				`
				UPDATE [dbo].[PlanCuota]

					SET
					 	[montoComision] = ${MONTOCOMISION},
						[montoIVA] = ${montoIVA},
						[estatusId] = 27,
						[fechaPago] = '${DateTime.now().toSQLDate()}',
						[fechaProceso] = '${DateTime.now().toSQLDate()}',
						[fechaProcesoLoteCerrado] = '${DateTime.now().toSQLDate()}',
						[tasaValor] = ${dicomSelected.valorVenta},
						[tasaId] = ${dicomSelected.id}

					WHERE aboTerminal = '${req.body.terminal}' AND fechaProceso = '${DateTime.fromISO(FECHPROCESO).toSQLDate()}'
				`
			);

			await MilpagosDS.query(/*sql*/ `
				INSERT INTO [dbo].[general_logs] ([descript] ,[email] ,[id_origin_logs])
     			
				VALUES	('[msg: ${req.body.terminal} ${DateTime.now().toSQLDate()} tasa ${
				dicomSelected.valorVenta
			}]','atovar@tranred.com.ve', 8)
			`);

			res.status(200).json({ message: 'reporte editrado' });
		} catch (err) {
			console.log(err);

			res.status(400).json(err);
		}
	}
}
