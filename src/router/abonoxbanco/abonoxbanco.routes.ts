import { Router } from 'express';
import { AbonoXBanco, emailFileSender, keys } from '../../controller/AbonoXBanco';

const AbonoxbancoRoutes: Router = Router();

AbonoxbancoRoutes.route('').post(AbonoXBanco).get(keys);
AbonoxbancoRoutes.route('/file-mail').get(emailFileSender);

export default AbonoxbancoRoutes;
