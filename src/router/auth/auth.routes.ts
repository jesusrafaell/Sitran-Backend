import { Router } from 'express';
import { getLogin, login } from '../../controller/auth';

const Auth: Router = Router();

Auth.route('/login').post(login);

Auth.route('/user').get(getLogin);

export default Auth;
