import { NextFunction, Request, Response } from 'express';
import { getDatasource } from './../db/config/DataSource';

export default (req: Request, res: Response, next: NextFunction) => {
	try {
		const agrReq = req.headers['key_agregador'] as string;
		const ds = getDatasource(agrReq);
		if (agrReq && ds) {
			req.headers.key_agregador = agrReq;
			next();
		} else throw { status: false, message: 'No se recibio el agregador', code: 400 };
	} catch (err) {
		console.log('error db_agregador', err);
		res.status(400).json(err);
	}
};
