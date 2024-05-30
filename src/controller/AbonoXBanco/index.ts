import { config } from 'dotenv';
import { Request, Response } from 'express';
import * as fs from 'fs';
import { DateTime } from 'luxon';
import * as XLSX from 'xlsx';
import { FormatQueryAgregadorXBanco, selects } from '../../functions/AbonoxBanco';
import { getmail } from '../mail';
import { MilpagosDS } from './../../db/config/DataSource';
config();

const { MAIL_BUZON_ABONOCLIENTES } = process.env;

interface body {}

interface Querys {
	init: string;
	end: string;
}

interface msg {
	message: string;
	info: any;
}

export const AbonoXBanco = async (req: Request<any, msg, body, Querys>, res: Response<msg>) => {
	try {
		// definimos variables
		const {} = req.body;
		// const DS: DataSource = getDatasource(req.headers.key_agregador);
		const { init }: any = req.query;

		// formateamos la data
		const query = FormatQueryAgregadorXBanco({ init });

		// ejecucion del querys ya formateado
		const info: any = await MilpagosDS.query(query);
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

export const emailFileSender = async (req: Request<any, msg, body, Querys>, res: Response<msg>) => {
	const to = MAIL_BUZON_ABONOCLIENTES ? MAIL_BUZON_ABONOCLIENTES : `arivas@tranred.com.ve`;
	try {
		const {} = req.body;
		// const { init }: any = req.query;
		const now = DateTime.now();
		const init = now.toFormat('yyyy-MM-dd');
		const fecha = now.toFormat('dd-MM-yyyy');
		const hora = `${now.hour + ':' + now.minute + ':' + now.second}`;
		// formateamos la data
		const query = FormatQueryAgregadorXBanco({ init });
		const fileName = `Abono_Clientes_${fecha}`;
		// ejecucion del querys ya formateado
		const info = await MilpagosDS.query(query);
		const cantRegistros = info.length;
		// Crear Excel
		if (cantRegistros > 0) {
			const workSheet = XLSX.utils.json_to_sheet(info);
			const workBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, 'Abono Clientes');
			XLSX.writeFileXLSX(workBook, `${fileName}.xlsx`);
			await getmail(to, fileName, '', 'archivoAbonoClientes', {
				fecha,
				hora,
				cantRegistros,
				attachments: [
					{
						path: `${fileName}.xlsx`,
					},
				],
			});

			// Eliminar el archivo creado
			fs.unlink(`${fileName}.xlsx`, (err) => {
				if (err) {
					console.log(`Error eliminando el archivo ${fileName}`, err);
					throw err;
				}
			});
		}

		res.status(200).json({ message: 'Correo enviado satisfactoriamente', info });
	} catch (err) {
		res.status(400).json(err);
	}
};

export default AbonoXBanco;
