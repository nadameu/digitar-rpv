import { criarData } from './criarData';

export const dataExcel = (num: number) =>
	// No Excel, a data 1 é 01/01/1900, mas um bug considerou o ano 1900 bissexto,
	// por isso a subtração de um dia.
	criarData(1899, 12, 31 + num - 1);
