import { InputMoeda } from './corrigirCampoMoeda';
import { arredondarMoeda, formatarMoeda } from './moeda';

const vincularSoma = (
	elementoTotal: InputMoeda,
	[elementoPrincipal, elementoJuros]: [InputMoeda, InputMoeda]
) => {
	const obterValores = () =>
		[elementoTotal, elementoPrincipal, elementoJuros].map(x => x.valueAsNumber);

	const validarSoma = () => {
		const [total, principal, juros] = obterValores();
		const soma = arredondarMoeda(principal + juros);
		const mensagem = `O valor total (R$ ${formatarMoeda(
			total
		)}) deve corresponder à soma do principal + juros (R$ ${formatarMoeda(
			principal + juros
		)}).`;
		if (total < soma) {
			elementoTotal.setCustomValidity(mensagem);
		} else if (soma === total) {
			elementoTotal.setCustomValidity('');
			elementoJuros.setCustomValidity('');
		} else {
			elementoJuros.setCustomValidity(mensagem);
		}
	};

	[elementoTotal, elementoPrincipal, elementoJuros].map(el => {
		el.addEventListener('change', () => {
			const [total, principal, juros] = obterValores();
			const estado = `${total > 0 ? 'T' : '_'}${principal > 0 ? 'P' : '_'}${
				juros > 0 ? 'J' : '_'
			}`;
			switch (estado) {
				case 'T__':
					elementoPrincipal.valueAsNumber = total;
					break;

				case 'TP_':
					if (principal > total) break;
					elementoJuros.valueAsNumber = total - principal;
					break;

				case 'T_J':
					if (juros > total) break;
					elementoPrincipal.valueAsNumber = total - juros;
					break;

				case '_PJ':
					elementoTotal.valueAsNumber = principal + juros;
					break;
			}
			validarSoma();
		});
	});

	validarSoma();
};
export default vincularSoma;
