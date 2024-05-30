import { CarropagoDS, GSComputerDS, LibrepagoDS, MilpagosDS, SitranDS } from '../../config/DataSource';
import originLogs_sitran from '../../sitran/contents/originLogs_sitran';

SitranDS.initialize()
	.then(async () => {
		await MilpagosDS.initialize()
			.then(async () => {
				const DS = MilpagosDS;
				console.log('PreData Milpagos');
				await originLogs_sitran(DS);
				console.log('logs ✅');
				console.log('Listo Milpagos✅');
			})
			.catch((err) => {
				console.log(err);
				process.exit();
			});
		await CarropagoDS.initialize()
			.then(async () => {
				const DS = CarropagoDS;
				console.log('PreData Carropago');
				await originLogs_sitran(DS);
				console.log('logs ✅');
				console.log('Listo Carropago ✅');
			})
			.catch((err) => {
				console.log(err);
				process.exit();
			});
		await LibrepagoDS.initialize()
			.then(async () => {
				const DS = LibrepagoDS;
				console.log('PreData Librepago');
				await originLogs_sitran(DS);
				console.log('Listo Librepago ✅');
			})
			.catch((err) => {
				console.log(err);
				process.exit();
			});
		// await GSComputerDS.initialize()
		// 	.then(async () => {
		// 		const DS = GSComputerDS;
		// 		console.log('PreData GSComputer');
		// 		await originLogs_sitran(DS);
		// 		console.log('Listo GsComputer ✅');
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 		process.exit();
		// 	});
		process.exit();
	})
	.catch((err) => {
		console.log(err);
		process.exit();
	});
