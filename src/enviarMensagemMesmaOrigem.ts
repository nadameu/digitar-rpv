export const enviarMensagemMesmaOrigem = (janela: Window) => (
	data: any
): void => janela.postMessage(data, document.location.origin);
