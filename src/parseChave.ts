import {
	DadosChave,
	DadosHonContratuais,
	DadosHonSucumbenciais,
	DadosRRA,
	TipoJurosMora,
} from './Chave';
import { dataExcel } from './dataExcel';
import { Just, Nothing } from './Maybe';

export const parseChave = (chave: string): DadosChave => {
	const {
		lerString,
		lerHex,
		lerMoeda,
		lerEnum,
		lerBoolean,
	} = inicializarLeitor(chave);
	const numproc = lerString(10);
	const valorTotal = lerMoeda();
	const dataBase = dataExcel(lerHex());
	const principalBen = lerMoeda();
	const jurosBen = lerMoeda();

	//#region Tipo juros mora
	const temp = lerEnum('0', '1', '2', '3', '4');
	const tipoJurosMora: TipoJurosMora = temp === '0' ? '' : temp;
	//#endregion

	//#region RRA
	const rra = lerBoolean();
	const mesesCorrente = lerHex();
	const valorCorrente = lerMoeda();
	const mesesAnteriores = lerHex();
	if (rra && mesesCorrente + mesesAnteriores < 1)
		throw new Error(
			'Deve haver ao menos 1 (um) mês dos exercícios corrente ou anteriores.'
		);
	const dadosRRA: DadosRRA = rra
		? Just({
				mesesCorrente,
				valorCorrente,
				mesesAnteriores,
		  })
		: Nothing;
	//#endregion

	//#region Honorários contratuais
	const contratuais = lerBoolean();
	const txtTipoContratuais = lerEnum('0', '1', '2');
	if (contratuais && txtTipoContratuais === '0')
		throw new Error('Tipo de honorários contratuais não especificado.');
	const valorContratuais = lerHex();
	const minimoContratuais = lerMoeda();
	const dadosContratuais: DadosHonContratuais = contratuais
		? Just(
				txtTipoContratuais === '1'
					? { contratuais: '%', pctContratuais: valorContratuais }
					: { contratuais: '$', minContratuais: minimoContratuais }
		  )
		: Nothing;
	//#endregion

	//#region Honorários sucumbenciais
	const sucumbenciais = lerBoolean();
	const principalSuc = lerMoeda();
	const jurosSuc = lerMoeda();
	const dadosSucumbenciais: DadosHonSucumbenciais = sucumbenciais
		? Just({ principalSuc, jurosSuc })
		: Nothing;
	//#endregion

	return {
		numproc,
		valorTotal,
		dataBase,
		principalBen,
		jurosBen,
		tipoJurosMora,
		rra: dadosRRA,
		contratuais: dadosContratuais,
		sucumbenciais: dadosSucumbenciais,
	};
};

const inicializarLeitor = (chave: string) => {
	let restante = chave;
	let posicao = 0;

	const lerString = (qtd: number) => {
		if (qtd < 1)
			throw new Error(
				`Posição: ${posicao}; Quantidade de caracteres a ler deve ser maior que 0 (zero).`
			);
		if (qtd > restante.length)
			throw new Error(
				`Posição: ${posicao}; Quantidade de caracteres a ler excede o comprimento do texto.`
			);
		const texto = restante.slice(0, qtd);
		restante = restante.slice(qtd);
		posicao += qtd;
		return texto;
	};

	const lerHex = (qtd = 7) => {
		const posicaoInicial = posicao;
		const texto = lerString(qtd);
		if (!/^[0-9A-Fa-f]+$/.test(texto))
			throw new Error(
				`Posição: ${posicaoInicial}; Texto não representa um número em notação hexadecimal: "${texto}".`
			);
		return parseInt(texto, 16);
	};

	const lerMoeda = (qtd = 7) => lerHex(qtd) / 100;

	const lerEnum = <key extends string>(...itens: key[]): key => {
		const comprimentos = itens.map(x => x.length);
		const len = Math.min(...comprimentos);
		if (Math.max(...comprimentos) !== len)
			throw new Error(
				`Posição: ${posicao}; Todos os itens devem possuir o mesmo comprimento: ${itens
					.map(x => `"${x}"`)
					.join(', ')}.`
			);
		const posicaoInicial = posicao;
		const texto = lerString(len);
		if (!(itens as string[]).includes(texto)) {
			const textos = itens.map(x => `"${x}"`);
			const ultimos = textos.slice(-2);
			const ultimo = ultimos.join(' ou ');
			const textoItens = textos
				.slice(0, -2)
				.concat([ultimo])
				.join(', ');
			throw new Error(
				`Posição: ${posicaoInicial}; Esperado: ${textoItens}; obtido: "${texto}".`
			);
		}
		return texto as key;
	};

	const lerBoolean = (): boolean => {
		const bool = lerEnum('0', '1');
		return bool === '0';
	};

	return { lerString, lerHex, lerMoeda, lerEnum, lerBoolean };
};
