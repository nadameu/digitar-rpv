export const query = <T extends Element>(selector: string) => (
	parentNode: ParentNode
): Promise<T> => {
	const element = parentNode.querySelector<T>(selector);
	if (element) return Promise.resolve(element);
	else
		return Promise.reject(
			new Error(`Elemento \`${selector}\` não encontrado.`)
		);
};
