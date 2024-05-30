import { DateTime } from 'luxon';

interface select {
	key: string;
	query: string;
}

export const selects: select[] = [
	{ key: 'AFILIADO', query: 'aboCodAfi as AFILIADO' },
	{ key: 'TERMINAL', query: `aboterminal TERMINAL` },
	{ key: 'LOTE', query: `hisLote as Lote` },
	{ key: 'MONTO_TOTAL', query: `hisAmountTotal ` },
	{ key: 'FECHA_EJECUCION', query: `hisFechaEjecucion` },
	{ key: 'COD_BANCO_ORIGINAL', query: `aboCodBancoOrig` },
	{ key: 'COD_BANCO_ORIGINAL', query: `aboCodBancoOrig` },
	{ key: 'NRO_CUENTA_ORIGINAL', query: `aboNroCuentaOrig` },
	{ key: 'RIF_ORIGINAL', query: `comerRifOrig` },
	{ key: 'COD_BANCO', query: `comerCodigoBanco` },
	{ key: 'CUENTA_BANCO', query: `comerCuentaBanco` },
	{ key: 'RIF_BANCO', query: `comerCuentaBanco` },
];

export const dateRang = (init: string, end: string): any => {
	return { init: DateTime.fromFormat(init, 'YYYY-MM-DD'), end: DateTime.fromFormat(end, 'YYYY-MM-DD') };
};

export const FormatQueryAgregadorXBanco = (dateRang: any): string => {
	const { init } = dateRang;
	return /* sql */ `EXEC SP_consultaCuentaOrgAbono '${init}'`;
};
