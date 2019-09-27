import { InputMoeda } from './corrigirCampoMoeda';
export const vincularAlteracoes = (origem: InputMoeda, destino: InputMoeda) =>
	origem.addEventListener('change', () => {
		destino.valueAsNumber = origem.valueAsNumber;
	});
