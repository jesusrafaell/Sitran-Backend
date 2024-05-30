import { Router } from 'express';
import AbonoClienteRechazado from '../../controller/Lote1000pagos/proveedoresCarga';

const AbonoCliente: Router = Router();

AbonoCliente.route('/up').post(AbonoClienteRechazado.upFile);

export default AbonoCliente;
