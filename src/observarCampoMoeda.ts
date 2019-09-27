import { corrigirCampoMoeda } from './corrigirCampoMoeda';
import { docQuery } from './query';
export const observarCampoMoeda = async (
	selector: string,
	onchange: (_: number) => void
) => {
	const elemento = await docQuery<HTMLInputElement>(selector).map(
		corrigirCampoMoeda
	);
	let valor = elemento.valueAsNumber;
	elemento.addEventListener('change', () => {
		const old = valor;
		valor = elemento.valueAsNumber;
		if (valor !== old) onchange(valor);
	});
	return { elemento, valor };
};
