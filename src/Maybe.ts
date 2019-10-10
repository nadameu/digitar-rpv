export type Maybe<a> = Just<a> | Nothing<a>;

interface ThenableMaybe<a> {
	chain<b>(f: (_: a) => Maybe<b>): Maybe<b>;
	map<b>(f: (_: a) => b): Maybe<b>;
	then<b>(f: (_: a) => Maybe<b>, g: () => Maybe<b>): Maybe<b>;
}

export interface Just<a> extends ThenableMaybe<a> {
	isJust: true;
	isNothing: false;
	value: a;
}
export const Just = <a>(value: a): Maybe<a> => ({
	isJust: true,
	isNothing: false,
	value,
	chain: f => f(value),
	map: f => Just(f(value)),
	then: (f, _) => f(value),
});

export interface Nothing<a = never> extends ThenableMaybe<a> {
	isJust: false;
	isNothing: true;
}
export const Nothing: Maybe<never> = {
	isJust: false,
	isNothing: true,
	chain: _ => Nothing,
	map: _ => Nothing,
	then: (_, f) => f(),
};
