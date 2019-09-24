export const parseMoeda = (texto: string) =>
	Number(
		String(texto)
			.replace(/\./g, '')
			.replace(',', '.')
	);

const toCentavos = (valor: number) => Math.round(Number(valor) * 100);

export const arredondarMoeda = (valor: number) => toCentavos(valor) / 100;

export const formatarMoeda = (valor: number) => {
	let texto = String(toCentavos(valor));
	while (texto.length < 3) texto = `0${texto}`;
	let reais = texto.slice(0, texto.length - 2);
	const centavos = texto.slice(texto.length - 2);
	texto = `,${centavos}`;
	while (reais.length > 3) {
		texto = `.${reais.slice(reais.length - 3)}${texto}`;
		reais = reais.slice(0, reais.length - 3);
	}
	texto = `${reais}${texto}`;
	return texto;
};
