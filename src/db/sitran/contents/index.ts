import { SitranDS } from './../../config/DataSource';
import agregadores from './agregadores';
import category_jobs from './category_jobs';
import department from './department';
import globalViews from './globalViews';
import jobs from './jobs_prod';
import originLogs_sitran from './originLogs_sitran';
import params from './params';
import prefijos from './prefijos';
import profiles from './profile';
import roles from './roles';
import status from './status';
import types_jobs from './types_jobs';
import user from './user';
import views from './views';
import viewsXprofile from './viewsXprofile';
// init server

SitranDS.initialize()
	.then(async () => {
		console.log('Running PreData sitran');
		await department(SitranDS);
		await roles(SitranDS);
		await profiles(SitranDS);
		await status(SitranDS);
		await agregadores(SitranDS);
		await prefijos(SitranDS);
		await params(SitranDS);
		await originLogs_sitran(SitranDS);
		await globalViews(SitranDS);
		await views(SitranDS);
		await viewsXprofile(SitranDS);
		await user(SitranDS);
		await types_jobs(SitranDS);
		await category_jobs(SitranDS);
		await jobs(SitranDS);
		console.log('Listo ✅');
		process.exit();
	})
	.catch((err) => {
		console.log(err);
		process.exit();
	});
