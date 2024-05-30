// modules
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import list from './list';
require('dotenv').config();
const Key: string = process.env.SECRET!;

/** this middleware is for convert json web token in Objet format */
export default (req: Request, res: Response, next: NextFunction) => {
	try {
		// define array route

		// rutas publicas
		const result: boolean =
			list.includes(req.baseUrl) ||
			list.includes(req.path) ||
			list.includes(req.path.split('/')[1]) ||
			list.includes(req.path.split('/')[2]);
		//

		// console.log(req.headers);
		// console.log(req.headers['authorization']);

		if (!result) {
			if (req.headers['authorization']) {
				req.headers['authorization'] = req.headers['authorization'].replace('Bearer ', '');
				const token: string = req.headers['authorization'];
				try {
					const Resp: any = verify(token, Key);
					req.headers.token = Resp;
					req.headers.token_text = token;
					next();
				} catch (err) {
					res.status(401).json({ message: 'JWT invalid format', code: 401 });
				}
			} else throw { status: false, message: 'JWT es requerido', code: 400 };
		} else {
			next();
		}
	} catch (err) {
		console.log('error token', err);
		res.status(400).json(err);
	}
};
