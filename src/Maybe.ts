export type Maybe<a> = Just<a> | Nothing;

interface ThenableMaybe<a> {
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
	then: (f, _) => f(value),
});

export interface Nothing extends ThenableMaybe<any> {
	isJust: false;
	isNothing: true;
}
export const Nothing: Maybe<never> = {
	isJust: false,
	isNothing: true,
	then: (_, f) => f(),
};
