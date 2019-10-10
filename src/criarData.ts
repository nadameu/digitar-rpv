export const criarData = (ano: number, mes: number, dia: number) =>
	new Date(ano, mes - 1, dia);
