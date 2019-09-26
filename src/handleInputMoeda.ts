import { formatarMoeda, arredondarMoeda, parseMoeda } from './moeda';
import { RegexLiteral } from '@babel/types';

export const handleInputMoeda = (evt: Event): void => {
	console.log(JSON.stringify(evt));
	const input = evt.target as HTMLInputElement;
	let caracteres = input.value;
	const pos = input.selectionEnd!;
	let digitosApos = 0;
	for (let i = pos, len = caracteres.length; i < len; i++) {
		if (caracteres[i].match(/\d/)) digitosApos++;
	}
	let texto = formatarMoeda(Number(caracteres.replace(/\D+/g, '')) / 100);
	if (texto === '0,00') texto = '';
	let posNova = texto.length;
	for (let i = texto.length - 1; i >= 0; i--) {
		if (texto[i].match(/\d/)) {
			if (digitosApos === 0) break;
			digitosApos--;
		}
		posNova = i;
	}
	// let esq = caracteres.slice(0, pos).replace(/\D+/g, '');
	// let dir = caracteres.slice(pos).replace(/\D+/g, '');
	// while (esq.length + dir.length < 3) esq = `0${esq}`;
	// if (esq.length > 0)
	// 	while (esq.length + dir.length > 3 && esq[0] === '0') esq = esq.slice(1);
	// if (esq.length === 0)
	// 	while (dir.length > 3 && dir[0] === '0') dir = dir.slice(1);
	// const joined = esq
	// 	.concat(dir)
	// 	.split('')
	// 	.map((x, i, xs) => [xs.length - i, x] as [number, string])
	// 	.map(([j, x]) => (j === 2 ? `,${x}` : j > 5 && j % 3 === 0 ? `${x}.` : x));
	// const tAntes = joined.slice(0, esq.length).join('');
	// const tDepois = joined.slice(esq.length).join('');
	// const text = `${tAntes}${tDepois}`;
	input.value = texto;
	input.setSelectionRange(posNova, posNova);
};
