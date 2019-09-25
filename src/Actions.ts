const Type = {
	CHAVE_ALTERADA: 'CHAVE_ALTERADA',
	ELEMENTO_ENCONTRADO: 'ELEMENTO_ENCONTRADO',
	PREENCHER: 'PREENCHER',
} as const;

type Type = typeof Type[keyof typeof Type];

export { Type as ActionType };

const action = <Key extends Type, T>(type: Key, payload: T) => ({
	...payload,
	type,
});

export const Action = {
	ChaveAlterada: (valor: string) =>
		action(Type.CHAVE_ALTERADA, { chave: valor }),
	ElementoEncontrado: (nome: string, elemento: Element) =>
		action(Type.ELEMENTO_ENCONTRADO, {
			nome,
			elemento,
		}),
	Preencher: () => action(Type.PREENCHER, {}),
};
export type Action = ReturnType<typeof Action[keyof typeof Action]>;
