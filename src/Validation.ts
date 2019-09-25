export type Validation<a> = Failure | Success<a>;

export interface Failure {
	isFailure: true;
	isSuccess: false;
	failures: string[];
}
export const Failure = (failures: string[]): Failure => ({
	isFailure: true,
	isSuccess: false,
	failures,
});

export interface Success<a> {
	isFailure: false;
	isSuccess: true;
	value: a;
}
export const Success = <a>(value: a): Success<a> => ({
	isFailure: false,
	isSuccess: true,
	value,
});

export const query = <T extends Element>(selector: string): Validation<T> => {
	const element = document.querySelector<T>(selector);
	if (element) return Success(element);
	else return Failure([selector]);
};

export const lift2 = <a, b, c>(
	fa: Validation<a>,
	fb: Validation<b>,
	f: (a: a, b: b) => c
): Validation<c> =>
	fa.isFailure
		? fb.isFailure
			? Failure([...fa.failures, ...fb.failures])
			: fa
		: fb.isFailure
		? fb
		: Success(f(fa.value, fb.value));

export const sequenceObj = <T extends { [k in keyof T]: Validation<unknown> }>(
	obj: T
): Validation<
	{ [k in keyof T]: T[k] extends Validation<infer A> ? A : unknown }
> => {
	let returnValue: Validation<any> = Success({});
	for (const [key, value] of Object.entries(obj) as [
		string,
		Validation<unknown>
	][]) {
		returnValue = lift2(returnValue, value, (dest, src) => ({
			...dest,
			[key]: src,
		}));
	}
	return returnValue;
};

export const toPromise = <a>(validation: Validation<a>): Promise<a> =>
	validation.isFailure
		? Promise.reject(new Error(`Errors:\n\n${validation.failures.join('\n')}`))
		: Promise.resolve(validation.value);
