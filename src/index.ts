import express, { Application } from 'express';
import 'reflect-metadata';
import { Conections } from './db/config';
import { posRoutes, preRoutes } from './Middlewares';
import Routes from './router';
require('dotenv').config();

//
var fileupload = require('express-fileupload');

const { HOST, USER, PASS, DB, PORT } = process.env;

// const https_options = {
// 	key: fs.readFileSync('key.pem'),
// 	cert: fs.readFileSync('cert.pem'),
// };

const app: Application = express();
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: true }));

preRoutes(app);

Routes(app);

posRoutes(app);

Conections().then(() => {
	// https.createServer(https_options, app).listen(PORT, () => {
	app.listen(PORT, () => {
		console.log('');
		console.log('███████╗██╗████████╗██████╗  █████╗ ███╗   ██╗');
		console.log('██╔════╝██║╚══██╔══╝██╔══██╗██╔══██╗████╗  ██║');
		console.log('███████╗██║   ██║   ██████╔╝███████║██╔██╗ ██║');
		console.log('╚════██║██║   ██║   ██╔══██╗██╔══██║██║╚██╗██║');
		console.log('███████║██║   ██║   ██║  ██║██║  ██║██║ ╚████║');
		console.log('╚══════╝╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝');
		console.log(`app corriendo en el puerto: ${PORT}`);
		console.log('');
	});
});
