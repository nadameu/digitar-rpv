import { Action, ActionType } from '../Actions';
import { dispararOnChangeAoAlterarConteudo } from '../dispararOnChangeAoAlterarConteudo';
import { h } from '../h';
import {
	matchDataBaseCelula,
	matchNomeDocBeneficiarioCelulaHonorariosContratuais,
	matchNomeDocumentoCelula,
	matchQualquerCelula,
	matchTextoNaoVazioCelula,
	matchTipoEspecieCelula,
	matchValoresCelula,
} from '../matchTextoCelula';
import { obterDadosLinhas } from '../obterDadosLinhas';
import { parseChave } from '../parseChave';
import { docQuery } from '../query';
import { State } from '../State';
import { Store } from '../Store';
import { ouvirMensagemMesmaOrigem } from '../ouvirMensagemMesmaOrigem';

type Reducer = (state: State, action: Action) => State;
type Transducer = (next: Reducer) => Reducer;

export const telaPrincipal = async () => {
	console.log('Tela principal');

	const handleActions: Transducer = next => (state, action) => {
		switch (action.type) {
			case ActionType.PREENCHER:
				(state.elementos.novoBeneficiario as HTMLInputElement).click();
				return state;
			default:
				return next(state, action);
		}
	};
	const log: Transducer = next => (state, action) => {
		console.group('Digitar RPV');
		console.log('State:', state);
		console.log('Action:', action);
		const result = next(state, action);
		console.log('New state:', result);
		console.groupEnd();
		return result;
	};
	const reducer: Reducer = (state, action) => {
		switch (action.type) {
			case ActionType.ATUALIZAR_VALOR:
				return { ...state, [action.campo]: action.valor };
			case ActionType.CHAVE_ALTERADA:
				return { ...state, chave: action.chave };
			case ActionType.ELEMENTO_ENCONTRADO:
				return {
					...state,
					elementos: { ...state.elementos, [action.nome]: action.elemento },
				};
			default:
				return state;
		}
	};
	const store = new Store<State, Action>(
		{
			chave: '',
			elementos: {},
			liquidoTotal: 0,
			liquidoPrincipal: 0,
			liquidoJuros: 0,
			brutoTotal: 0,
			brutoPrincipal: 0,
			brutoJuros: 0,
		},
		log(handleActions(reducer))
	);

	ouvirMensagemMesmaOrigem(store.dispatch);

	const txtNumProcesso = await docQuery<HTMLInputElement>('#txtNumProcesso');

	const fldDadosReq = await docQuery<HTMLFieldSetElement>('#fldDadosReq');

	const selectorBotaoNovo = (idFieldset: string, titleLink: string) =>
		`#${idFieldset} > legend a.infraLegendObrigatorio[title="${titleLink}"]`;
	const novoBeneficiario = await docQuery<HTMLAnchorElement>(
		selectorBotaoNovo('fldBeneficiarios', 'Novo Beneficiário')
	);
	const novoHonorario = await docQuery<HTMLAnchorElement>(
		selectorBotaoNovo('fldHonorarios', 'Novo Honorário')
	);
	const novoReembDeducao = await docQuery<HTMLAnchorElement>(
		selectorBotaoNovo('fldReembDeducoes', 'Novo Reembolso/Dedução')
	);

	// BENEFICIÁRIOS
	const obterDadosLinhasBeneficiarios = obterDadosLinhas(
		'divConteudoBeneficiarios',
		[
			matchNomeDocumentoCelula,
			matchTipoEspecieCelula,
			matchDataBaseCelula,
			matchValoresCelula,
			matchQualquerCelula,
		]
	);
	const divConteudoBeneficiarios = await docQuery<HTMLFieldSetElement>(
		'#divConteudoBeneficiarios'
	);
	dispararOnChangeAoAlterarConteudo(divConteudoBeneficiarios);
	let beneficiarios = await obterDadosLinhasBeneficiarios();
	divConteudoBeneficiarios.addEventListener('change', () =>
		obterDadosLinhasBeneficiarios()
			.then(dados => {
				beneficiarios = dados;
				console.log({ beneficiarios });
			})
			.catch(error => {
				console.error(error);
			})
	);

	// HONORÁRIOS
	const obterDadosLinhasHonorarios = obterDadosLinhas('divConteudoHonorarios', [
		matchNomeDocBeneficiarioCelulaHonorariosContratuais,
		matchTipoEspecieCelula,
		matchTextoNaoVazioCelula('tipoHonorarios'),
		matchDataBaseCelula,
		matchValoresCelula,
		matchQualquerCelula,
	]);
	const divConteudoHonorarios = await docQuery<HTMLFieldSetElement>(
		'#divConteudoHonorarios'
	);
	dispararOnChangeAoAlterarConteudo(divConteudoHonorarios);
	let honorarios = await obterDadosLinhasHonorarios();
	divConteudoHonorarios.addEventListener('change', () =>
		obterDadosLinhasHonorarios()
			.then(dados => {
				honorarios = dados;
				console.log({ honorarios });
			})
			.catch(error => {
				console.error(error);
			})
	);

	// REEMBOLSOS / DEDUÇÕES
	const obterDadosLinhasReembDeducoes = obterDadosLinhas(
		'divConteudoReembDeducoes',
		[
			matchTextoNaoVazioCelula('tipoReembDeducao'),
			matchDataBaseCelula,
			matchValoresCelula,
			matchQualquerCelula,
		]
	);
	const divConteudoReembDeducoes = await docQuery<HTMLFieldSetElement>(
		'#divConteudoReembDeducoes'
	);
	dispararOnChangeAoAlterarConteudo(divConteudoReembDeducoes);
	let reembDeducoes = await obterDadosLinhasReembDeducoes();
	divConteudoHonorarios.addEventListener('change', () =>
		obterDadosLinhasReembDeducoes()
			.then(dados => {
				reembDeducoes = dados;
				console.log({ reembDeducoes });
			})
			.catch(error => {
				console.error(error);
			})
	);

	const frag = document.createDocumentFragment();
	const chave = h('input', {
		id: 'gm-chave',
		value:
			'000961500613CA93A000AA7F109016301A17D7400000008015CFEC000005B01000001E00493E000024A95017456A',
	});
	frag.append(
		h('br'),
		h('label', { for: 'gm-chave' }, ['Chave']),
		chave,
		h('br')
	);
	chave.addEventListener('change', () => {
		try {
			let current = parseChave(chave.value.trim());
			console.log(current);
		} catch (err) {
			console.error(err);
		}
	});
	fldDadosReq.parentNode!.insertBefore(frag, fldDadosReq.nextSibling);
};
