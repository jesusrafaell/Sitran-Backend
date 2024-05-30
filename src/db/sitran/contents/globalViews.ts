import { DataSource } from 'typeorm';
import Global_Views from '../models/Global_Views';

const globalViews = async (db: DataSource): Promise<void> => {
	const listViews: Global_Views[] = [
		{
			name: 'Inicio',
			root: '',
			key: 1,
			description: '',
		},
		{
			name: 'Movimientos',
			root: 'movimientos',
			key: 2,
			description: 'Reportes de movimientos ',
		},
		{
			//3
			name: 'Cuotas',
			root: 'cuotas',
			key: 3,
			description: 'Reporte',
		},
		{
			name: 'Cuotas Resumidas',
			root: 'cuotas-resumen',
			key: 4,
			description: 'Reporte',
		},
		{
			name: 'Mantenimiento',
			root: 'mantenimiento',
			key: 5,
			description: 'Reporte',
		},
		{
			name: 'Mantenimiento por ACI',
			root: 'mantenimiento-aci',
			key: 6,
			description: 'Reporte',
		},
		{
			name: 'Libre Pago',
			root: 'libre-pago',
			key: 7,
			description: 'Reporte',
		},
		{
			name: 'Pago Cuota',
			root: 'pago-cuota',
			key: 8,
			description: 'Reporte',
		},
		{
			name: 'Transaccional',
			root: 'transaccional',
			key: 9,
			description: 'Reporte',
		},
		{
			name: 'Archivo ContraCargo',
			root: 'contracargo-up',
			key: 10,
			description: 'Carga de archivo de contracargo',
		},
		{
			name: 'Gestion de Seguridad',
			root: 'seguridad',
			key: 11,
			description: 'Accesos y parametros',
		},
		{
			name: 'Contracargo Descontado',
			root: 'contracargo',
			key: 12,
			description: 'Reporte',
		},
		{
			name: 'Ejecutar Contracargos',
			root: 'exec-contracargo',
			key: 13,
			description: 'Ejecucion de contracargos por fecha',
		},
		{
			name: 'Contab. de ACI',
			root: 'contabilidadACI',
			key: 14,
			description: 'Reporte',
		},
		{
			name: 'Archivo AC Rechazado',
			root: 'abonoclientes/rechazado/up',
			key: 15,
			description: 'Carga de archivo',
		},
		{
			name: 'Pag. Terminales',
			root: 'paginaTerminales',
			key: 16,
			description: 'Creacion de terminales (ind y masivo)',
		},
		{
			name: 'Comercios',
			root: 'comercios',
			key: 17,
			description: 'Creacion de comercios y terminales en el agregador',
		},
		{
			name: 'AbonoXBanco',
			root: 'abonoxbanco',
			key: 18,
			description: 'Reporte de los terminales que tienen cuenta pote en los bancos',
		},
		{
			name: 'ReporteCartera',
			root: 'cuadre-cartera',
			key: 19,
			description: 'Reporte de cuadre de las carteras',
		},
		{
			name: 'MetricasPtoConsulta',
			root: 'metricas-pconsulta',
			key: 20,
			description: 'Reporte de metricas de punto consulta',
		},
		{
			name: 'Manejador de Procesos',
			root: 'procesos-prod',
			key: 21,
			description: 'Manejador de los procesos de la Produccion diaria',
		},
	];
	//
	const valid = await db.getRepository(Global_Views).find();
	if (!valid.length) await db.getRepository(Global_Views).save(listViews);
	console.log('Global Views✅');
};

export default globalViews;
