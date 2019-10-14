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
import { PREENCHER_BENEFICIARIO } from '../Constantes';
import { enviarMensagemMesmaOrigem } from '../enviarMensagemMesmaOrigem';

type Reducer = (state: State, action: Action) => State;
type Transducer = (next: Reducer) => Reducer;

export const telaPrincipal = async () => {
	console.log('Tela principal');

	//#region Gerenciamento de estado
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

	ouvirMensagemMesmaOrigem(x => store.dispatch(x));

	//#endregion

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

	//#region BENEFICIÁRIOS
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

	//#endregion

	//#region HONORÁRIOS
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

	//#endregion

	//#region REEMBOLSOS / DEDUÇÕES
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

	//#endregion

	const frag = document.createDocumentFragment();
	const chave = h('input', {
		id: 'gm-chave',
		value:
			'000365710913CA93A000AA7F109016301A17D7400000008015CFEC000005B01000001E00493E000024A95017456A',
		pattern: '\\s*[0-9A-Fa-f]{92}\\s*',
	});
	const listaAcoes = h('div', { id: 'gm-output' });
	frag.append(
		h('br'),
		h('label', { for: 'gm-chave' }, ['Chave']),
		chave,
		h('br'),
		listaAcoes
	);
	chave.addEventListener('input', () => {
		while (listaAcoes.hasChildNodes())
			listaAcoes.removeChild(listaAcoes.firstChild!);
	});
	chave.addEventListener('change', () => {
		try {
			if (!chave.validity.valid) return;
			let dadosChave = parseChave(chave.value.trim());
			console.log(dadosChave);
			const seq = dadosChave.numproc.slice(0, 8);
			const subsecao = dadosChave.numproc.slice(8);
			const comparacao = `5${seq}____404__${subsecao}`;
			const numproc = txtNumProcesso.value;
			const corresponde = comparacao
				.split('')
				.every((x, i) => x === '_' || numproc[i] === x);
			if (!corresponde)
				throw new Error(
					`Chave não corresponde ao processo atual: "${comparacao}".`
				);

			const acoes: HTMLButtonElement[] = [];
			const cadastrarBeneficiario = h('button', { type: 'button' }, [
				dadosChave.contratuais.isJust
					? 'Cadastrar beneficiário e honorários contratuais'
					: 'Cadastrar beneficiário',
			]);
			cadastrarBeneficiario.addEventListener('click', () => {
				const deixarDeOuvir = ouvirMensagemMesmaOrigem((msg, origem) => {
					if (!origem) return;
					if (msg && msg.type === PREENCHER_BENEFICIARIO) {
						console.log('Mensagem recebida.');
						deixarDeOuvir();
						listaAcoes.removeChild(cadastrarBeneficiario.parentNode!);
						console.log('Respondendo');
						enviarMensagemMesmaOrigem(origem)(dadosChave);
						console.log('Respondido.');
					}
				});
				novoBeneficiario.click();
			});
			acoes.push(cadastrarBeneficiario);
			if (dadosChave.sucumbenciais.isJust) {
				const cadastrarSucumbenciais = h('button', { type: 'button' }, [
					'Cadastrar honorários sucumbenciais',
				]);
				acoes.push(cadastrarSucumbenciais);
			}
			listaAcoes.append(...acoes.map(x => h('p', null, [x])));
		} catch (err) {
			console.error(err);
			alert(err.message);
		}
	});
	fldDadosReq.parentNode!.insertBefore(frag, fldDadosReq.nextSibling);
};
