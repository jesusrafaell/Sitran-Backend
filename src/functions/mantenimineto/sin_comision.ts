import { DateTime } from 'luxon';

interface select {
	key: string;
	query: string;
}

export const selects: select[] = [
	{ key: 'TERMINAL', query: `a.aboTerminal TERMINAL` },
	{ key: 'AFILIADO', query: `a.aboCodAfi AFILIADO` },
	{ key: 'NOMBRE', query: `b.comerdesc NOMBRE` },
	{ key: 'RIF_CI', query: `b.comerRif RIF_CI` },
	{ key: 'TLF', query: `c.contTelefMov TLF` },
	{ key: 'NOMBRES_ACI', query: `g.aliNombres+ ' '+aliApellidos NOMBRES_ACI` },
	{ key: 'CEDULA_ACI', query: `g.aliIdentificacion CEDULA_ACI` },
	{ key: 'TLF_ACI', query: `g.aliCodigoCelular+ ''+alicelular TLF_ACI   ` },
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

	return /* sql */ ` WHERE   hisFechaEjecucion BETWEEN '${initDate}' AND  '${endDate}'`;
};

export const FormatQuery = (selects: string): string => {
	const today: string = DateTime.local().toFormat('yyyy-MM-dd');

	return /* sql */ /*sql*/ `
    select distinct ${selects}  from [dbo].[Historico] as a

	join Comercios b on b.comerCod=a.aboCodComercio
	join contactos c on c.contCodComer=b.comerCod
	join aliados g on g.id=b.comerCodAliado  

	where a.hisComisionBancaria > '0.00' and  a.aboterminal not in (select aboterminal from  PlanPago where planId in ('5','6','7','15') and estatusId='23' ) and a.hisFechaEjecucion > GETDATE()-1
	ORDER BY a.aboTerminal asc`;
};
