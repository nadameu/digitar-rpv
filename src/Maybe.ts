export type Maybe<a> = Just<a> | Nothing;

interface ThenableMaybe<a> {
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
	map: f => Just(f(value)),
	then: (f, _) => f(value),
});

export interface Nothing extends ThenableMaybe<any> {
	isJust: false;
	isNothing: true;
}
export const Nothing: Maybe<never> = {
	isJust: false,
	isNothing: true,
	map: _ => Nothing,
	then: (_, f) => f(),
};
