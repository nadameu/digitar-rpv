export const dispararOnChangeAoAlterarConteudo = (target: Node) => {
	new MutationObserver(() => {
		setTimeout(dispararOnChange, 0, target);
	}).observe(target, { childList: true });
};

const dispararOnChange = (target: Node) => {
	const evt = document.createEvent('Event');
	evt.initEvent('change', true, true);
	target.dispatchEvent(evt);
};
