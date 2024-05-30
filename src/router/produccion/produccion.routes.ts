import { Router } from 'express';
import { allProd, allProdToday, execProd } from '../../controller/produccion';

const ProduccionRoutes: Router = Router();

ProduccionRoutes.route('/all').get(allProd);

ProduccionRoutes.route('/all/today/:id_category').get(allProdToday);

ProduccionRoutes.route('/exec/:id').get(execProd);

export default ProduccionRoutes;
