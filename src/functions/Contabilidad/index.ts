import { DateTime } from 'luxon';

interface select {
	key: string;
	query: string;
}

export const selects: select[] = [
	{
		key: 'NOMBRE-ACI',
		query: `Nombre-ACI`,
	},
	{
		key: 'COMERCIO',
		query: `COMERCIO`,
	},
	{
		key: 'CEDULA-RIF',
		query: 'CEDULA-RIF',
	},
	{
		key: 'TERMINAL',
		query: 'TERMINAL',
	},
	{
		key: 'CANT_VENCIDAS',
		query: 'Cant_Vencidas',
	},
	{
		key: 'CANT_PAGADAS',
		query: 'Cant_Pagadas',
	},
	{
		key: 'MONTOTOTAL',
		query: 'MontoTotal',
	},
	{
		key: 'COMISION_ACI',
		query: 'COMISION_ACI',
	},
];

export const selectsGeneral: select[] = [
	{
		key: 'CEDULA-RIF',
		query: 'CEDULA-RIF',
	},
	{
		key: 'COMERCIO',
		query: `COMERCIO`,
	},
	{
		key: 'DIRECCION',
		query: `DIRECCION`,
	},
	{
		key: 'TERMINAL',
		query: 'TERMINAL',
	},
	{
		key: 'FechaEjec',
		query: `FechaEjec`,
	},
	{
		key: 'TARIFA_MANTENIMIENTO',
		query: 'TARIFA_MANTENIMIENTO',
	},
	{
		key: 'COMISION_BANCO',
		query: 'COMISION_BANCO',
	},
	{
		key: 'NETO_COMISION_BANCARIA2',
		query: 'NETO_COMISION_BANCARIA2',
	},
	{
		key: 'NETO_COMISION_BANCARIA',
		query: 'NETO_COMISION_BANCARIA',
	},
	{
		key: 'MONTO_ABONAR',
		query: 'MONTO_ABONAR',
	},
	{
		key: 'IVA_TARIFA_MANTENIMIENTO',
		query: 'IVA_TARIFA_MANTENIMIENTO',
	},
	{
		key: 'COMISION_ACI',
		query: 'COMISION_ACI',
	},
	{
		key: 'COMISION_ACI_D',
		query: 'COMISION_ACI_D',
	},
	{
		key: 'Tasa',
		query: 'Tasa',
	},
	{
		key: 'NOMBRE',
		query: 'NOMBRE',
	},
	{
		key: 'APELLIDO',
		query: 'APELLIDO',
	},
];

export const dateRang = (init: string, end: string): any => {
	return { init: DateTime.fromFormat(init, 'YYYY-MM-DD'), end: DateTime.fromFormat(end, 'YYYY-MM-DD') };
};

export const FormatQueryDetalleXACI = (dateRang: any): string => {
	const { init, end } = dateRang;
	return /* sql */ `

	EXEC SP_ReportsDetalleACIs '${init}', '${end}'
`;
};

export const FormatQueryGeneral = (dateRang: any): string => {
	const { init, end } = dateRang;
	return /* sql */ `

	EXEC SP_ReportsGeneral '${init}', '${end}'
`;
};
