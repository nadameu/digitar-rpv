import { criarData } from './criarData';
import { parseMoeda } from './moeda';

export const matchTextoCelula = (regexp: RegExp, errorMsg: string) => (
	cell: HTMLTableCellElement
) => {
	const text = (cell.textContent || '').trim();
	const result = text.match(regexp);
	if (result) return Promise.resolve(result);
	return Promise.reject(new Error(errorMsg));
};

export const matchNomeDocumentoCelula = (celula: HTMLTableCellElement) =>
	matchTextoCelula(
		/^(.+)\s+\(([0-9./-]+)\)$/,
		'Nome/documento não encontrados.'
	)(celula).then(([, nome, doc]) => ({ nome, doc }));

export const matchTipoEspecieCelula = (celula: HTMLTableCellElement) =>
	matchTextoCelula(
		/^(Precatório|RPV)\s+\((.+)\)$/,
		'Tipo/espécie não encontrados.'
	)(celula).then(([, tipo, especie]) => ({ tipo, especie }));

export const matchDataBaseCelula = (celula: HTMLTableCellElement) =>
	matchTextoCelula(/^(\d{2})\/(\d{4})$/, 'Data base não encontrada.')(celula)
		.then(xs => xs.map(Number))
		.then(([, mes, ano]) => ({ dataBase: criarData(ano, mes, 1) }));

export const matchValoresCelula = (celula: HTMLTableCellElement) =>
	matchTextoCelula(
		/^([0-9.,]+).*\(([0-9.,]+)\s+\+\s+([0-9.,]+)\)/,
		'Valores não encontrados'
	)(celula)
		.then(xs =>
			xs
				.slice(1)
				.map(parseMoeda)
				.filter(x => !isNaN(x))
		)
		.then(xs =>
			xs.length === 3
				? Promise.resolve(xs)
				: Promise.reject(new Error('Valores não encontrados.'))
		)
		.then(([total, principal, juros]) => ({ total, principal, juros }));

export const matchTextoNaoVazioCelula = <key extends string>(
	campoResultado: key
) => (celula: HTMLTableCellElement) =>
	matchTextoCelula(/^.+$/, 'Texto vazio.')(celula).then(
		([texto]) => ({ [campoResultado]: texto } as { [k in key]: string })
	);

export const matchNomeDocBeneficiarioCelulaHonorariosContratuais = (
	celula: HTMLTableCellElement
): Promise<{ nome: string; doc: string; beneficiario?: string }> =>
	matchTextoCelula(
		/^(.+)\s+\(([0-9./-]+)\).*\(beneficiário:\s+(.+)\)$/,
		'Nome/documento/beneficiário não encontrados.'
	)(celula)
		.then(([, nome, doc, beneficiario]) => ({
			nome,
			doc: doc.replace(/\D+/g, ''),
			beneficiario,
		}))
		.catch(() => matchNomeDocumentoCelula(celula));

export const matchQualquerCelula = (_: HTMLTableCellElement) =>
	Promise.resolve({});
