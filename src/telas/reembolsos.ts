import { Action } from '../Actions';
import { corrigirCampoMoedaSemAguardarPrimeiroValor } from '../corrigirCampoMoeda';
import { docQuery } from '../query';
import vincularSoma from '../vincularSoma';

export const telaReembolsos = async () => {
	const dispatch = (action: Action) => {
		window.parent.postMessage(action, document.location.origin);
	};

	const eltTotal = await docQuery<HTMLInputElement>('#txtValorTotalHono').map(
		corrigirCampoMoedaSemAguardarPrimeiroValor
	);

	const eltPrincipal = await docQuery<HTMLInputElement>(
		'#txtValorPrincipalHono'
	).map(corrigirCampoMoedaSemAguardarPrimeiroValor);

	const eltJuros = await docQuery<HTMLInputElement>('#txtValorJurosHono').map(
		corrigirCampoMoedaSemAguardarPrimeiroValor
	);

	vincularSoma(eltTotal, [eltPrincipal, eltJuros]);
};
