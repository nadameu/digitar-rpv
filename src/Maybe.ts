export type Maybe<a> = Just<a> | Nothing<a>;

class MaybeConstructor<a> implements PromiseLike<a> {
	then<TResult1 = a, TResult2 = never>(
		onfulfilled?:
			| ((value: a) => TResult1 | PromiseLike<TResult1>)
			| null
			| undefined,
		onrejected?:
			| ((reason: any) => TResult2 | PromiseLike<TResult2>)
			| null
			| undefined
	): PromiseLike<TResult1 | TResult2>;
	then<b = a, c = never>(
		this: Just<a> | Nothing,
		onfulfilled?: ((value: a) => b | PromiseLike<b>) | null | undefined,
		onrejected?: ((reason: any) => c | PromiseLike<c>) | null | undefined
	): PromiseLike<b | c> {
		const result =
			this.isJust && onfulfilled
				? onfulfilled(this.value)
				: this.isNothing && onrejected
				? onrejected(undefined)
				: Nothing;
		if (result instanceof MaybeConstructor) return result;
		return Just(result as b | c);
	}
}

export interface Just<a> extends MaybeConstructor<a> {
	isJust: true;
	isNothing: false;
	value: a;
}
export const Just = <a>(value: a): Maybe<a> =>
	Object.assign(new MaybeConstructor<a>(), {
		isJust: true,
		isNothing: false,
		value,
	} as const);

export interface Nothing<a = never> extends MaybeConstructor<a> {
	isJust: false;
	isNothing: true;
}
export const Nothing: Maybe<never> = Object.assign(
	new MaybeConstructor<never>(),
	{
		isJust: false,
		isNothing: true,
	} as const
);
