import { DataSource } from 'typeorm';
import Params from '../db/sitran/models/Params';

export const addDays = function (days: number): Date {
	var date = new Date();
	date.setDate(date.getDate() + days);
	return date;
};

export const newExpirationUser = async (DS: DataSource): Promise<Date> => {
	const expirationDate = await DS.getRepository(Params).findOne({
		where: { name: 'password', key: 'expiration' },
	});
	return addDays(Number(expirationDate.value));
};
