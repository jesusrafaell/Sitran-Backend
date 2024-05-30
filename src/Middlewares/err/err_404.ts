// modules
import { Request, Response } from 'express';
// scripts
import descript from './code';

export default (req: Request, res: Response) => {
	// create obj of the Response
	const code_descript = descript[404];
	const message = 'Sorry the route no is valid  404';
	const obj = { message, code: 404, code_descript, path: req.originalUrl, method: req.method };

	// to write Response in the consol

	// Response
	res.status(404).json(obj);
};
