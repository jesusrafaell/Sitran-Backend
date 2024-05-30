import { DataSource } from 'typeorm';
import Bancos from '../../db/agregadores/models/Bancos';
import { isValid } from '../../functions/validAcoountBank';

export async function validAccountNumber(
	comerCuentaBanco: string,
	DS: DataSource
): Promise<{ ok: boolean; message: string }> {
	try {
		const aboCodBanco = comerCuentaBanco.slice(0, 4);

		const validBank = await DS.getRepository(Bancos).findOne({
			where: { banCodBan: aboCodBanco },
		});

		if (!validBank) {
			console.log(`Code Bank invalid [${aboCodBanco}]`);
			return {
				ok: false,
				message: `Code Bank invalid [${aboCodBanco}]`,
			};
		}

		if (!isValid(comerCuentaBanco)) {
			console.log(`Codigo de Control Invalido "${comerCuentaBanco}", banco: "${validBank.banDescBan}"`);
			return {
				ok: false,
				message: `Codigo de Control Invalido "${comerCuentaBanco}", banco: "${validBank.banDescBan}"`,
			};
		}
		return {
			ok: true,
			message: validBank.banDescBan,
		};
	} catch (err) {
		return {
			ok: false,
			message: err.message,
		};
	}
}
