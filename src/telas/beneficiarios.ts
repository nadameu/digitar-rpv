import { flip } from 'adt-ts';
import { Action } from '../Actions';
import { handleInputMoeda } from '../handleInputMoeda';
import { parseMoeda, formatarMoeda } from '../moeda';
import { query } from '../query';
import { corrigirCampoMoeda } from '../corrigirCampoMoeda';
import vincularSoma from '../vincularSoma';

export const telaBeneficiarios = async () => {
	const dispatch = (action: Action) => {
		window.parent.postMessage(action, document.location.origin);
	};
	const q: <T extends Element>(selector: string) => Promise<T> = flip(query)(
		document
	);

	const txtValorTotal = await q<HTMLInputElement>('#txtValorTotal').then(
		corrigirCampoMoeda
	);
	let valorTotal = txtValorTotal.valueAsNumber;
	txtValorTotal.addEventListener('change', () => {
		const old = valorTotal;
		valorTotal = txtValorTotal.valueAsNumber;
		if (valorTotal !== old) {
			dispatch(Action.AtualizarValor('valorTotal', valorTotal));
		}
	});
	dispatch(Action.AtualizarValor('valorTotal', valorTotal));

	const txtValorPrincipal = await q<HTMLInputElement>(
		'#txtValorPrincipal'
	).then(corrigirCampoMoeda);
	let valorPrincipal = txtValorPrincipal.valueAsNumber;
	txtValorPrincipal.addEventListener('change', () => {
		const old = valorPrincipal;
		valorPrincipal = txtValorPrincipal.valueAsNumber;
		if (valorPrincipal !== old) {
			dispatch(Action.AtualizarValor('valorPrincipal', valorPrincipal));
		}
	});
	dispatch(Action.AtualizarValor('valorPrincipal', valorPrincipal));

	const txtValorJuros = await q<HTMLInputElement>('#txtValorJuros').then(
		corrigirCampoMoeda
	);
	let valorJuros = txtValorJuros.valueAsNumber;
	txtValorJuros.addEventListener('change', () => {
		const old = valorJuros;
		valorJuros = txtValorJuros.valueAsNumber;
		if (valorJuros !== old) {
			dispatch(Action.AtualizarValor('valorJuros', valorJuros));
		}
	});
	dispatch(Action.AtualizarValor('valorJuros', valorJuros));

	// txtValorTotal.addEventListener('change', () => {
	// 	if (txtValorPrincipal.value === '')
	// 		txtValorPrincipal.value = formatarMoeda(
	// 			txtValorTotal.valueAsNumber - txtValorJuros.valueAsNumber
	// 		);
	// 	else if (txtValorJuros.value === '')
	// 		txtValorJuros.value = formatarMoeda(
	// 			txtValorTotal.valueAsNumber - txtValorPrincipal.valueAsNumber
	// 		);
	// });
	vincularSoma(txtValorTotal, [txtValorPrincipal, txtValorJuros]);
};
