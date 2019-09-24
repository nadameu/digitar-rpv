export const parseMoeda = (texto: string) =>
	Number(
		String(texto)
			.replace(/\./g, '')
			.replace(',', '.')
	);

const toCentavos = (valor: number) => Math.round(Number(valor) * 100);

export const arredondarMoeda = (valor: number) => toCentavos(valor) / 100;

export const splitEnd = (
	text: string,
	characters: number
): [string, string] => {
	const index = Math.min(text.length, Math.max(0, text.length - characters));
	return [text.slice(0, index), text.slice(index)];
};

const agruparDigitos = (texto: string): string => {
	if (texto.length <= 3) return texto;
	const [left, right] = splitEnd(texto, 3);
	return `${agruparDigitos(left)}.${right}`;
};

export const formatarMoeda = (valor: number) => {
	let texto = String(toCentavos(valor));
	while (texto.length < 3) texto = `0${texto}`;
	const [reais, centavos] = splitEnd(texto, 2);
	return `${agruparDigitos(reais)},${centavos}`;
};
