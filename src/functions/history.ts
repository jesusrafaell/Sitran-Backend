import { DateTime } from 'luxon';

interface select {
	key: string;
	query: string;
}

export const transQuery: string = /*sql*/ `
(select aboTerminal,

hisFechaEjecucion,

(select

count from  LoteCerradoDetalle

   where aboTerminal = Historico.aboTerminal and hisFechaEjecucion = Historico.hisFechaEjecucion

) as [TRANSACCION]

 

from [dbo].[Historico] with (NOLOCK)

 

where hisFechaEjecucion BETWEEN @StartDate AND @EndDate -- and aboTerminal = '59019075'

GROUP BY hisFechaEjecucion, aboTerminal,hisFechaProceso) order by hisFechaEjecucion asc`;

export const selects: select[] = [
	{
		key: 'N_AFILIADO',
		query: `CONCAT('A-',[N_AFILIADO] ) as [N_AFILIADO]`,
	},
	{
		key: 'SPONSOR_BANK',
		query: `SPONSOR_BANK`,
	},
	{
		key: 'TERMINAL',
		query: `CONCAT('T-',TERMINAL ) as TERMINAL`,
	},
	{
		key: 'CEDULA_RIF',
		query: '[CEDULA_RIF]',
	},
	{
		key: 'COMERCIO',
		query: 'COMERCIO',
	},
	{
		key: 'DIRECCION',
		query: 'DIRECCION',
	},
	{
		key: 'COD_COMERCIO',
		query: '[COD_COMERCIO]',
	},
	{
		key: 'N_CUENTA',
		query: `CONCAT('C-',[N_CUENTA] ) as [N_CUENTA]`,
	},
	{
		key: 'FECHA_PROCESO',
		query: 'FechaPreceso',
	},
	{
		key: 'FECHA',
		query: 'FechaEjec',
	},
	{
		key: 'LOTE',
		query: '[LOTE]',
	},
	{
		key: 'MONTO_BRUTO_TDD',
		query: `Format(MontoBrutoTDD , 'N2', 'es-es') as MontoBrutoTDD`,
	},
	{
		key: 'MONTO_BRUTO_TDC',
		query: `Format(MontoBrutoTDC , 'N2', 'es-es') as MONTO_BRUTO_TDC`,
	},
	{
		key: 'MONTO_BRUTO_VISA_ELEC',
		query: `Format(MontoBrutoVisaElectro , 'N2', 'es-es') as MONTO_BRUTO_VISA_ELEC`,
	},
	{
		key: 'TOTAL_MONTOS_BRUTOS',
		query: `Format((MontoBrutoTDD + MontoBrutoTDC + MontoBrutoVisaElectro) , 'N2', 'es-es') as TOTAL_MONTOS_BRUTOS`,
	},
	{
		key: 'COMISION_AFILIADO_TDD',
		query: `CASE
					WHEN SUM(MontoBrutoTDD) <> 0.00 THEN 
						Format(( sum(monto_comision_tdd) - (SUM(MontoBrutoVisaElectro) * 0.02) ) , 'N2', 'es-es')
					ELSE Format(0 , 'N2', 'es-es')
				END as [COMISION_AFILIA_TDD]`,
	},
	{
		key: 'COMISION_AFILIADO_TDC',
		query: `case 
					when (SUM(MontoBrutoTDD) <> 0.00 and SUM(MontoBrutoTDC) = 0.00 and SUM(MontoBrutoVisaElectro) = 0.00  ) 
						then
							Format(0 , 'N2', 'es-es')
					when (SUM(MontoBrutoTDC) <> 0 and SUM(MontoBrutoVisaElectro) = 0.00) 
						then
							Format(Monto_afilia_tdc , 'N2', 'es-es') 
					when ( SUM(MontoBrutoVisaElectro) <> 0  )
							then
								Format(Monto_afilia_tdc , 'N2', 'es-es') 
					else Format(0 , 'N2', 'es-es')
				end  as COMISION_AFILIA_TDC`,
	},
	{
		key: 'COMISION_AFILIADO_VISA_ELECTRO',
		query: `CASE
					WHEN ( SUM(MontoBrutoVisaElectro) <> 0  ) 
						THEN 
							Format((MontoBrutoVisaElectro * 0.02) , 'N2', 'es-es') 
					ELSE Format(0 , 'N2', 'es-es')
				END as COMISION_AFILIA_VISA_ELEC`,
	},
	{
		key: 'MONTO_NETO_TDD',
		query: `Format(Monto_Neto_tdd , 'N2', 'es-es') as MONTO_NETO_TDD`,
	},
	{
		key: 'MONTO_NETO_TDC',
		query: `case 
					when (SUM(MontoBrutoTDD) <> 0.00 and SUM(MontoBrutoTDC) = 0.00 and SUM(MontoBrutoVisaElectro) = 0.00  )
						then
							Format(0 , 'N2', 'es-es')
					when ( SUM(MontoBrutoTDC) = 0.00 and SUM(MontoBrutoVisaElectro) = 0.00  )
						then
							Format(0 , 'N2', 'es-es')
					when ( SUM(MontoBrutoTDC) = 0.00 and SUM(MontoBrutoVisaElectro) <> 0.00  )
						then
							Format(0 , 'N2', 'es-es')
					when (SUM(MontoBrutoTDC) <> 0 and SUM(MontoBrutoVisaElectro) = 0.00)
						then
							Format(Monto_neto_tdc, 'N2', 'es-es') 
					when ( SUM(MontoBrutoTDC) <> 0 and  SUM(MontoBrutoVisaElectro) <> 0.00  ) 
						then
							Format( (SUM(Monto_neto_tdc) -  (SUM(MontoBrutoVisaElectro) - SUM(MontoBrutoVisaElectro) * 0.02)    ), 'N2', 'es-es')
					else Format(0 , 'N2', 'es-es')
				end  as MONTO_NETO_TDC`,
	},
	{
		key: 'MONTO_NETO_VISA_ELECTRO',
		query: `Format(( MontoBrutoVisaElectro - (SUM(MontoBrutoVisaElectro) * 0.02)), 'N2', 'es-es') as MONTO_NETO_VISA_ELEC`,
	},
	{
		key: 'COMISION_MANTENIMIENTO',
		query: `Format([COMISION_MANTENIMIENTO], 'N2', 'es-es') as [COMISION_MANTENIMIENTO]`,
	},
	{
		key: 'IVA',
		query: `Format([IVA], 'N2', 'es-es') as [IVA]`,
	},
	{
		key: 'COMISION_BANCARIA_1_60_USO',
		query: `Format([COMISION_BANCARIA_1_50_USO], 'N2', 'es-es') as [COMISION_BANCARIA_1_50_USO]`,
	},
	{
		key: 'DESCUENTO_CONTRACARGO',
		query: `Format(Contracargo, 'N2', 'es-es') as [DESCUENTO_CONTRACARGO]`,
	},
	{
		key: 'MONTO_ABONAR',
		query: `Format([MONTO_ABONAR], 'N2', 'es-es') as [MONTO_ABONAR]`,
	},
	{ key: 'TASA', query: `Format(CONVERT(float, [TASA]), 'N4', 'es-es') as [TASA]` },
	{ key: 'CANT_TRANSACCION', query: '[CANT_TRANSACCION]' },
	{ key: 'TIPO_DE_CARTERA', query: '[TIPO_DE_CARTERA]' },
	{
		key: 'NOMBRE_ACI',
		query: 'NOMBRES',
	},
	{
		key: 'APELLIDOS_ACI',
		query: 'APELLIDOS',
	},
];

export const selectsCP: select[] = [
	{
		key: 'N_AFILIADO',
		query: `CONCAT('A-',[N_AFILIADO] ) as [N_AFILIADO]`,
	},
	{
		key: 'TERMINAL',
		query: `CONCAT('T-',TERMINAL ) as TERMINAL`,
	},
	{
		key: 'CEDULA_RIF',
		query: '[CEDULA_RIF]',
	},
	{
		key: 'COMERCIO',
		query: 'COMERCIO',
	},
	{
		key: 'DIRECCION',
		query: 'DIRECCION',
	},
	{
		key: 'COD_COMERCIO',
		query: '[COD_COMERCIO]',
	},
	{
		key: 'N_CUENTA',
		query: `CONCAT('C-',[N_CUENTA] ) as [N_CUENTA]`,
	},
	{
		key: 'FECHA_PROCESO',
		query: 'FechaPreceso',
	},
	{
		key: 'FECHA',
		query: 'FechaEjec',
	},
	{
		key: 'LOTE',
		query: '[LOTE]',
	},
	{
		key: 'MONTO_BRUTO_TDD',
		query: `Format(MontoBrutoTDD , 'N2', 'es-es') as MontoBrutoTDD`,
	},
	{
		key: 'MONTO_BRUTO_TDC',
		query: `Format(MontoBrutoTDC , 'N2', 'es-es') as MONTO_BRUTO_TDC`,
	},
	{
		key: 'MONTO_BRUTO_VISA_ELEC',
		query: `Format(MontoBrutoVisaElectro , 'N2', 'es-es') as MONTO_BRUTO_VISA_ELEC`,
	},
	{
		key: 'TOTAL_MONTOS_BRUTOS',
		query: `Format((MontoBrutoTDD + MontoBrutoTDC + MontoBrutoVisaElectro) , 'N2', 'es-es') as TOTAL_MONTOS_BRUTOS`,
	},
	{
		key: 'COMISION_AFILIADO_TDD',
		query: `CASE
					WHEN SUM(MontoBrutoTDD) <> 0.00 THEN 
						Format(( sum(monto_comision_tdd) - (SUM(MontoBrutoVisaElectro) * 0.02) ) , 'N2', 'es-es')
					ELSE Format(0 , 'N2', 'es-es')
				END as [COMISION_AFILIA_TDD]`,
	},
	{
		key: 'COMISION_AFILIADO_TDC',
		query: `case 
					when (SUM(MontoBrutoTDD) <> 0.00 and SUM(MontoBrutoTDC) = 0.00 and SUM(MontoBrutoVisaElectro) = 0.00  ) 
						then
							Format(0 , 'N2', 'es-es')
					when (SUM(MontoBrutoTDC) <> 0 and SUM(MontoBrutoVisaElectro) = 0.00) 
						then
							Format(Monto_afilia_tdc , 'N2', 'es-es') 
					when ( SUM(MontoBrutoVisaElectro) <> 0  )
							then
								Format(Monto_afilia_tdc , 'N2', 'es-es') 
					else Format(0 , 'N2', 'es-es')
				end  as COMISION_AFILIA_TDC`,
	},
	{
		key: 'COMISION_AFILIADO_VISA_ELECTRO',
		query: `CASE
					WHEN ( SUM(MontoBrutoVisaElectro) <> 0  )
						THEN
							Format((MontoBrutoVisaElectro * 0.02) , 'N2', 'es-es')
					ELSE Format(0 , 'N2', 'es-es')
				END as COMISION_AFILIA_VISA_ELEC`,
	},
	{
		key: 'MONTO_NETO_TDD',
		query: `Format(Monto_Neto_tdd , 'N2', 'es-es') as MONTO_NETO_TDD`,
	},
	{
		key: 'MONTO_NETO_TDC',
		query: `case 
					when (SUM(MontoBrutoTDD) <> 0.00 and SUM(MontoBrutoTDC) = 0.00 and SUM(MontoBrutoVisaElectro) = 0.00  )
						then
							Format(0 , 'N2', 'es-es')
					when ( SUM(MontoBrutoTDC) = 0.00 and SUM(MontoBrutoVisaElectro) = 0.00  )
						then
							Format(0 , 'N2', 'es-es')
					when ( SUM(MontoBrutoTDC) = 0.00 and SUM(MontoBrutoVisaElectro) <> 0.00  )
						then
							Format(0 , 'N2', 'es-es')
					when (SUM(MontoBrutoTDC) <> 0 and SUM(MontoBrutoVisaElectro) = 0.00)
						then
							Format(Monto_neto_tdc, 'N2', 'es-es') 
					when ( SUM(MontoBrutoTDC) <> 0 and  SUM(MontoBrutoVisaElectro) <> 0.00  ) 
						then
							Format( (SUM(Monto_neto_tdc) -  (SUM(MontoBrutoVisaElectro) - SUM(MontoBrutoVisaElectro) * 0.02)    ), 'N2', 'es-es')
					else Format(0 , 'N2', 'es-es')
				end  as MONTO_NETO_TDC`,
	},
	{
		key: 'MONTO_NETO_VISA_ELECTRO',
		query: `Format(( MontoBrutoVisaElectro - (SUM(MontoBrutoVisaElectro) * 0.02)), 'N2', 'es-es') as MONTO_NETO_VISA_ELEC`,
	},
	{
		key: 'COMISION_MANTENIMIENTO',
		query: `Format([COMISION_MANTENIMIENTO], 'N2', 'es-es') as [COMISION_MANTENIMIENTO]`,
	},
	{
		key: 'IVA',
		query: `Format([IVA], 'N2', 'es-es') as [IVA]`,
	},
	{
		key: 'COMISION_BANCARIA_1_50_USO',
		query: `Format([COMISION_BANCARIA_1_50_USO], 'N2', 'es-es') as [COMISION_BANCARIA_1_50_USO]`,
	},
	{
		key: 'MONTO_ABONAR',
		query: `Format([MONTO_ABONAR], 'N2', 'es-es') as [MONTO_ABONAR]`,
	},
	{ key: 'TASA', query: `Format(CONVERT(float, [TASA]), 'N4', 'es-es') as [TASA]` },
	{ key: 'CANT_TRANSACCION', query: '[CANT_TRANSACCION]' },
	{ key: 'TIPO_DE_CARTERA', query: '[TIPO_DE_CARTERA]' },
	{
		key: 'NOMBRE_ACI',
		query: 'NOMBRES',
	},
	{
		key: 'APELLIDOS_ACI',
		query: 'APELLIDOS',
	},
];

const preQuery = (init, end) => /*sql*/ `


DELETE FROM [dbo].[Temp_CerradoDetalle]


INSERT INTO Temp_CerradoDetalle

 SELECT

      [aboTerminal]

      ,[hisLote]

      ,case when hisOrigen = 'Debito' then

         (SUM(cast(convert(float,REPLACE(REPLACE(hisMonto, '.', ''), ',', '.')) as decimal(15,2)))) else 0 end  as mont_bruto_tdd

         ,case when hisOrigen = 'Visa' or hisOrigen = 'Master' then

         (SUM(cast(convert(float,REPLACE(REPLACE(hisMonto, '.', ''), ',', '.')) as decimal(15,2)))) else 0 end  as mont_bruto_tdc

         ,case when hisOrigen = 'ViD?b' or hisOrigen = 'ViDéb' then

         (SUM(cast(convert(float,REPLACE(REPLACE(hisMonto, '.', ''), ',', '.')) as decimal(15,2)))) else 0 end as mont_bruto_tdc_visa_ele

         ,case when hisOrigen = 'ViD?b' or hisOrigen = 'ViDéb' then

         (SUM(cast(convert(float,REPLACE(REPLACE(hisMonto, '.', ''), ',', '.')) as decimal(15,2))) * 0.02) else 0 end as mont_comision_tdc_visa_ele

         ,[hisTasaBCV]

      ,[hisFechaEjecucion]

         ,hisFechaProceso

         ,count(hisOrigen) as CANT_TRANSACCION

  FROM [dbo].[LoteCerradoDetalle] (NOLOCK)

 

 

  where hisFechaEjecucion between '${init}' and '${end}'

 

  Group by [aboTerminal]

      ,[hisLote]

      ,[hisTasaBCV]

      ,[hisFechaEjecucion]

         ,[hisOrigen]

         ,hisFechaProceso

 

order by aboTerminal asc
`;

const preQueryCP = (init, end) => /*sql*/ `


DELETE FROM [dbo].[Temp_CerradoDetalle]


INSERT INTO Temp_CerradoDetalle

 SELECT

      [aboTerminal]

      ,[hisLote]

      ,case when hisOrigen = 'Debito' then

         (SUM(cast(convert(float,REPLACE(REPLACE(hisMonto, '.', ''), ',', '.')) as decimal(15,2)))) else 0 end  as mont_bruto_tdd

         ,case when hisOrigen = 'Visa' or hisOrigen = 'Master' then

         (SUM(cast(convert(float,REPLACE(REPLACE(hisMonto, '.', ''), ',', '.')) as decimal(15,2)))) else 0 end  as mont_bruto_tdc

         ,case when hisOrigen = 'ViD?b' or hisOrigen = 'ViDéb' then

         (SUM(cast(convert(float,REPLACE(REPLACE(hisMonto, '.', ''), ',', '.')) as decimal(15,2)))) else 0 end as mont_bruto_tdc_visa_ele

         ,case when hisOrigen = 'ViD?b' or hisOrigen = 'ViDéb' then

         (SUM(cast(convert(float,REPLACE(REPLACE(hisMonto, '.', ''), ',', '.')) as decimal(15,2))) * 0.02) else 0 end as mont_comision_tdc_visa_ele

         ,[hisTasaBCV]

      ,[hisFechaEjecucion]

         ,hisFechaProceso

         ,count(hisOrigen) as CANT_TRANSACCION

  FROM [dbo].[LoteCerradoDetalle] (NOLOCK)

 

 

  where hisFechaEjecucion between '${init}' and '${end}'

 

  Group by [aboTerminal]

      ,[hisLote]

      ,[hisTasaBCV]

      ,[hisFechaEjecucion]

         ,[hisOrigen]

         ,hisFechaProceso

 

order by aboTerminal asc
`;

export const selectQuery = (keys: string[], agr: string) => {
	if (agr === '1')
		return selectsCP
			.filter((select): boolean => keys.includes(select.key))
			.map((select) => select.query)
			.join(', ');
	if (agr === '2')
		return selects
			.filter((select): boolean => keys.includes(select.key))
			.map((select) => select.query)
			.join(', ');
};

export const dateRang = (init: string, end: string): any => {
	return { init: DateTime.fromFormat(init, 'YYYY-MM-DD'), end: DateTime.fromFormat(end, 'YYYY-MM-DD') };
};

export const FormatQuery = (dateRang: any, selects: string, agr: string, sponsor?: number): string => {
	const { init, end } = dateRang;
	// console.log({ init, end });
	if (agr === '1' || agr === '3')
		return /* sql */ `
	${preQueryCP(init, end)}

    select ${selects}

	from (
		Select 
		a.aboCodAfi as [N_AFILIADO],
		a.aboTerminal AS TERMINAL, 	
		d.aliNombres AS NOMBRES,
		d.aliApellidos AS APELLIDOS,
		c.comerRif AS [CEDULA_RIF], 
		c.comerDesc AS COMERCIO, 
		c.comerDireccion AS DIRECCION,
		c.comerCod as [COD_COMERCIO], 
		c.comerCuentaBanco as [N_CUENTA] ,
		a.hisFechaProceso AS FechaPreceso,  
		a.hisFechaEjecucion AS FechaEjec,  
		a.hisLote as [LOTE],
		round(SUM(te.mont_bruto_tdd),2)  as MontoBrutoTDD,
		round(SUM(te.mont_bruto_tdc),2)  as MontoBrutoTDC,
		round(SUM(te.mont_bruto_tdc_visa_ele),2) as MontoBrutoVisaElectro,
		Monto_Neto_tdd as Monto_Neto_tdd,
		round( Monto_neto_tdc, 2) as Monto_neto_tdc,
		round( Monto_afilia_tdc, 2) as Monto_afilia_tdc,
		round(SUM(mont_comision_tdc_visa_ele),2) as mont_comision_tdc_visa_ele,
		a.monto_comision_tdd as monto_comision_tdd,
		a.comision_servicio as [COMISION_MANTENIMIENTO],
		a.comision_bacaria_1_50 as [COMISION_BANCARIA_1_50_USO],
		a.monto_por_servicio as [IVA] ,
		(a.monto_abono) AS [MONTO_ABONAR], 
		te.hisTasaBCV AS [TASA],
		h.Nombre_Org AS [TIPO_DE_CARTERA],
		SUM(te.CANT_TRANSACCION) as CANT_TRANSACCION
	 
	
	FROM
	   	(SELECT 
				hisFechaEjecucion,
	
				hisFechaProceso,
	
				aboTerminal,
	
				aboCodAfi,
	
				hisLote,
	
				(SUM(hisAmountTDD) + SUM(hisAmountTDC)) AS Monto_Neto, 
	
				SUM(hisAmountTDD) as Monto_Neto_tdd,
	
				SUM(hisAmountTDC) as Monto_neto_tdc,
	
				((SUM(hisAmountTDC) + SUM(hisAmountComisionBanco)) - Sum(hisAmountTDCImpuesto)) as montp_neve,

				(SUM(hisAmountTDD) + SUM(hisAmountComisionBanco) - SUM(hisAmountTDCImpuesto)) as monto_bruto_tdd, 

				(SUM(hisAmountTDC) + SUM(hisAmountTDCImpuesto)) as monto_bruto_tdc, 

				(SUM(hisIvaSobreMantenimiento) + SUM(hisComisionMantenimiento) + SUM(hisComisionBancaria)) as comision_mantenimiento,

				SUM(hisComisionMantenimiento) AS comision_servicio, 

				SUM(hisAmountComisionBanco) AS comision_banco, 

				SUM(hisNetoComisionBancaria) AS monto_por_comision, 

				SUM(hisIvaSobreMantenimiento) AS monto_por_servicio, 

				(SUM(hisAmountComisionBanco) - SUM(hisAmountTDCImpuesto)) AS monto_comision_tdd, 

				SUM(hisAmountTotal) AS monto_abono,

				Sum(hisAmountTDCImpuesto) as Monto_afilia_tdc,

				Sum(hisComisionBancaria) as comision_bacaria_1_50
	
	FROM    
	
	 
	
	Historico (NOLOCK)
	
	 
	
	WHERE   hisFechaEjecucion BETWEEN  '${init}' and '${end}' GROUP BY hisFechaEjecucion, aboTerminal,hisFechaProceso,aboCodAfi, hisLote ) AS a INNER JOIN
	
	Abonos AS b ON a.aboTerminal = b.aboTerminal INNER JOIN
	
	Comercios AS c ON b.aboCodComercio = c.comerCod LEFT OUTER JOIN
	
	Aliados AS d ON c.comerCodAliado = d.id LEFT OUTER JOIN
	
	Bancos AS e ON SUBSTRING(b.aboNroCuenta, 1, 4) = e.banCodBan -- LEFT OUTER JOIN
	
	LEFT OUTER JOIN --LoteCerradoDetalle AS f ON a.aboTerminal = f.aboTerminal and a.hisFechaEjecucion = f.hisFechaEjecucion and a.hisLote = f.hisLote  LEFT OUTER JOIN
	
	Cartera_Ter AS g ON a.aboTerminal = Terminal_Id LEFT OUTER JOIN
	
	Cartera AS h ON g.Cod_Cartera = h.Cod_Cartera LEFT OUTER JOIN
	
	Temp_CerradoDetalle as te ON te.aboterminal = a.aboTerminal and a.hisFechaEjecucion = te.hisFechaEjecucion and a.hisLote = te.hisLote
	
	 
	
	Group by  a.aboTerminal, a.hisLote, MONTO_NETO_TDC,Monto_Neto_tdd, Monto_afilia_tdc,a.comision_servicio,
	
	comision_bacaria_1_50, monto_por_servicio, monto_abono, hisTasaBCV, Nombre_Org, a.aboCodAfi, c.comerRif, c.comerDesc, c.comerDireccion, c.comerCod,
	
	comerCuentaBanco, a.hisFechaProceso, a.hisFechaEjecucion, monto_comision_tdd, aliApellidos ,aliNombres
	
	) as mm
	
	 
	
	group by mm.Terminal, mm.Lote, mm.Monto_neto_tdc,Monto_Neto_tdd,Monto_afilia_tdc, COMISION_MANTENIMIENTO, COMISION_BANCARIA_1_50_USO, IVA, MONTO_ABONAR,
	
	TASA, TIPO_DE_CARTERA, N_AFILIADO, CEDULA_RIF, COMERCIO, DIRECCION, COD_COMERCIO, N_CUENTA, FechaPreceso, FechaEjec, MontoBrutoTDD
	
	,MontoBrutoTDC, MontoBrutoVisaElectro ,monto_comision_tdd, CANT_TRANSACCION, NOMBRES, APELLIDOS
	
	 
	
	Order By Terminal asc
	
	 `;
	if (agr === '2')
		return /* sql */ `
	${preQuery(init, end)}

    select ${selects}

	from (
		Select 
		a.aboCodAfi as [N_AFILIADO],
		case  when a.aboCodAfi LIKE '%000000720%' then 'BVC' else 'PLAZA' END as 'SPONSOR_BANK', 
		a.aboTerminal AS TERMINAL,	
		d.aliNombres AS NOMBRES,
		d.aliApellidos AS APELLIDOS,
		c.comerRif AS [CEDULA_RIF], 
		c.comerDesc AS COMERCIO, 
		c.comerDireccion AS DIRECCION,
		c.comerCod as [COD_COMERCIO], 
		c.comerCuentaBanco as [N_CUENTA] ,
		a.hisFechaProceso AS FechaPreceso,  
		a.hisFechaEjecucion AS FechaEjec,  
		a.hisLote as [LOTE],
		round(SUM(te.mont_bruto_tdd),2)  as MontoBrutoTDD,
		round(SUM(te.mont_bruto_tdc),2)  as MontoBrutoTDC,
		round(SUM(te.mont_bruto_tdc_visa_ele),2) as MontoBrutoVisaElectro,
		Monto_Neto_tdd as Monto_Neto_tdd,
		round( Monto_neto_tdc, 2) as Monto_neto_tdc,
		round( Monto_afilia_tdc, 2) as Monto_afilia_tdc,
		round(SUM(mont_comision_tdc_visa_ele),2) as mont_comision_tdc_visa_ele,
		a.monto_comision_tdd as monto_comision_tdd,
		a.comision_servicio as [COMISION_MANTENIMIENTO],
		a.comision_bacaria_1_50 as [COMISION_BANCARIA_1_50_USO],
		a.contracargo as Contracargo,
		a.monto_por_servicio as [IVA] ,
		(a.monto_abono) AS [MONTO_ABONAR], 
		te.hisTasaBCV AS [TASA],
		h.Nombre_Org AS [TIPO_DE_CARTERA],
		SUM(te.CANT_TRANSACCION) as CANT_TRANSACCION
	 
	
	FROM
	   	(SELECT 
				hisFechaEjecucion,
	
				hisFechaProceso,
	
				aboTerminal,
	
				aboCodAfi,
	
				hisLote,
	
				(SUM(hisAmountTDD) + SUM(hisAmountTDC)) AS Monto_Neto, 
	
				SUM(hisAmountTDD) as Monto_Neto_tdd,
	
				SUM(hisAmountTDC) as Monto_neto_tdc,
	
				((SUM(hisAmountTDC) + SUM(hisAmountComisionBanco)) - Sum(hisAmountTDCImpuesto)) as montp_neve,

				(SUM(hisAmountTDD) + SUM(hisAmountComisionBanco) - SUM(hisAmountTDCImpuesto)) as monto_bruto_tdd, 

				(SUM(hisAmountTDC) + SUM(hisAmountTDCImpuesto)) as monto_bruto_tdc, 

				(SUM(hisIvaSobreMantenimiento) + SUM(hisComisionMantenimiento) + SUM(hisComisionBancaria)) as comision_mantenimiento,

				SUM(hisComisionMantenimiento) AS comision_servicio, 

				SUM(hisAmountComisionBanco) AS comision_banco, 

				SUM(hisNetoComisionBancaria) AS monto_por_comision, 

				SUM(hisIvaSobreMantenimiento) AS monto_por_servicio, 

				(SUM(hisAmountComisionBanco) - SUM(hisAmountTDCImpuesto)) AS monto_comision_tdd, 

				SUM(hisAmountTotal) AS monto_abono,

				Sum(hisAmountTDCImpuesto) as Monto_afilia_tdc,

				Sum(hisComisionBancaria) as comision_bacaria_1_50,
				
				Sum(hisDebitoContraCargo) as contracargo

	FROM    
	
	 
	
	Historico (NOLOCK)
	
	 
	
	WHERE   hisFechaEjecucion BETWEEN  '${init}' and '${end}' 
	and hisFechaEjecucion <> hisFechaProceso
	${sponsor ? `and SUBSTRING(aboCodAfi, 7, 3)='${sponsor}'` : ''}
	GROUP BY hisFechaEjecucion, aboTerminal,hisFechaProceso,aboCodAfi, hisLote ) AS a INNER JOIN
	
	Abonos AS b ON a.aboTerminal = b.aboTerminal INNER JOIN
	
	Comercios AS c ON b.aboCodComercio = c.comerCod LEFT OUTER JOIN
	
	Aliados AS d ON c.comerCodAliado = d.id LEFT OUTER JOIN
	
	Bancos AS e ON SUBSTRING(b.aboNroCuenta, 1, 4) = e.banCodBan -- LEFT OUTER JOIN
	
	LEFT OUTER JOIN --LoteCerradoDetalle AS f ON a.aboTerminal = f.aboTerminal and a.hisFechaEjecucion = f.hisFechaEjecucion and a.hisLote = f.hisLote  LEFT OUTER JOIN
	
	Cartera_Ter AS g ON a.aboTerminal = Terminal_Id LEFT OUTER JOIN
	
	Cartera AS h ON g.Cod_Cartera = h.Cod_Cartera LEFT OUTER JOIN
	
	Temp_CerradoDetalle as te ON te.aboterminal = a.aboTerminal and a.hisFechaEjecucion = te.hisFechaEjecucion and a.hisLote = te.hisLote
	
	 
	
	Group by  a.aboTerminal, a.hisLote, MONTO_NETO_TDC,Monto_Neto_tdd, Monto_afilia_tdc,a.comision_servicio, a.contracargo,
	
	comision_bacaria_1_50, monto_por_servicio, monto_abono, hisTasaBCV, Nombre_Org, a.aboCodAfi, c.comerRif, c.comerDesc, c.comerDireccion, c.comerCod,
	
	comerCuentaBanco, a.hisFechaProceso, a.hisFechaEjecucion, monto_comision_tdd, aliApellidos ,aliNombres
	
	) as mm
	
	 
	
	group by mm.Terminal, mm.Lote, mm.Monto_neto_tdc,Monto_Neto_tdd,Monto_afilia_tdc, COMISION_MANTENIMIENTO, COMISION_BANCARIA_1_50_USO, IVA, MONTO_ABONAR,
	
	TASA, TIPO_DE_CARTERA, N_AFILIADO, CEDULA_RIF, COMERCIO, DIRECCION, COD_COMERCIO, N_CUENTA, FechaPreceso, FechaEjec, MontoBrutoTDD, mm.Contracargo
	
	,MontoBrutoTDC, MontoBrutoVisaElectro ,monto_comision_tdd, CANT_TRANSACCION, NOMBRES, APELLIDOS, SPONSOR_BANK
	
	 
	
	Order By Terminal asc
	
	 `;
};
