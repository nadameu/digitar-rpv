import { Action, ActionType } from '../Actions';
import { dispararOnChangeAoAlterarConteudo } from '../dispararOnChangeAoAlterarConteudo';
import { h } from '../h';
import {
	matchDataBaseCelula,
	matchNomeDocBeneficiarioCelulaHonorariosContratuais,
	matchNomeDocumentoCelula,
	matchTextoNaoVazioCelula,
	matchTipoEspecieCelula,
	matchValoresCelula,
} from '../matchTextoCelula';
import { docQuery, docQueryAll } from '../query';
import { State } from '../State';
import { Store } from '../Store';

export const telaPrincipal = async () => {
	console.log('Tela principal');

	const handleActions = (next: (state: State, action: Action) => State) => (
		state: State,
		action: Action
	): State => {
		switch (action.type) {
			case ActionType.PREENCHER:
				(state.elementos.novoBeneficiario as HTMLInputElement).click();
				return state;
			default:
				return next(state, action);
		}
	};
	const log = (next: (state: State, action: Action) => State) => (
		state: State,
		action: Action
	): State => {
		console.group('Digitar RPV');
		console.log('State:', state);
		console.log('Action:', action);
		const result = next(state, action);
		console.log('New state:', result);
		console.groupEnd();
		return result;
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
		log(
			handleActions((state, action) => {
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
			})
		)
	);

	window.addEventListener('message', ({ origin, data }) => {
		if (origin !== document.location.origin) return;
		store.dispatch(data);
	});

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
	const obterDadosLinhasBeneficiarios = () =>
		Promise.all(
			Array.from(
				docQueryAll<HTMLTableRowElement>(
					'#divConteudoBeneficiarios > table tr[class^="infraTr"]'
				)
			).map(async linha => {
				if (linha.cells.length !== 5)
					throw new Error('Formato de linha desconhecido');
				const [nomeDoc, tipoEspecie, textoDataBase, valores] = linha.cells;
				const { nome, doc } = await matchNomeDocumentoCelula(nomeDoc);
				const { tipo, especie } = await matchTipoEspecieCelula(tipoEspecie);
				const dataBase = await matchDataBaseCelula(textoDataBase);
				const { total, principal, juros } = await matchValoresCelula(valores);
				return {
					nome,
					doc,
					tipo,
					especie,
					dataBase,
					total,
					principal,
					juros,
				};
			})
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
	const obterDadosLinhasHonorarios = () =>
		Promise.all(
			Array.from(
				docQueryAll<HTMLTableRowElement>(
					'#divConteudoHonorarios > table tr[class^="infraTr"]'
				)
			).map(async linha => {
				if (linha.cells.length !== 6)
					throw new Error('Formato de linha desconhecido');
				const [
					nomeDoc,
					tipoEspecie,
					textoTipoHonorarios,
					textoDataBase,
					valores,
				] = linha.cells;
				const {
					nome,
					doc,
					beneficiario,
				} = await matchNomeDocBeneficiarioCelulaHonorariosContratuais(nomeDoc);
				const { tipo, especie } = await matchTipoEspecieCelula(tipoEspecie);
				const tipoHonorarios = await matchTextoNaoVazioCelula(
					textoTipoHonorarios
				);
				const dataBase = await matchDataBaseCelula(textoDataBase);
				const { total, principal, juros } = await matchValoresCelula(valores);
				return {
					nome,
					doc,
					beneficiario,
					tipo,
					especie,
					tipoHonorarios,
					dataBase,
					total,
					principal,
					juros,
				};
			})
		);

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
	const obterDadosLinhasReembDeducoes = () =>
		Promise.all(
			Array.from(
				docQueryAll<HTMLTableRowElement>(
					'#divConteudoReembDeducoes > table tr[class^="infraTr"]'
				)
			).map(async linha => {
				if (linha.cells.length !== 4)
					throw new Error('Formato de linha desconhecido');
				const [textoTipoReembDeducao, textoDataBase, valores] = linha.cells;
				const tipoReembDeducao = await matchTextoNaoVazioCelula(
					textoTipoReembDeducao
				);
				const dataBase = await matchDataBaseCelula(textoDataBase);
				const { total, principal, juros } = await matchValoresCelula(valores);
				return {
					tipoReembDeducao,
					dataBase,
					total,
					principal,
					juros,
				};
			})
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
		id: 'gm-paulo',
		value:
			'01265298050032AA6000AA7F002A66900042CC40000000800037D6000005B01000001E0000BB8000005DD0003B92',
	});
	const preencher = h('button', { type: 'button' }, ['Preencher']);
	frag.append(
		h('br'),
		h('label', { for: 'gm-paulo' }, ['Chave']),
		chave,
		preencher,
		h('br')
	);
	chave.addEventListener('change', () => {
		store.dispatch(Action.ChaveAlterada(chave.value));
	});
	preencher.addEventListener('click', evt => {
		evt.preventDefault();
		store.dispatch(Action.Preencher());
	});

	fldDadosReq.parentNode!.insertBefore(frag, fldDadosReq.nextSibling);

	store.dispatch(Action.ChaveAlterada(chave.value)); // Remover em produção
};