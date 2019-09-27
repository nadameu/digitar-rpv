export const dispararOnChangeAoAlterarConteudo = (target: Node) => {
	new MutationObserver(() =>
		setTimeout(() => {
			const evt = document.createEvent('Event');
			evt.initEvent('change', true, true);
			target.dispatchEvent(evt);
		}, 0)
	).observe(target, { childList: true });
};
