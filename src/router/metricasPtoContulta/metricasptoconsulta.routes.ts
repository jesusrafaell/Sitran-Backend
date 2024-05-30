import { Router } from 'express';
import { keys } from '../../controller/AbonoXBanco';
import MetricasPtoConsulta from '../../controller/MetricasPtoConsulta';

const MetricasPtoConsultaRoutes: Router = Router();

MetricasPtoConsultaRoutes.route('').post(MetricasPtoConsulta).get(keys);

export default MetricasPtoConsultaRoutes;
