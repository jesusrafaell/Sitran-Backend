import { sign } from 'jsonwebtoken';
import Profile from '../../db/sitran/models/Profile';
//const { HOST, PORT_PROVIDERS } = dotenv;
import 'dotenv/config';
import { SitranDS } from '../../db/config/DataSource';
import Params from '../../db/sitran/models/Params';

export interface IToken {
	id: number;
	email: string;
	profile: Profile;
}

async function createToken(id: number, email: string, profile: Profile): Promise<string> {
	const expirationToken = await SitranDS.getRepository(Params).findOne({
		where: { name: 'token', key: 'expiration' },
	});
	const token: string = sign({ id, email, profile: profile }, process.env.SECRET!, {
		expiresIn: `${expirationToken.value}h`,
	});
	// console.log('token creado', token);
	return token;
}

export default createToken;
