import Params from '../db/sitran/models/Params';

export const validPasswordParams = (params: Params[], password: string): string[] => {
	const errors: string[] = [];

	params.map((item) => {
		switch (item.key) {
			case 'minChars':
				if (password.length < Number(item.value)) errors.push(`${item.description} ${item.value}`);
				break;
			case 'maxChars':
				if (password.length > Number(item.value)) errors.push(`${item.description} ${item.value}`);
				break;
			case 'specialChar':
				if (Number(item.value) > 0) {
					if (!/[^a-z0-9\x20]/i.test(password)) errors.push(`Falta ${item.description}`);
				}
				break;
			case 'upperCaseChar':
				if (!/([A-Z]+)/g.test(password)) errors.push(`Falta ${item.description}`);
				break;
			case 'lowerCaseChar':
				if (!/([a-z]+)/g.test(password)) errors.push(`Falta ${item.description}`);
				break;
			default:
				break;
		}
	});

	//console.log(errors);
	return errors;
};
