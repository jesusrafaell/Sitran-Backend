import { DateTime } from 'luxon';
require('dotenv').config();

const { NODE_ENV } = process.env;

interface select {
	key: string;
	query: string;
}

/*
aboterminal as TERMINAL,
aboCodAfi as AFILIADO, 
Sum(montoTotal) as MONTOTOTAL,
COUNT(aboterminal) as CANT_CUOTAS,
descripcion as ESTATUS
*/

export const selects: select[] = [
	{ key: 'TERMINAL', query: `aboterminal as TERMINAL` },
	{ key: 'AFILIADO', query: `aboCodAfi as N_AFILIADO` },
	{ key: 'MONTO', query: `Format(Sum(montoTotal) , 'N2', 'es-es') as MONTO` },
	{ key: 'IVA', query: `Format((Sum(montoTotal) * 0.16) , 'N2', 'es-es') as IVA` },
	{ key: 'MONTOTOTAL', query: `Format((Sum(montoTotal) * 1.16) , 'N2', 'es-es') as MONTOTOTAL` },
	{
		key: 'MONTOTOTAL_BS',
		query: `
		Format(((Sum(montoTotal) * 1.16) * (SELECT * FROM OPENQUERY([${
			NODE_ENV === 'prod' ? 'POSTILION_7019' : 'POSTILION_DESA'
		}], 'SELECT TOP 1 valorVenta
			FROM (
			SELECT TOP 2 valorVenta 
			FROM [rep_post_dia].[dbo].[tasas_dicom]
			
			ORDER BY id DESC
			) sub
			ORDER BY valorVenta desc'))) , 'N2', 'es-es')  as MONTOTOTAL_BS
        `,
	},
	{ key: 'CANT_CUOTAS', query: `COUNT(aboterminal) as CANT_CUOTAS` },
	{
		key: 'ESTATUS',
		query: `'VENCIDA' as ESTATUS`,
	},
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

	return /*sql*/ `
    select ${selects}
	from PlanCuota
    where estatusId in ('25','26') and fechaProceso <= GETDATE()
	group by aboTerminal, aboCodAfi, tasaValor

    order by TERMINAL

    `;
};
