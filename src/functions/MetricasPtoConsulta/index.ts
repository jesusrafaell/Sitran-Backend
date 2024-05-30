import { DateTime } from 'luxon';

interface select {
	key: string;
	query: string;
}

export const selects: select[] = [
	{ key: 'Login_Usuario', query: 'aboCodAfi as AFILIADO' },
	{ key: 'loteCerradoTotal', query: `aboterminal TERMINAL` },
	{ key: 'movimientos', query: `hisLote as Lote` },
	{ key: 'NewPass', query: `hisAmountTotal ` },
	{ key: 'Estado_de_cuenta_pdf', query: `hisFechaEjecucion` },
	{ key: 'Estado_de_cuenta_excel', query: `aboCodBancoOrig` },
	{ key: 'Registro', query: `aboCodBancoOrig` },
	{ key: 'Plan', query: `aboNroCuentaOrig` },
];

export const dateRang = (init: string, end: string): any => {
	return { init: DateTime.fromFormat(init, 'YYYY-MM-DD'), end: DateTime.fromFormat(end, 'YYYY-MM-DD') };
};

export const FormatQueryMetricas = (dateRang: any): string => {
	const { init, end } = dateRang;
	return /* sql */ `EXEC SP_metricasPC '${init}', '${end}'`;
};
