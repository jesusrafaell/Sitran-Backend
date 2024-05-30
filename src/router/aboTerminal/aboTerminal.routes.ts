import { Router } from 'express';
import aboterminal, {
	createTerminal,
	editDataTerminal,
	getAllTerminal,
	getDataTerminal,
} from '../../controller/aboterminal';

const AboTerminal: Router = Router();

AboTerminal.route('').post(aboterminal.all);

AboTerminal.route('/keys').get(aboterminal.keys);

AboTerminal.route('/all').get(getAllTerminal);

AboTerminal.route('/:term').get(getDataTerminal).put(editDataTerminal);

AboTerminal.route('/create/').post(createTerminal);

export default AboTerminal;
