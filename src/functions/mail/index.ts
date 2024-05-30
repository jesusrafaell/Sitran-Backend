import { config } from 'dotenv';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
config();

const { MAIL_USER, MAIL_PASS, MAIL_HOST, MAIL_PORT } = process.env;

export const transporter = nodemailer.createTransport({
	pool: true,
	host: MAIL_HOST,
	port: MAIL_PORT, //25
	secure: false, // use TLS
	secureConnection: false,
	auth: {
		// type: 'LOGIN',
		user: MAIL_USER,
		pass: MAIL_PASS,
	},
});

transporter.use(
	'compile',
	hbs({
		viewEngine: 'express-handlebars',
		viewPath: './views/',
	})
);

export const mailConnection = async () => {
	try {
		await transporter.verify().then(() => {
			console.log('Email Service ✅');
		});
	} catch (error) {
		console.log(error);
		throw new Error('Error al iniciar el Email Service');
	}
};
