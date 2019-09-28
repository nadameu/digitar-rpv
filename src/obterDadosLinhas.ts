import { docQueryAll } from './query';

type CellToPromise<T> = (_: HTMLTableCellElement) => Promise<T>;
type DadosLinhas<T> = Promise<{ [key in keyof T]: T[key] }[]>;
export const obterDadosLinhas: {
	<T>(divId: string, matchers: [CellToPromise<T>]): () => DadosLinhas<T>;
	<T, U>(
		divId: string,
		matchers: [CellToPromise<T>, CellToPromise<U>]
	): () => DadosLinhas<T & U>;
	<T, U, V>(
		divId: string,
		matchers: [CellToPromise<T>, CellToPromise<U>, CellToPromise<V>]
	): () => DadosLinhas<T & U & V>;
	<T, U, V, W>(
		divId: string,
		matchers: [
			CellToPromise<T>,
			CellToPromise<U>,
			CellToPromise<V>,
			CellToPromise<W>
		]
	): () => DadosLinhas<T & U & V & W>;
	<T, U, V, W, X>(
		divId: string,
		matchers: [
			CellToPromise<T>,
			CellToPromise<U>,
			CellToPromise<V>,
			CellToPromise<W>,
			CellToPromise<X>
		]
	): () => DadosLinhas<T & U & V & W & X>;
	<T, U, V, W, X, Y>(
		divId: string,
		matchers: [
			CellToPromise<T>,
			CellToPromise<U>,
			CellToPromise<V>,
			CellToPromise<W>,
			CellToPromise<X>,
			CellToPromise<Y>
		]
	): () => DadosLinhas<T & U & V & W & X & Y>;
	<T = {}>(
		divId: string,
		matchers: Array<(_: HTMLTableCellElement) => Promise<Partial<T>>>
	): () => DadosLinhas<T>;
} = <T = {}>(
	divId: string,
	matchers: Array<(_: HTMLTableCellElement) => Promise<Partial<T>>>
) => () => {
	const linhas = docQueryAll<HTMLTableRowElement>(
		`#${divId} > table tr[class^="infraTr"]`
	);
	const promises = linhas.map(async linha => {
		if (linha.cells.length !== matchers.length)
			throw new Error('Formato de linha desconhecido');
		const result = ({} as unknown) as T;
		for (let i = 0, len = matchers.length; i < len; i++) {
			Object.assign(result, await matchers[i](linha.cells[i]));
		}
		return result;
	});
	return Promise.all(promises);
};
