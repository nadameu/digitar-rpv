import { PREENCHER_BENEFICIARIO } from '../Constantes';
import { corrigirCampoMoedaSemAguardarPrimeiroValor } from '../corrigirCampoMoeda';
import { enviarMensagemMesmaOrigem } from '../enviarMensagemMesmaOrigem';
import { observarCampoMoeda } from '../observarCampoMoeda';
import { ouvirMensagemMesmaOrigem } from '../ouvirMensagemMesmaOrigem';
import { docQuery } from '../query';
import { vincularAlteracoes } from '../vincularAlteracoes';
import vincularSoma from '../vincularSoma';
import { DadosChave } from '../Chave';
import { formatarMoeda } from '../moeda';
import { formatarDataBase } from '../formatarDataBase';
import { preencherInput } from '../preencherInput';

declare function trataIrraSimNao(): void;
declare function trataHonDestac(): void;

export const telaBeneficiarios = async () => {
	const dispatch: (action: any) => void = enviarMensagemMesmaOrigem(
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

	const hdnIdRequisicao = await docQuery<HTMLInputElement>(
		'#id_requisicao_beneficiario'
	);
	const ehRequisicaoNova = hdnIdRequisicao.value === '';

	if (!ehRequisicaoNova) return;

	const pararDeOuvir = ouvirMensagemMesmaOrigem((data, source) =>
		(async () => {
			console.log('Mensagem recebida', data);
			const dadosChave = data as DadosChave;

			await preencherInput('txtDtaBase', formatarDataBase(dadosChave.dataBase));
			await preencherInput('selTipoJurosMora', dadosChave.tipoJurosMora);

			if (dadosChave.contratuais.isJust) {
				const link = await docQuery<HTMLAnchorElement>('#showCalculosBenefi');
				link.click();
				eltBrutoPrincipal.valueAsNumber = dadosChave.principalBen;
				eltBrutoJuros.valueAsNumber = dadosChave.jurosBen;
				eltBrutoTotal.valueAsNumber =
					dadosChave.principalBen + dadosChave.jurosBen;

				switch (dadosChave.contratuais.value.contratuais) {
					case '%': {
						await preencherInput(
							'txtPercentualContratual',
							formatarMoeda(dadosChave.contratuais.value.pctContratuais)
						);
						break;
					}

					case '$': {
						await preencherInput(
							'txtMinimoContratual',
							formatarMoeda(dadosChave.contratuais.value.minContratuais)
						);
						break;
					}
				}

				await preencherInput('selHonDestac', 'S');
			} else {
				eltLiquidoPrincipal.valueAsNumber = dadosChave.principalBen;
				eltLiquidoJuros.valueAsNumber = dadosChave.jurosBen;
				eltLiquidoTotal.valueAsNumber =
					dadosChave.principalBen + dadosChave.jurosBen;
				await preencherInput('selHonDestac', 'N');
				trataHonDestac();
			}

			const selIrra = await docQuery<HTMLSelectElement>('#selIrra');
			if (dadosChave.rra.isJust) {
				selIrra.value = 'S';
				trataIrraSimNao();

				await preencherInput(
					'txtNumMesesExCorrente',
					dadosChave.rra.value.mesesCorrente.toString()
				);
				await preencherInput(
					'txtValorExCorrente',
					formatarMoeda(dadosChave.rra.value.valorCorrente)
				);
				await preencherInput(
					'txtNumMesesExAnterior',
					dadosChave.rra.value.mesesAnteriores.toString()
				);
				await preencherInput(
					'txtValorExAnterior',
					formatarMoeda(
						dadosChave.principalBen +
							dadosChave.jurosBen -
							dadosChave.rra.value.valorCorrente
					)
				);
			} else {
				selIrra.value = 'N';
				trataIrraSimNao();
			}
		})().catch(err => {
			console.error(err);
		})
	);

	console.log('Enviando mensagem');
	dispatch({ type: PREENCHER_BENEFICIARIO });
};
