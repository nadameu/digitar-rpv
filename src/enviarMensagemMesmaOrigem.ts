export const enviarMensagemMesmaOrigem = (destino: Window) => (
	data: any
): void => destino.postMessage(data, document.location.origin);
