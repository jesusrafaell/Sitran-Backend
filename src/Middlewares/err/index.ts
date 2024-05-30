// modules
import { NextFunction, Request, Response } from 'express';
// scripts
import codes from './code';

export default (err: any, req: Request, res: Response, next: NextFunction) => {
	if (!err) next();
	// define vars
	const descripts: any = codes;
	const code: number =
		err.code && typeof err.code != 'string' ? err.code : err.Response ? err.Response.status : 500;

	const message = ((): string => {
		if (err.Response) return err.Response.message;
		else if (err.errors) return err.errors.map((err: any) => err.msg).join(', ');
		else if (err.message) return err.message;
		else return err;
	})();
	const code_descript: string = descripts[code] ? descripts[code] : `${code}`;

	// create obj for Response
	const obj = { message, code, code_descript, path: req.originalUrl, method: req.method };

	// to write Response in the consol

	// Response
	res.status(code).json(obj);
};
