export const ouvirMensagemMesmaOrigem = (
	f: (data: any, source: Window | null) => void
): (() => void) => {
	const listener: (this: Window, ev: MessageEvent) => any = ({
		origin,
		data,
		source,
	}) => {
		if (origin !== document.location.origin) return;
		if (source && source instanceof Window) f(data, source);
		else f(data, null);
	};
	window.addEventListener('message', listener);
	return () => {
		window.removeEventListener('message', listener);
	};
};
