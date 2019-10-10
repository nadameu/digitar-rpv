import { criarData } from './criarData';

test('1 ms antes é outro dia', () => {
	let a = new Date();
	let b = new Date();
	for (let ano = 2000; ano <= 2019; ano++) {
		for (let mes = 1; mes <= 12; mes++) {
			for (let dia = 1; dia <= 31; dia++) {
				a = criarData(ano, mes, dia);
				b = new Date(a.getTime() - 1);
				expect(a.getDate()).not.toEqual(b.getDate());
			}
		}
	}
});
