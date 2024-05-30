import { Router } from 'express';
import { getAllAfiliados } from '../../controller/afiliados';

const Afiliados: Router = Router();

//By rif
Afiliados.route('/all').get(getAllAfiliados);

export default Afiliados;
