export type Either<a, b> = Left<a, b> | Right<b, a>;

interface ThenableEither<a, b> {
	chain<c>(f: (_: b) => Either<a, c>): Either<a, c>;
	map<c>(f: (_: b) => c): Either<a, c>;
	then<c>(f: (_: b) => Either<a, c>, g: (_: a) => Either<a, c>): Either<a, c>;
}

export interface Right<b, a = never> extends ThenableEither<a, b> {
	isLeft: false;
	isRight: true;
	rightValue: b;
}
export const Right = <b, a = never>(rightValue: b): Either<a, b> => ({
	isLeft: false,
	isRight: true,
	rightValue,
	chain: f => f(rightValue),
	map: f => Right(f(rightValue)),
	then: (f, _) => f(rightValue),
});

export interface Left<a, b = never> extends ThenableEither<a, b> {
	isLeft: true;
	isRight: false;
	leftValue: a;
}
export const Left = <a, b = never>(leftValue: a): Either<a, b> => {
	const left: Either<a, b> = {
		isLeft: true,
		isRight: false,
		leftValue,
		chain: _ => left as Left<a>,
		map: _ => left as Left<a>,
		then: (_, f) => f(leftValue),
	};
	return left;
};
