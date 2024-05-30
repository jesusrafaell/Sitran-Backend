import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import { DataSource } from 'typeorm';
import Abonos from '../../db/agregadores/models/Abonos';
import Afiliados from '../../db/agregadores/models/Afiliados';
import Bancos from '../../db/agregadores/models/Bancos';
import CategoriasXafiliado from '../../db/agregadores/models/CategoriasXafiliado';
import Comercios from '../../db/agregadores/models/Comercios';
import ComerciosXafiliado from '../../db/agregadores/models/ComerciosXafliado';
import ComisionesMilPagos from '../../db/agregadores/models/ComisionesMilPagos';
import Contactos from '../../db/agregadores/models/Contactos';
import { getDatasource } from '../../db/config/DataSource';
import { daysToString, locationToString } from '../../functions/formatString';
import { isValid } from '../../functions/validAcoountBank';
import { validAccountNumber } from '../banco/validCuentaBank';
import saveLogs from '../logs';
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

export const getComercioByRif = async (
	req: Request<{ comerRif: string }>,
	res: Response<{ message: string; info: Comercios & Contactos & { afiliado: string } }>
): Promise<void> => {
	try {
		const DS: DataSource = getDatasource(req.headers.key_agregador);
		const comerRif = req.params.comerRif;

		const comercio = await DS.getRepository(Comercios).findOne({
			select: ['comerCod', 'comerDesc', 'comerRif', 'comerCuentaBanco'],
			where: { comerRif },
		});
		if (!comercio) throw { message: 'El comercio no existe' };

		const contacto = await DS.getRepository(Contactos).findOne({
			select: ['contMail', 'contNombres', 'contApellidos', 'contTelefMov', 'contTelefLoc'],
			where: { contCodComer: comercio.comerCod },
		});

		const afiliado = await DS.getRepository(ComerciosXafiliado).findOne({
			where: { cxaCodComer: comercio.comerCod },
		});

		const info = {
			...comercio,
			...contacto,
			afiliado: afiliado.cxaCodAfi,
		};

		res.status(200).json({ message: 'Data Comercio', info });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

export const getComercioByTerminal = async (
	req: Request<{ term: string }>,
	res: Response<{ message: string; info: Comercios & Contactos & { afiliado: string } }>
): Promise<void> => {
	try {
		const DS: DataSource = getDatasource(req.headers.key_agregador);
		const term = req.params.term;

		const terminal = await DS.getRepository(Abonos).findOne({ where: { aboTerminal: term } });
		if (!terminal) throw { message: 'El Terminal no existe' };

		const comercio = await DS.getRepository(Comercios).findOne({
			select: ['comerCod', 'comerDesc', 'comerRif', 'comerCuentaBanco'],
			where: { comerCod: terminal.aboCodComercio },
		});
		if (!comercio) throw { message: 'El comercio no existe' };

		const contacto = await DS.getRepository(Contactos).findOne({
			select: ['contMail', 'contNombres', 'contApellidos', 'contTelefMov', 'contTelefLoc'],
			where: { contCodComer: comercio.comerCod },
		});

		const afiliado = await DS.getRepository(ComerciosXafiliado).findOne({
			where: { cxaCodComer: comercio.comerCod },
		});

		const info = {
			...comercio,
			...contacto,
			afiliado: afiliado.cxaCodAfi,
		};

		res.status(200).json({ message: 'Data Comercio', info });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

export const createCommerce = async (
	req: Request<{ commerce: any; contacto: any }>,
	res: Response<{ message: string }>
): Promise<void> => {
	try {
		const { commerce, contacto } = req.body;

		const DS: DataSource = getDatasource(req.headers.key_agregador);

		if (await DS.getRepository(Comercios).findOne({ where: { comerRif: commerce.comerRif } })) {
			throw { message: 'El comercio ya existe' };
		}

		const { idActivityXAfiliado: cxaCod } = commerce;
		// console.log('numero de afiliado', cxaCod);

		const afiliado = await DS.getRepository(Afiliados).findOne({
			where: { afiCod: cxaCod },
		});

		if (!afiliado) throw { message: `El numero de afiliado [${cxaCod}], no esta disponible` };

		const categoria = await DS.getRepository(CategoriasXafiliado).findOne({
			where: { catCodAfi: afiliado.afiCod },
		});

		if (!categoria) throw { message: `No existe categoria comercial del afiliado [${afiliado.afiCod}]` };

		const validBanco = await validAccountNumber(commerce.comerCuentaBanco, DS);
		if (!validBanco.ok) {
			throw { message: validBanco.message };
		}

		const aboCodBanco = commerce.comerCuentaBanco.slice(0, 4);

		const validBank = await DS.getRepository(Bancos).findOne({
			where: { banCodBan: aboCodBanco },
		});

		if (!validBank) {
			console.log(`Code Bank invalid [${aboCodBanco}]`);
			throw { message: `Code Bank invalid [${aboCodBanco}]` };
		}

		if (!isValid(commerce.comerCuentaBanco)) {
			console.log(`Codigo de Control Invalido [${commerce.comerCuentaBanco}], banco: [${validBank.banDescBan}]`);
			throw {
				message: `Codigo de Control Invalido [${commerce.comerCuentaBanco}], banco: [${validBank.banDescBan}]`,
			};
		}

		const newCommerce: Comercios = {
			comerDesc: commerce.comerDesc,
			comerTipoPer: commerce.comerRif[0] === 'V' ? 1 : 2,
			comerCodigoBanco: aboCodBanco,
			comerCuentaBanco: commerce.comerCuentaBanco,
			comerPagaIva: 'SI',
			comerCodUsuario: null,
			comerCodPadre: 0,
			comerRif: commerce.comerRif,
			comerFreg: new Date().toISOString(),
			comerCodTipoCont: commerce.comerCodTipoCont ? 1 : 0,
			comerInicioContrato: DateTime.local().toISODate(),
			comerFinContrato: DateTime.local().plus({ years: 1 }).toISODate(),
			comerExcluirPago: 0,
			comerCodCategoria: Number(categoria.catCodCat),
			comerGarantiaFianza: 1,
			comerModalidadGarantia: 1,
			comerMontoGarFian: 7.77,
			comerModalidadPos: 3,
			comerTipoPos: 1,
			comerRecaudos: null,
			comerDireccion: locationToString(commerce.locationCommerce),
			comerObservaciones: commerce.comerObservaciones || '',
			comerCodAliado: 84,
			comerEstatus: 5,
			comerHorario: null,
			comerImagen: null,
			comerPuntoAdicional: 0,
			comerCodigoBanco2: commerce.comerCodigoBanco2 || '',
			comerCuentaBanco2: commerce.comerCuentaBanco2 || '',
			comerCodigoBanco3: commerce.comerCodigoBanco3 || '',
			comerCuentaBanco3: commerce.comerCuentaBanco3 || '',
			//
			comerDireccionHabitacion: locationToString(commerce.locationCommerce),
			comerDireccionPos: locationToString(commerce.locationCommerce),
			comerDiasOperacion: daysToString(commerce.daysOperacion),
			comerFechaGarFian: null,
		};

		// console.log(newCommerce);

		const comercioSave = await DS.getRepository(Comercios).save(newCommerce);
		console.log('listo comercio');
		//Contacto
		const newContacto: Contactos = {
			contCodComer: comercioSave.comerCod,
			contNombres: contacto.contNombres,
			contApellidos: contacto.contApellidos,
			contTelefLoc: contacto.contTelefLoc,
			contTelefMov: contacto.contTelefLoc,
			contMail: contacto.contMail,
			contCodUsuario: null,
			contFreg: new Date(),
		};

		await DS.getRepository(Contactos).save(newContacto);
		console.log('listo contacto');

		//Crear comerxafiliado
		let comerXafiSave = await DS.getRepository(ComerciosXafiliado).findOne({
			where: { cxaCodComer: comercioSave?.comerCod },
		});

		if (!comerXafiSave) {
			try {
				comerXafiSave = await DS.getRepository(ComerciosXafiliado).save({
					cxaCodAfi: afiliado.afiCod,
					cxaCodComer: comercioSave.comerCod,
				});
				// console.log('creado comercioXafilido', comerXafiSave);
			} catch (err) {
				console.log(err);
				throw { message: `Error en crear afiliacion al comercio` };
			}
		}
		//Crear Comision
		const comisionSave = await DS.getRepository(ComisionesMilPagos).findOne({
			where: { cmCodComercio: comercioSave?.comerCod },
		});

		console.log('existe comision', comisionSave);

		if (!comisionSave) {
			DS.query(`
						INSERT INTO [dbo].[ComisionesMilPagos]
							([cmCodComercio] ,[cmPorcentaje])
						VALUES (${comercioSave?.comerCod} ,0)				
        `);
		}

		console.log('listo comisionmilpagos');

		saveLogs(req, `Se creo el comercio "${comercioSave.comerRif}"`, DS);

		res.status(200).json({ message: `Comerico [${commerce.comerRif}] creado con exito` });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

export const getComerciosByAgr = async (
	req: Request,
	res: Response<{ message: string; info: Comercios[] }>
): Promise<void> => {
	try {
		const DS: DataSource = getDatasource(req.headers.key_agregador);

		const comercios = await DS.getRepository(Comercios).find({
			select: ['comerCod', 'comerDesc', 'comerRif', 'comerCuentaBanco'],
		});

		if (!comercios) throw { message: 'No hay comercios registrados' };

		res.status(200).json({ message: 'Data Comercio', info: comercios });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};
