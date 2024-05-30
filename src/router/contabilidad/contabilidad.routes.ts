import { Router } from 'express';
import Contabilidad from '../../controller/Contabilidad';

const ContabilidadRoutes: Router = Router();

ContabilidadRoutes.route('/detallexaci').get(Contabilidad.DetalleXACI);

ContabilidadRoutes.route('/detallexaci/keys').get(Contabilidad.keys);

ContabilidadRoutes.route('/General').get(Contabilidad.General);

ContabilidadRoutes.route('/General/keys').get(Contabilidad.keysGeneral);

export default ContabilidadRoutes;
