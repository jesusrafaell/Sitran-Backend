interface select {
	key: string;
	query: string;
}

export const selects: select[] = [
	{
		key: 'TERMINAL',
		query: `[TERMINAL]`,
	},
	{
		key: 'RIF',
		query: `[RIF]`,
	},
	{
		key: 'AFILIADO',
		query: `[AFILIADO]`,
	},
	{
		key: 'NOMBRE',
		query: `[NOMBRE]`,
	},
	{
		key: 'MONTO_DISPUTA',
		query: `[MONTO_DISPUTA]`,
	},
	{
		key: 'MONTO_TRANSADO',
		query: `[MONTO_TRANSADO]`,
	},
	{
		key: 'MONTO_DESCONTADO',
		query: `[MONTO_DESCONTADO]`,
	},
	{
		key: 'MONTO_PENDIENTE',
		query: `[MONTO_PENDIENTE]`,
	},
	{
		key: 'MONTO_ABONAR',
		query: `[MONTO_ABONAR]`,
	},
	{
		key: 'FECHA_EJECUCION',
		query: `[FECHA_EJECUCION]`,
	},
];

export const FormatQuery = (init: string, end: string): string => {
	return /* sql */ /*sql*/ `
    EXEC consulta_reporte_contracargo '${init}', '${end}'
    `;
};
