import { DataSource } from 'typeorm';
import Params from '../models/Params';

export const listParams: Params[] = [
	{
		name: 'password',
		description: 'Tiempo en dias de expiracion de la contraseña',
		key: 'expiration',
		value: '60',
	},
	{
		name: 'password',
		description: 'Cantidad de intentos de contraseña',
		key: 'entrys',
		value: '3',
	},
	{
		name: 'token',
		description: 'Tiempo en horas de expiracion del token',
		key: 'expiration',
		value: '4', // Horas
	},
	{
		name: 'passwordFormat',
		description: 'Cantidad minima de caracteres',
		key: 'minChars',
		value: '8',
	},
	{
		name: 'passwordFormat',
		description: 'Cantidad maxima de caracteres',
		key: 'maxChars',
		value: '16',
	},
	{
		name: 'passwordFormat',
		description: 'Caracteres especiales',
		key: 'specialChar',
		value: '1',
	},
	{
		name: 'passwordFormat',
		description: 'Mayuscula',
		key: 'upperCaseChar',
		value: '1',
	},
	{
		name: 'passwordFormat',
		description: 'Minuscula',
		key: 'lowerCaseChar',
		value: '1',
	},
];

const params = async (db: DataSource): Promise<void> => {
	//
	const valid = await db.getRepository(Params).find({ where: listParams });
	if (!valid.length) await db.getRepository(Params).save(listParams);
	console.log('params ✅');
};

export default params;
