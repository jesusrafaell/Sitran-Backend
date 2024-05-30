import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';

import process from 'child_process';
import saveLogs from '../logs';
//import { perfilAuth } from '../../utils/perfil';

function execCommand(cmd: string, password: string) {
	return new Promise((resolve, reject) => {
		process.exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.warn(error);
			}
			resolve(stdout ? stdout : stderr);
		});
	});
}

interface User {
	username: string;
	pass: string;
}

export const jar1 = async (req: Request, res: Response): Promise<void> => {
	try {
		//console.log(perfilAuth);
		console.log('hola mundo');
		//const encriptPass = (await execCommand(`java -jar java.encript/java.jar ${pass}`, pass)) as string;

		res.status(200).json({ ok: true });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};
