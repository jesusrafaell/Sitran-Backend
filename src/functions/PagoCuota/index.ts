import { DateTime } from 'luxon';

interface select {
	key: string;
	query: string;
}

export const transQuery: string = /*sql*/ ``;

export const selects: select[] = [
	{
		key: 'TERMINAL',
		query: `a.aboterminal as TERMINAL`,
	},
	{
		key: 'COMERCIO',
		query: `c.comerDesc as COMERCIO`,
	},
	{
		key: 'CANTIDAD_PAGADAS',
		query: `COUNT(CASE a.estatusId  WHEN '27' THEN 'cuota' END) as CANTIDAD_PAGADAS`,
	},
	{
		key: 'MONTO_PAGADO',
		query: `sum(a.montoComision + a.montoIVA) as MONTO_PAGADO`,
	},
	{
		key: 'FECHA_PAGO',
		query: 'a.fechaPago as FECHA_PAGO',
	},
	{
		key: 'TASA',
		query: 'a.tasaValor TASA',
	},
];

const preQuery = (init, end) => /*sql*/ ``;

export const selectQuery = (keys: string[]) => {
	return selects
		.filter((select): boolean => keys.includes(select.key))
		.map((select) => select.query)
		.join(', ');
};

export const dateRang = (init: string, end: string): any => {
	return { init: DateTime.fromFormat(init, 'YYYY-MM-DD'), end: DateTime.fromFormat(end, 'YYYY-MM-DD') };
};

export const FormatQuery = (dateRang: any): string => {
	const { init, end } = dateRang;

	return /* sql */ `
	select  a.aboterminal as TERMINAL, c.comerDesc as COMERCIO,  COUNT(CASE a.estatusId  WHEN '27' THEN 'cuota' END) as CANTIDAD_PAGADAS, 
	REPLACE(sum(a.montoComision + a.montoIVA),'.',',') as MONTO_PAGADO, left(a.fechaPago, 11) AS FECHA_PAGO,
	left(a.tasaValor,5) as TASA
	from PlanCuota as a 
	join Abonos b on b.aboTerminal=a.aboTerminal
	join comercios  c on c.comerCod=b.abocodcomercio
	where a.estatusId='27' AND a.fechaProcesoLoteCerrado IS NULL 
	and a.fechaPago between '${init}' and '${end}'
	GROUP BY a.aboTerminal, c.comerDesc,a.estatusId, a.tasaValor, a.montoComision + a.montoIVA, a.fechaPago 
	ORDER BY 6 
`;
};
