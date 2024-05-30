import { DataSource } from 'typeorm';
import Category_Job from '../models/category';
import Jobs from '../models/jobs';
import Types_Jobs from '../models/types_jobs';

const jobs = async (db: DataSource): Promise<void> => {
	const typeJava = await db.getRepository(Types_Jobs).findOne({ where: { name: 'Java' } });
	const typeDTS = await db.getRepository(Types_Jobs).findOne({ where: { name: 'DTS' } });
	const manana = await db.getRepository(Category_Job).findOne({ where: { name: 'Manana' } });
	const tarde = await db.getRepository(Category_Job).findOne({ where: { name: 'Tarde' } });
	const madruga = await db.getRepository(Category_Job).findOne({ where: { name: 'Madruga' } });

	const jobsList: Jobs[] = [
		{
			//1
			id_job: '97E656C2-DD78-463C-8411-9F221CBFFA37',
			name: 'Activacion_pagina__3',
			type: typeDTS,
			category: manana,
			order_exec: 1,
			active: 1,
			descripcion: 'CREACION Y REPLICA DE TERMINALES',
			server_origin: '10.198.72.32 - SERVER DTS',
		},
		{
			//2
			id_job: 'java/paso1/milpagos',
			name: 'Paso 1 Milpagos',
			type: typeJava,
			category: manana,
			order_exec: 2,
			active: 1,
			descripcion: 'Paso 1 de MilPagos',
			server_origin: 'Localhost - SERVER Operador',
		},
		{
			//2
			id_job: 'java/paso2/gscomputer',
			name: 'Paso 2 GSComputer',
			type: typeJava,
			category: manana,
			order_exec: 3,
			active: 1,
			descripcion: 'Paso 2 de GScomputer',
			server_origin: 'Localhost - SERVER Operador',
		},
		{
			//3
			id_job: 'java/paso2/carropago',
			name: 'Paso 2 Carropago',
			type: typeJava,
			category: manana,
			order_exec: 4,
			active: 1,
			descripcion: 'Paso 2 de Carropago',
			server_origin: 'Localhost - SERVER Operador',
		},
	];
	const valid = await db.getRepository(Jobs).find({ where: jobsList });
	if (!valid.length) await db.getRepository(Jobs).save(jobsList);
	console.log('Jobs ✅');
};

export default jobs;
