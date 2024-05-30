import { Router } from 'express';
import history from '../../controller/history';

const History: Router = Router();

History.route('').post(history.allHistory);

History.route('/keys').get(history.keys);

export default History;
