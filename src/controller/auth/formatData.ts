import { DataSource } from 'typeorm';
import { SitranDS } from '../../db/config/DataSource';
import Views from '../../db/global/models/Views';
import Global_Views from '../../db/sitran/models/Global_Views';
import list from '../../Middlewares/list';

export const getPermiss = (value: any[]) => {
	let list: { [key: string]: number } = {};
	for (const key of value) {
		if (key.active) {
			let item: string = key.id_action.name;
			//console.log(item);
			list[item] = key.id_action.id;
		}
	}
	return list;
};

interface ViewsUser {
	name: string;
	key: number;
	root: string;
}

export const getViewsByProfile = async (DS: DataSource, profileId: number): Promise<Global_Views[]> => {
	try {
		const viewsIds: Global_Views[] = await DS.createQueryBuilder(Views, 'views')
			.select(['views.viewId as id'])
			.innerJoin('views.profiles', 's_viewXprofile')
			.where('s_viewXprofile.profileId = :idP and views.active = 1 and s_viewXprofile.active = 1', {
				idP: profileId,
			})
			.getRawMany();

		return await SitranDS.getRepository(Global_Views).find({ where: viewsIds });
	} catch (err) {
		// console.log(err);
		return [];
	}
};

export const getViewsByAgregador = async (DS: DataSource): Promise<Global_Views[]> => {
	try {
		const viewsIds: Global_Views[] = await DS.createQueryBuilder(Views, 'views')
			.select(['views.viewId as id'])
			.where('views.active = 1 ')
			.getRawMany();

		if (!viewsIds.length) return [];

		return await SitranDS.getRepository(Global_Views).find({ where: viewsIds });
	} catch (err) {
		// console.log(err);
		return [];
	}
};
