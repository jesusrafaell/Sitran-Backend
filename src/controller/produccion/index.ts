import axios, { AxiosResponse } from 'axios';
import 'dotenv/config';
import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import { SitranDS } from '../../db/config/DataSource';
import Jobs from '../../db/sitran/models/jobs';
import jobs_prod from '../../db/sitran/models/Jobs_Prod';
import { resExecJava } from './interfacesProd';

const URL_OP = process.env.REACT_APP_APIURL_OPERADOR;

export const allProd = async (req: Request, res: Response<{ message: string; info: Jobs[] }>): Promise<void> => {
	try {
		const jobs = await SitranDS.getRepository(Jobs).find();
		res.status(200).json({ message: 'Jobs', info: jobs });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

interface Jobs_Today {
	id: number;
	id_job: number;
	status: number;
	activo: number;
	job: string;
	type: string;
	fechaEjec: string;
	horaInicioEjec: string;
	horaFinEjec: string;
	timeEjec: string;
	msj: string;
}

interface listJobs {
	inProcess: boolean;
	jobs: Jobs_Today[];
}

const formatJobs = (jobs: Jobs[], jobsToday: jobs_prod[]): listJobs => {
	const auxJob: Jobs_Today[] = [];
	// console.log(jobs);
	// console.log(jobsToday);
	let flag = true;
	let inProcess = false;
	for (let i = 0; i < jobs.length; i++) {
		const item = jobs[i];
		// console.log(jobsToday);
		const today = jobsToday.find((value) => item.id === value.job.id);
		// console.log('este', today);
		let activo = 0;
		if ((!today || today?.status === 3) && flag) {
			activo = 1;
			flag = false;
		}
		// console.log(item, activo);
		auxJob.push({
			id: i + 1,
			id_job: item.id,
			job: item.name,
			status: today ? today.status : 2,
			activo,
			type: item.type.name,
			fechaEjec: today ? today.date_exec : '',
			horaInicioEjec: today ? today.hours_init_exec : '',
			horaFinEjec: today ? today.hours_end_exec : '',
			timeEjec: today ? today.duration_exec : '',
			msj: today ? today.message : '',
		});
		//esta en proceso = 4
		if (today && today.status === 4) inProcess = true;
	}
	return {
		inProcess,
		jobs: auxJob,
	};
};

export const allProdToday = async (
	req: Request<{ id_category: number }>,
	res: Response<{ message: string; info: listJobs }>
): Promise<void> => {
	try {
		const id_category = req.params.id_category;
		const jobs = await SitranDS.getRepository(Jobs).find({
			where: { category: { id: id_category } },
			relations: ['type'],
		});
		const date = DateTime.now().toFormat('dd-MM-yyyy');
		const jobsToday = await SitranDS.getRepository(jobs_prod).find({
			where: { date_exec: date, category: { id: id_category } },
			relations: ['job'],
		});

		const info = formatJobs(jobs, jobsToday);

		// console.log(info);

		res.status(200).json({ message: 'list procesos', info });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

const timeInit = (): { begin: number; date: string; hour: string } => {
	const today = DateTime.now();
	const hour = today.hour < 10 ? `0${today.hour}` : today.hour;
	const minute = today.minute < 10 ? `0${today.minute}` : today.minute;
	const second = today.second < 10 ? `0${today.second}` : today.second;
	return {
		begin: Date.now(),
		date: today.toFormat('dd-MM-yyyy'),
		hour: `${hour}:${minute}:${second}`,
	};
};

export const execProd = async (
	req: Request<{ id: number }>,
	res: Response<{ message: string; info: jobs_prod }>
): Promise<void> => {
	const id = req.params.id;
	let prod: jobs_prod | null;
	const { begin, date, hour } = timeInit();
	try {
		let data: jobs_prod;
		const job = await SitranDS.getRepository(Jobs).findOne({ where: { id }, relations: ['type', 'category'] });
		if (!job) throw { message: 'Proceso no existe' };
		data = {
			job,
			category: job.category,
			date_exec: date,
			hours_init_exec: hour,
			hours_end_exec: '',
			duration_exec: '',
			status: 4, //ejecucion
			message: 'PENDIENTE',
		};

		prod = await SitranDS.getRepository(jobs_prod).findOne({
			where: { job: { id: job.id }, category: { id: job.category.id }, date_exec: date },
		});
		if (prod) {
			//Ya se ejecutdo
			if (prod.status === 1) {
				throw {
					message: `Proceso ya fue ejecutado ${prod.date_exec}`,
				};
				//El proceso dio error anteriormente
			} else if (prod.status === 3) {
				await SitranDS.getRepository(jobs_prod).update(prod.id, data);
				//El proceso esta en ejecucion
			} else if (prod.status === 4) {
				throw {
					message: `Proceso se esta ejecutando ${prod.date_exec} hora inicio: ${prod.hours_init_exec}`,
				};
			}
		} else prod = await SitranDS.getRepository(jobs_prod).save(data); //En espera

		if (job.type.name === 'Java') {
			//ejecutar jar
			const resAPT: AxiosResponse<resExecJava> = await axios.get(`${URL_OP}${job.id_job}`);
			const java = resAPT.data;
			if (!java)
				//si el jar no devuelve nada
				throw {
					message: 'Error en sitran.exe',
				};
			data = {
				job,
				category: job.category,
				date_exec: java.date,
				hours_init_exec: java.hour,
				hours_end_exec: java.hourEnd,
				duration_exec: java.timeProcess ? java.timeProcess : java.time,
				status: java.ok ? 1 : 3,
				message: java.res || java.msg || 'Error',
			};
		} else if (job.type.name === 'DTS') {
			// const resjob = await SitranDS.query(`
			// 		SELECT * FROM OPENQUERY([SERVER_JOBS],'exec sp_exec_and_monitor_jobs "${job.id_job}"')
			// `);
			// console.log('Resjob', resjob);
			// const monitorJob = await SitranDS.query(`
			// 	EXEC sp_get_monitor_jobs '${DateTime.now().toFormat('yyyy-MM-dd')}'
			// `);
			// console.log('monitor', monitorJob);

			data = {
				job,
				category: job.category,
				date_exec: date,
				hours_init_exec: hour,
				hours_end_exec: hour, //falta
				duration_exec: '00:00:01',
				status: 1,
				message: 'DTS exitoso',
			};
		}

		prod = await SitranDS.getRepository(jobs_prod).save({
			id: prod.id,
			...data,
		});

		res.status(200).json({ message: `Process success: ${job.name}`, info: prod });
	} catch (err) {
		console.log(err);
		if (prod) {
			await SitranDS.getRepository(jobs_prod).update(prod.id, {
				status: 3,
			});
		}
		res.status(400).json(err);
	}
};
