require('dotenv').config();

const { NODE_ENV } = process.env;

interface select {
	key: string;
	query: string;
}

export const selects: select[] = [
	{ key: 'ACINOMBRES', query: `aci_nombre AS ACINOMBRES` },
	{ key: 'CLIENTNOMBRES', query: `cli_nombre AS CLIENTNOMBRES` },
	{ key: 'DIRECCION', query: `direccion AS DIRECCION` },
	{ key: 'NUMEROS', query: `numeros AS NUMEROS ` },
	{ key: 'TERMINAL', query: `aboTerminal AS TERMINAL` },
	{ key: 'AFILIADO', query: `afiliado AS AFILIADO` },
	{ key: 'MONTO', query: `monto AS MONTO` },
	{ key: 'IVA', query: `iva AS IVA` },
	{ key: 'MONTOTOTAL', query: `mont_total AS MONTOTOTAL` },
	{ key: 'ESTATUS', query: `estatus AS ESTATUS` },
	{ key: 'MONTOTOTAL_BS', query: `monto_total_bs AS MONTOTOTAL_BS` },
	{ key: 'CANT_CUOTAS', query: `CANT_TRANSACCION AS CANT_CUOTAS` },
];

// const preQuery = () => /*sql*/ `
// 	DELETE FROM [dbo].[Temp_ReportACIs]

// 	INSERT INTO Temp_ReportACIs

// select
// CONCAT(d.aliNombres,' ' ,d.aliApellidos ) AS ACINOMBRES,
// c.comerDesc AS CLIENTNOMBRES,
// c.comerDireccion as direccion,
// CONCAT(m.contTelefLoc,' - ' ,m.contTelefMov ) AS numero,
// aboterminal as TERMINAL,
// aboCodAfi as AFILIADO,
// Format(Sum(montoTotal) , 'N2', 'es-es') as MONTO,
// Format((Sum(montoTotal) * 0.16) , 'N2', 'es-es') as IVA,
// Format((Sum(montoTotal) * 1.16) , 'N2', 'es-es') as MONTOTOTAL ,
// descripcion as ESTATUS,
// Format(((Sum(montoTotal) * 1.16) * (SELECT * FROM OPENQUERY([${
// 	NODE_ENV === 'prod' ? 'POSTILION_7019' : 'POSTILION_DESA'
// }], 'SELECT TOP 1 valorVenta
// FROM (
//   SELECT TOP 2 valorVenta
//   FROM [rep_post_dia].[dbo].[tasas_dicom]

//   ORDER BY id DESC
// ) sub
// ORDER BY valorVenta desc'))) , 'N2', 'es-es')  as MONTOTOTAL_BS,

// COUNT(aboterminal) as CANT_CUOTAS

//     from PlanCuota (NOLOCK)
//                 left outer join Estatus as e ON estatusId = e.id
//                              INNER JOIN Comercios AS c ON aboCodComercio = c.comerCod
//                              LEFT OUTER JOIN  Aliados AS d ON c.comerCodAliado = d.id
// 							 left outer join Contactos as m on c.comerCod = m.contCodComer
//                              --INNER JOIN Abonos AS b ON aboTerminal = b.aboTerminal

//                 where estatusId in ('25','26') and fechaProceso <= GETDATE()
// group by aboTerminal, aboCodAfi, descripcion, tasaValor, aliNombres, aliApellidos, comerDesc, contTelefLoc, contTelefMov, comerDireccion

// order by ACINOMBRES
// `;

// export const selectQuery = (keys: string[]) => {
// 	return selects
// 		.filter((select): boolean => keys.includes(select.key))
// 		.map((select) => select.query)
// 		.join(', ');
// };

// export const dateRang = (init: string, end: string): string => {
// 	// use luxon js to format the date in format YYYY-MM-DD
// 	const initDate = DateTime.fromFormat(init, 'YYYY-MM-DD');
// 	const endDate = DateTime.fromFormat(end, 'YYYY-MM-DD');

// 	return /* sql */ ` WHERE  hisFechaEjecucion BETWEEN '${initDate}' AND  '${endDate}'`;
// };

// export const FormatQuery = (selects: string): string => {
// 	const today: string = DateTime.local().toFormat('yyyy-MM-dd');

// 	return /*sql*/ `
// 	${preQuery()}

// 	Select ${selects} FROM [dbo].[Temp_ReportACIs]  (NOLOCK)

//     UNION ALL

// 	SELECT [aci_nombre]
// 	,'CLIENTES'
// 	,'Direccion'
// 	,'Telefono'
// 	,'Terminales'
// 	,'Afiliados'
// 	,Format((SUM(cast(convert(float,REPLACE(REPLACE(monto, '.', ''), ',', '.')) as decimal(15,2)))) , 'N2', 'es-es')  as Monto
// 	,Format((SUM(cast(convert(float,REPLACE(REPLACE(iva, '.', ''), ',', '.')) as decimal(15,2)))) , 'N2', 'es-es')  as Iva
// 	   ,Format((SUM(cast(convert(float,REPLACE(REPLACE(mont_total, '.', ''), ',', '.')) as decimal(15,2)))) , 'N2', 'es-es')  as MontoTotal
// 	   ,'Estatus'
// 		,Format((SUM(cast(convert(float,REPLACE(REPLACE(monto_total_bs, '.', ''), ',', '.')) as decimal(15,2)))) , 'N2', 'es-es')  as  MontoTotal_BS
// 	   ,(SUM(convert(int,(CANT_TRANSACCION) )))  as CantTotal

// FROM [dbo].[Temp_ReportACIs] (NOLOCK)

// GROUP BY
// 	 aci_nombre

// Order by aci_nombre, aboTerminal desc
// 	`;
// 	// select ${selects} from PlanCuota left outer join Estatus as e ON estatusId = e.id INNER JOIN Comercios AS c ON aboCodComercio = c.comerCod LEFT OUTER JOIN  Aliados AS d ON c.comerCodAliado = d.id
// 	// where estatusId in ('25','26') and fechaProceso <= GETDATE()
// 	// group by aboTerminal, aboCodAfi, descripcion, tasaValor, aliNombres, aliApellidos, comerDesc

// 	// order by ACINOMBRES
// 	// `;
// };

export const FormatQuerySP = (): string => {
	return /*sql*/ `[dbo].sp_reporte_x_ACI`;
};
