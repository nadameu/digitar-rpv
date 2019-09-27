import { Either, Left, Right } from './Either';

export const query = <T extends Element>(selector: string) => (
	parentNode: ParentNode
): Either<string, T> => {
	const element = parentNode.querySelector<T>(selector);
	if (element) return Right(element);
	else return Left(`Elemento \`${selector}\` não encontrado.`);
};

export const docQuery = <T extends Element>(
	selector: string
): Either<string, T> => query<T>(selector)(document);

export const queryAll = <T extends Element>(selector: string) => (
	parentNode: ParentNode
) => Array.from(parentNode.querySelectorAll<T>(selector));

export const docQueryAll = <T extends Element>(selector: string) =>
	queryAll<T>(selector)(document);
