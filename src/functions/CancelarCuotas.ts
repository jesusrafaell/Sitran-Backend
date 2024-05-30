import { DateTime } from 'luxon';

interface select {
	key: string;
	query: string;
}

export const selects: select[] = [
	{ key: 'FECHPROCESO', query: 'fechaProceso FECHPROCESO' },
	{ key: 'AFILIADO', query: 'aboCodAfi as AFILIADO' },
	{ key: 'MONTOTOTAL', query: `montoTotal as MONTOTOTAL` },
	{
		key: 'IVA',
		query: `
	        (MONTOTOTAL *
	            ((SELECT valor FROM [MilPagos].[dbo].[Parametros] WHERE id = 13)) * 0.01
	        ) as IVA`,
	},
	// {
	// 	key: 'MONTOCOMISION',
	// 	query: `
	//         (montoTotal *
	//             ((SELECT valor FROM [MilPagos].[dbo].[Parametros] WHERE id = 13)) * 0.01
	//         ) as IVA,

	//         ((montoTotal)* (SELECT * FROM OPENQUERY([POSTILION_7019], 'SELECT TOP 1 valorVenta
	//         FROM (
	//           SELECT TOP 2 valorVenta
	//           FROM [rep_post_dia].[dbo].[tasas_dicom]

	//           ORDER BY id DESC
	//         ) sub
	//         ORDER BY valorVenta desc'))) as MONTOCOMISION`,
	// },
	// {
	// 	key: 'MONTOIVA',
	// 	query: `
	//         (
	// 	    	((montoTotal)* (SELECT * FROM OPENQUERY([POSTILION_7019], 'SELECT TOP 1 valorVenta
	// 	    		FROM (
	// 	    		  SELECT TOP 2 valorVenta
	// 	    		  FROM [rep_post_dia].[dbo].[tasas_dicom]

	// 	    		  ORDER BY id DESC
	// 	    		) sub
	// 	    		ORDER BY valorVenta desc')))

	// 	    * (montoTotal * ((SELECT valor FROM [MilPagos].[dbo].[Parametros] WHERE id = 13)) * 0.01))
	// 	     as MONTOIVA
	//     `,
	// },
	{
		key: 'ESTATUS',
		query: `descripcion ESTATUS`,
	},
];

export const selectQuery = (keys: string[]) => {
	return selects.map((select) => select.query).join(', ');
};

export const dateRang = (init: string, end: string): string => {
	// use luxon js to format the date in format YYYY-MM-DD
	const initDate = DateTime.fromFormat(init, 'YYYY-MM-DD');
	const endDate = DateTime.fromFormat(end, 'YYYY-MM-DD');

	return /* sql */ ` WHERE  hisFechaEjecucion BETWEEN '${initDate}' AND  '${endDate}'`;
};

export const FormatQuery = (selects: string, id: any): string => {
	const today: string = DateTime.local().toFormat('yyyy-MM-dd');

	return /* sql */ /*sql*/ `
    select ${selects}
    
    from PlanCuota
	left outer join Estatus as e ON estatusId = e.id
	where estatusId in ('25','26') and aboterminal = '${id}'
    `;
};
