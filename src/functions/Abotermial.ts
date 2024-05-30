import { DateTime } from 'luxon';

interface select {
	key: string;
	query: string;
}

export const selects: select[] = [
	{ key: 'TERMINAL', query: `aboterminal TERMINAL` },
	{ key: 'AFILIADO',query: 'aboCodAfi as AFILIADO'},
	{ key: 'MONTOTOTAL', query: `montoTotal MONTOTOTAL` },
	{ key: 'FECHPROCESO', query: `fechaProceso FECHPROCESO` },
	{ key: 'ESTATUS', query: `descripcion ESTATUS` },
];

export const selectQuery = (keys: string[]) => {
	return selects
		.filter((select): boolean => keys.includes(select.key))
		.map((select) => select.query)
		.join(', ');
};

export const dateRang = (init: string, end: string): string => {
	// use luxon js to format the date in format YYYY-MM-DD
	const initDate = DateTime.fromFormat(init, 'YYYY-MM-DD');
	const endDate = DateTime.fromFormat(end, 'YYYY-MM-DD');

	return /* sql */ ` WHERE  hisFechaEjecucion BETWEEN '${initDate}' AND  '${endDate}'`;
};

export const FormatQuery = (selects: string): string => {
	const today: string = DateTime.local().toFormat('yyyy-MM-dd');

	return /* sql */ /*sql*/ `
    select ${selects}
    from PlanCuota
	left outer join Estatus as e ON estatusId = e.id
	where estatusId in ('25','26') and fechaProceso <='${today} 00:00:00.000'
    `;
};
