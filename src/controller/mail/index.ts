import { config } from 'dotenv';
import { transporter } from '../../functions/mail';
config();

const { MAIL_BUZON, MAIL_FROM } = process.env;

//Email parametros {lotelength: cantidad de registros en total, fecha: iso, nombre del archivo: req.body.nameFile  }
type from =
	| 'cargaContracargo'
	| 'execContracargo'
	| 'successContracargo'
	| 'errorContracargo'
	| 'archivoAbonoClientes';
interface IContracargoPayload {
	cantRegistros?: number;
	fecha: string;
	hora: string;
	fileName?: string;
	attachments?: IAttachchment[];
}

interface IAttachchment {
	path: string; // Pasar la ruta del archivo a adjuntar
}

export const getmail = async (
	to: string,
	subject: string,
	agregador: string,
	from: from,
	payload: IContracargoPayload
) => {
	const fromMail = `no-reply@1000pagos.com`;
	const { cantRegistros, fecha, hora, fileName, attachments } = payload;
	let mailProps;
	mailProps = {
		from: MAIL_FROM ? MAIL_FROM : fromMail, // TODO: email sender
		to: to, // TODO: email receiver
		subject: subject,
		template: from,
		attachments,
		context: {
			agregador,
			subject,
			cantRegistros,
			fecha,
			hora,
			fileName,
		},
	};
	try {
		// Step 1
		const info = await transporter.sendMail(mailProps);

		console.log(`correo enviado a ${info.envelope?.to?.join(',')}`);

		return true;
	} catch (err) {
		console.log('error al enviar correo', err);
		return false;
	}
};
