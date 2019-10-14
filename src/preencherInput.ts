import { Either } from './Either';
import { docQuery } from './query';

export const preencherInput = (
	id: string,
	valor: string
): Either<string, void> =>
	docQuery<HTMLInputElement>(`#${id}`).map(elt => {
		elt.value = valor;
	});
