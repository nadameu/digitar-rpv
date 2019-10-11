import { Action } from '../Actions';
import { corrigirCampoMoedaSemAguardarPrimeiroValor } from '../corrigirCampoMoeda';
import { enviarMensagemMesmaOrigem } from '../enviarMensagemMesmaOrigem';
import { observarCampoMoeda } from '../observarCampoMoeda';
import { docQuery } from '../query';
import { vincularAlteracoes } from '../vincularAlteracoes';
import vincularSoma from '../vincularSoma';

export const telaBeneficiarios = async () => {
	const dispatch: (action: Action) => void = enviarMensagemMesmaOrigem(
		window.parent
	);

	let {
		valor: liquidoTotal,
		elemento: eltLiquidoTotal,
	} = await observarCampoMoeda('#txtValorTotal', valor => {
		liquidoTotal = valor;
	});

	let {
		valor: liquidoPrincipal,
		elemento: eltLiquidoPrincipal,
	} = await observarCampoMoeda('#txtValorPrincipal', valor => {
		liquidoPrincipal = valor;
	});

	let {
		valor: liquidoJuros,
		elemento: eltLiquidoJuros,
	} = await observarCampoMoeda('#txtValorJuros', valor => {
		liquidoJuros = valor;
	});

	vincularSoma(eltLiquidoTotal, [eltLiquidoPrincipal, eltLiquidoJuros]);

	let { valor: brutoTotal, elemento: eltBrutoTotal } = await observarCampoMoeda(
		'#txtValorBruto',
		valor => {
			brutoTotal = valor;
		}
	);

	let {
		valor: brutoPrincipal,
		elemento: eltBrutoPrincipal,
	} = await observarCampoMoeda('#txtValorBrutoPrincipal', valor => {
		brutoPrincipal = valor;
	});

	let { valor: brutoJuros, elemento: eltBrutoJuros } = await observarCampoMoeda(
		'#txtValorBrutoJurosSelic',
		valor => {
			brutoJuros = valor;
		}
	);

	vincularSoma(eltBrutoTotal, [eltBrutoPrincipal, eltBrutoJuros]);

	vincularAlteracoes(eltLiquidoTotal, eltBrutoTotal);
	vincularAlteracoes(eltLiquidoPrincipal, eltBrutoPrincipal);
	vincularAlteracoes(eltLiquidoJuros, eltBrutoJuros);

	const eltHonTotal = await docQuery<HTMLInputElement>(
		'#txtValorTotalHono'
	).map(corrigirCampoMoedaSemAguardarPrimeiroValor);

	const eltHonPrincipal = await docQuery<HTMLInputElement>(
		'#txtValorPrincipalHono'
	).map(corrigirCampoMoedaSemAguardarPrimeiroValor);

	const eltHonJuros = await docQuery<HTMLInputElement>(
		'#txtValorJurosHono'
	).map(corrigirCampoMoedaSemAguardarPrimeiroValor);

	vincularSoma(eltHonTotal, [eltHonPrincipal, eltHonJuros]);
};
