import { Maybe } from './Maybe';

export type TipoJurosMora = '' | '1' | '2' | '3' | '4';

export type DadosChave = {
	numproc: string;
	valorTotal: number;
	dataBase: Date;
	principalBen: number;
	jurosBen: number;
	tipoJurosMora: TipoJurosMora;
	rra: DadosRRA;
	contratuais: DadosHonContratuais;
	sucumbenciais: DadosHonSucumbenciais;
};

export type DadosRRA = Maybe<{
	mesesCorrente: number;
	valorCorrente: number;
	mesesAnteriores: number;
}>;

export type DadosHonContratuais = Maybe<
	| {
			contratuais: '%';
			pctContratuais: number;
	  }
	| {
			contratuais: '$';
			minContratuais: number;
	  }
>;

export type DadosHonSucumbenciais = Maybe<{
	principalSuc: number;
	jurosSuc: number;
}>;
