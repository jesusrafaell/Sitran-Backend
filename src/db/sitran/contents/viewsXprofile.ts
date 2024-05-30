import { DataSource } from 'typeorm';
import list from '../../../Middlewares/list';
import { SitranDS } from '../../config/DataSource';
import Views from '../../global/models/Views';
import s_viewXprofile from '../../global/models/ViewsXProfile';
import Department from '../models/Department';
import Global_Views from '../models/Global_Views';
import Profile from '../models/Profile';
import { listRoles } from './roles';

const viewsXprofile = async (db: DataSource): Promise<void> => {
	const seguridadView = await db.getRepository(Global_Views).findOne({ where: { root: 'seguridad' } });
	const seguridadSitranView = await db.getRepository(Views).findOne({ where: { viewId: seguridadView.id } });

	const department = await db.getRepository(Department).findOne({ where: { name: 'Seguridad' } });

	//El perfil (seguridad, todos lo roles) tiene acceso a la vista de seguridad en sitran
	const profiles = await Promise.all(
		listRoles.map(async (rol) => {
			return await db.getRepository(Profile).findOne({ where: { department, rol } });
		})
	);

	const listViews: s_viewXprofile[] = [];
	for (const profile of profiles) {
		listViews.push({
			profileId: profile.id,
			view: seguridadSitranView,
		});
	}

	const valid = await db.getRepository(s_viewXprofile).find();
	if (!valid.length) await db.getRepository(s_viewXprofile).save(listViews);
	console.log('Views from Profile ✅');
};

export default viewsXprofile;
