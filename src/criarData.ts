export const criarData = (ano: number, mes: number, dia: number) => {
	const diaAnterior = new Date(ano, mes, dia - 1, 23, 59, 59, 999);
	return new Date(diaAnterior.getTime() + 1);
};
