import { Action, ActionType } from '../Actions';
import { h } from '../h';
import { State } from '../State';
import { Store } from '../Store';
import { pipeValue, thrush, flip } from 'adt-ts';
import { query } from '../query';

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
		{ chave: '', elementos: {}, valorTotal: 0 },
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

	const q: <T extends Element>(selector: string) => Promise<T> = flip(query)(
		document
	);
	const txtNumProcesso = await q<HTMLInputElement>('#txtNumProcesso');
	const fldDadosReq = await q<HTMLFieldSetElement>('#fldDadosReq');
	const novo = (idFieldset: string, titleLink: string) =>
		`#${idFieldset} > legend a.infraLegendObrigatorio[title="${titleLink}"]`;
	const novoBeneficiario = await q<HTMLAnchorElement>(
		novo('fldBeneficiarios', 'Novo Beneficiário')
	);
	const novoHonorario = await q<HTMLAnchorElement>(
		novo('fldHonorarios', 'Novo Honorário')
	);
	const novoReembDeducao = await q<HTMLAnchorElement>(
		novo('fldReembDeducoes', 'Novo Reembolso/Dedução')
	);

	store.dispatch(Action.ElementoEncontrado('txtNumProcesso', txtNumProcesso));
	store.dispatch(Action.ElementoEncontrado('fldDadosReq', fldDadosReq));
	store.dispatch(
		Action.ElementoEncontrado('novoBeneficiario', novoBeneficiario)
	);
	store.dispatch(Action.ElementoEncontrado('novoHonorario', novoHonorario));
	store.dispatch(
		Action.ElementoEncontrado('novoReembDeducao', novoReembDeducao)
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

	fldDadosReq.parentNode!.insertBefore(frag, fldDadosReq);

	store.dispatch(Action.ChaveAlterada(chave.value)); // Remover em produção
};
