import { Router } from 'express';
import { jar1 } from '../../controller/test';
const Test: Router = Router();

Test.route('/jar1').post(jar1);

export default Test;
