import { Action } from '../Actions';
import { corrigirCampoMoedaSemAguardarPrimeiroValor } from '../corrigirCampoMoeda';
import { enviarMensagemMesmaOrigem } from '../enviarMensagemMesmaOrigem';
import { docQuery } from '../query';
import vincularSoma from '../vincularSoma';

export const telaReembolsos = async () => {
	const dispatch: (action: Action) => void = enviarMensagemMesmaOrigem(
		window.parent
	);

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
