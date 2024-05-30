import { mailConnection } from '../../functions/mail';
import { CarropagoDS, LibrepagoDS, MilpagosDS, SitranDS } from './DataSource';

export const Conections = async () => {
	await mailConnection();
	//
	await SitranDS.initialize();
	console.log('Sitran ✅');
	await MilpagosDS.initialize();
	console.log('Milpagos ✅');
	await CarropagoDS.initialize();
	console.log('Carropago ✅');
	await LibrepagoDS.initialize();
	console.log('Librepago ✅');
	// await RepPostDiaDS.initialize();
	// console.log('RepPostDia ✅');
	// await GSComputerDS.initialize();
	// console.log('GSComputer ✅');
};
