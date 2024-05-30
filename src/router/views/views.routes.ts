import { Router } from 'express';
import { createView, getViewsAll } from '../../controller/views';

const Views: Router = Router();

Views.route('/create').post(createView);

Views.route('/all').get(getViewsAll);

export default Views;
