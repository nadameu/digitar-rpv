import { InputMoeda } from './corrigirCampoMoeda';
import { arredondarMoeda, formatarMoeda } from './moeda';
import obterValores from './obterValores';

const vincularSoma = (
	elementoTotal: InputMoeda,
	[elementoPrincipal, elementoJuros]: [InputMoeda, InputMoeda]
) => {
	const obterValoresElementos = () =>
		obterValores([elementoPrincipal, elementoJuros, elementoTotal]);

	const validarSoma = () => {
		const [principal, juros, total] = obterValoresElementos();
		if (arredondarMoeda(principal + juros) !== total) {
			elementoJuros.classList.add('gm-digitar-rpv__input_error');
		} else {
			elementoJuros.classList.remove('gm-digitar-rpv__input_error');
		}
	};

	[elementoPrincipal, elementoJuros, elementoTotal].forEach(el =>
		el.addEventListener('change', () => {
			if (elementoTotal.value === '') {
				elementoTotal.value = formatarMoeda(
					elementoPrincipal.valueAsNumber + elementoJuros.valueAsNumber
				);
				elementoTotal.sanitizeInput();
			}
			if (elementoPrincipal.value === '') {
				elementoPrincipal.value = formatarMoeda(
					elementoTotal.valueAsNumber - elementoJuros.valueAsNumber
				);
				elementoPrincipal.sanitizeInput();
			}
			if (elementoJuros.value === '') {
				elementoJuros.value = formatarMoeda(
					elementoTotal.valueAsNumber - elementoPrincipal.valueAsNumber
				);
				elementoJuros.sanitizeInput();
			}
		})
	);

	// validarSoma();
};
export default vincularSoma;
