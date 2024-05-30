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
	/* 
	Fecha,
Estatus, 
Metodo, 
Origen,
Sum(Cantidad) as Cantidad

*/

	{
		key: 'Fecha',
		query: `Fecha`,
	},
	{
		key: 'Estatus',
		query: `Estatus`,
	},
	{
		key: 'Metodo',
		query: 'Metodo',
	},
	{
		key: 'Origen',
		query: 'Origen',
	},
	{
		key: 'Cantidad',
		query: 'Sum(Cantidad) as Cantidad',
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

export const selectQuery = (keys: string[]) => {
	return selects
		.filter((select): boolean => keys.includes(select.key))
		.map((select) => select.query)
		.join(', ');
};

export const dateRang = (init: string, end: string): any => {
	return { init: DateTime.fromFormat(init, 'YYYY-MM-DD'), end: DateTime.fromFormat(end, 'YYYY-MM-DD') };
};

export const FormatQuery = (dateRang: any, terminales: string): string => {
	const { init, end } = dateRang;
	// console.log('librePago', { init, end }, { terminales });

	return /* sql */ `

	DECLARE @OPENQUERY nvarchar(4000), @TSQL nvarchar(4000), @LinkedServer nvarchar(4000), @Terminal varchar(255), @StartDate varchar(255), @EndDate varchar(255), @StartHorus nvarchar(4000), @EndHorus nvarchar(4000)
	SET @LinkedServer = '[${process.env.NODE_ENV === 'prod' ? 'POSTILION_7018' : 'PRUEBA_7218'}]'
	SET @Terminal = '${terminales}'
	SET @StartDate = '${init}'
	SET @EndDate =   '${end}'
	SET @StartHorus = '00:00:00'
	SET @EndHorus = '23:59:59'
	SET @OPENQUERY = 'SELECT * FROM OPENQUERY('+ @LinkedServer + ','''
	SET @TSQL = '


	Select 
	Fecha,
	Estatus, 
	Metodo, 
	Origen,
	Sum(Cantidad) as Cantidad

	From

	(select 
	--Origen
	case 
		when ( in_req is not null   ) 
				then
						--SUBSTRING(in_req, 1, 10)
						CONVERT(varchar, in_req, 1)
		when (  in_adv is not null) 
				then
						CONVERT(varchar, in_adv, 1)
		when ( in_recon_adv is not null) 
				then
						CONVERT(varchar, in_recon_adv, 1)
		when ( in_rev is not null) 
				then
						CONVERT(varchar, in_rev, 1)
		else ''''faltaFecha''''
	end  as Fecha,
	--Metodo
	case msg_type when ''''512'''' then ''''Compra'''' when ''''1312'''' then ''''Cierre_Lote''''  when ''''1056'''' then ''''Reverso'''' end  as Metodo, 
	--Origen
	case 
		when ( sink_node = ''''sktandem'''') 
				then
						''''Credito''''
		else ''''Debito''''
	end  as Origen,

	--Estatus
	case 
		when ( rsp_code_req_rsp = ''''00'''') 
				then
						''''Aprobada''''
		else ''''Rechazada''''
	end  as Estatus,
	count(*) as Cantidad




	from [tm_trans_base].[dbo].[tm_trans] (nolock)  

		where card_acceptor_term_id in ('+@Terminal+')
		and (in_req between '''''+@StartDate+' 00:00:00'''' and '''''+@EndDate+' 23:59:00''''
		or in_adv between '''''+@StartDate+' 00:00:00'''' and '''''+@EndDate+' 23:59:00''''
		or in_rev between '''''+@StartDate+' 00:00:00'''' and '''''+@EndDate+' 23:59:00''''
		or in_recon_adv between'''''+@StartDate+' 00:00:00'''' and '''''+@EndDate+' 23:59:00'''' )

	group by msg_type, rsp_code_req_rsp, sink_node, in_req, in_adv, in_recon_adv, in_rev) as g

	group by Metodo, Origen, Estatus, Cantidad, Fecha

	union all

	Select 
	''''Total'''',
	Estatus, 
	Metodo, 
	Origen,
	Sum(Cantidad) as Cantidad

	From

	(select 
	--Origen
	case 
		when ( in_req is not null   ) 
				then
						--SUBSTRING(in_req, 1, 10)
						CONVERT(varchar, in_req, 1)
		when (  in_adv is not null) 
				then
						CONVERT(varchar, in_adv, 1)
		when ( in_recon_adv is not null) 
				then
						CONVERT(varchar, in_recon_adv, 1)
		when ( in_rev is not null) 
				then
						CONVERT(varchar, in_rev, 1)
		else ''''faltaFecha''''
	end  as Fecha,
	--Metodo
	case msg_type when ''''512'''' then ''''Compra'''' when ''''1312'''' then ''''Cierre_Lote''''  when ''''1056'''' then ''''Reverso'''' end  as Metodo, 
	--Origen
	case 
		when ( sink_node = ''''sktandem'''') 
				then
						''''Credito''''
		else ''''Debito''''
	end  as Origen,

	--Estatus
	case 
		when ( rsp_code_req_rsp = ''''00'''') 
				then
						''''Aprobada''''
		else ''''Rechazada''''
	end  as Estatus,
	count(*) as Cantidad




	from [tm_trans_base].[dbo].[tm_trans] (nolock)  

		where card_acceptor_term_id in ('+@Terminal+')
		and (in_req between '''''+@StartDate+' 00:00:00'''' and '''''+@EndDate+' 23:59:00''''
		or in_adv between '''''+@StartDate+' 00:00:00'''' and '''''+@EndDate+' 23:59:00''''
		or in_rev between '''''+@StartDate+' 00:00:00'''' and '''''+@EndDate+' 23:59:00''''
		or in_recon_adv between'''''+@StartDate+' 00:00:00'''' and '''''+@EndDate+' 23:59:00'''' )

	group by msg_type, rsp_code_req_rsp, sink_node, in_req, in_adv, in_recon_adv, in_rev) as g

	group by Metodo, Origen, Estatus, Cantidad

	union all


	select
	''''Cantidad Total'''',
	''''T-${terminales}'''',
	'''' '''',
	'''' '''',
	count(*) as Cantidad


	from [tm_trans_base].[dbo].[tm_trans](nolock)  

		where card_acceptor_term_id in ('+@Terminal+')
		and (in_req between '''''+@StartDate+' 00:00:00'''' and '''''+@EndDate+' 23:59:00''''
		or in_adv between '''''+@StartDate+' 00:00:00'''' and '''''+@EndDate+' 23:59:00''''
		or in_rev between '''''+@StartDate+' 00:00:00'''' and '''''+@EndDate+' 23:59:00''''
		or in_recon_adv between'''''+@StartDate+' 00:00:00'''' and '''''+@EndDate+' 23:59:00'''' )

	order by Fecha, Origen, Cantidad asc
	'')'

	SET @StartHorus = convert(nvarchar(4000),@TSQL)
	EXEC (@OPENQUERY+@StartHorus)
`;
};
