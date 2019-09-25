export const h = <Tag extends keyof HTMLElementTagNameMap>(
	tag: Tag,
	props: {} | null = null,
	children: (string | Node)[] = []
) => {
	const element = document.createElement(tag);
	for (const [key, value] of Object.entries(props || {})) {
		if (typeof value === 'function' && key.startsWith('on'))
			element.addEventListener(key.slice(2), value as any);
		else if (typeof value === 'boolean') value && element.setAttribute(key, '');
		else
			element.setAttribute(
				key,
				typeof value === 'string' ? value : String(value)
			);
	}
	element.append(...children);
	return element;
};
