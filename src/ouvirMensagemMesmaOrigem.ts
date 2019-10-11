export const ouvirMensagemMesmaOrigem = (f: (data: any) => void): void =>
	window.addEventListener('message', ({ origin, data }) => {
		if (origin !== document.location.origin) return;
		f(data);
	});
