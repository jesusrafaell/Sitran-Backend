import { config } from 'dotenv';
import { DataSource } from 'typeorm';
config();

const { HOST_ST, USER_ST, PASS_ST } = process.env;

export const SitranDS = new DataSource({
	type: 'mssql',
	host: HOST_ST,
	username: USER_ST,
	password: PASS_ST,
	database: 'sitran',
	options: {
		encrypt: false,
		cancelTimeout: 15000,
	},
	requestTimeout: 600000,
	connectionTimeout: 30000,
	synchronize: false,
	migrationsRun: false,
	logging: false,
	entities: ['src/db/sitran/models/**/*.ts', 'src/db/global/models/**/*.ts'],
	migrations: ['src/db/sitran/base/**/*.ts'],
	subscribers: ['src/db/sitran/subscriber/**/*.ts'],
	migrationsTableName: 'sitran_migrations_v2',
});

const { HOST_MP, USER_MP, PASS_MP } = process.env;

export const MilpagosDS = new DataSource({
	type: 'mssql',
	host: HOST_MP,
	username: USER_MP,
	password: PASS_MP,
	database: 'milpagos',
	options: {
		encrypt: false,
		cancelTimeout: 15000,
	},
	requestTimeout: 600000,
	connectionTimeout: 30000,
	synchronize: false,
	migrationsRun: false,
	logging: false,
	entities: ['src/db/agregadores/models/**/*.ts', 'src/db/global/models/**/*.ts'],
	migrations: ['src/db/agregadores/migrations/**/*.ts'],
	subscribers: ['src/db/agregadores/subscriber/**/*.ts'],
	migrationsTableName: 'sitran_migrations',
});

const { HOST_CP, USER_CP, PASS_CP } = process.env;

export const CarropagoDS = new DataSource({
	type: 'mssql',
	host: HOST_CP,
	username: USER_CP,
	password: PASS_CP,
	database: 'carropago',
	options: {
		encrypt: false,
		cancelTimeout: 15000,
	},
	requestTimeout: 600000,
	connectionTimeout: 30000,
	synchronize: false,
	migrationsRun: false,
	logging: false,
	entities: ['src/db/agregadores/models/**/*.ts', 'src/db/global/models/**/*.ts'],
	migrations: ['src/db/agregadores/migrations/**/*.ts'],
	subscribers: ['src/db/agregadores/subscriber/**/*.ts'],
	migrationsTableName: 'sitran_migrations',
});

const { HOST_LP, USER_LP, PASS_LP } = process.env;

export const LibrepagoDS = new DataSource({
	type: 'mssql',
	host: HOST_LP,
	username: USER_LP,
	password: PASS_LP,
	database: 'librepago',
	options: {
		encrypt: false,
		cancelTimeout: 15000,
	},
	requestTimeout: 600000,
	connectionTimeout: 30000,
	synchronize: false,
	migrationsRun: false,
	logging: false,
	entities: ['src/db/agregadores/models/**/*.ts', 'src/db/global/models/**/*.ts'],
	migrations: ['src/db/agregadores/migrations/**/*.ts'],
	subscribers: ['src/db//agregadores/subscriber/**/*.ts'],
	migrationsTableName: 'sitran_migrations',
});

const { HOST_GC, USER_GC, PASS_GC } = process.env;

export const GSComputerDS = new DataSource({
	type: 'mssql',
	host: HOST_GC,
	username: USER_GC,
	password: PASS_GC,
	database: 'gscomputer',
	options: {
		encrypt: false,
		cancelTimeout: 15000,
	},
	requestTimeout: 600000,
	connectionTimeout: 30000,
	synchronize: false,
	migrationsRun: false,
	logging: false,
	entities: ['src/db/agregadores/models/**/*.ts', 'src/db/global/models/**/*.ts'],
	migrations: ['src/db/agregadores/migrations/**/*.ts'],
	subscribers: ['src/db//agregadores/subscriber/**/*.ts'],
	migrationsTableName: 'sitran_migrations',
});

export const getDatasource = (agr: string | string[]): DataSource => {
	const agregador = Number(agr);
	switch (agregador) {
		case 1:
			return CarropagoDS;
		case 2:
			return MilpagosDS;
		case 3:
			return LibrepagoDS;
		case 4:
			return GSComputerDS;
		case 5:
			return SitranDS;
	}
};
