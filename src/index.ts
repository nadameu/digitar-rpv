import { telaBeneficiarios } from './telas/beneficiarios';
import { telaPrincipal } from './telas/principal';
import { telaReembolsos } from './telas/reembolsos';

const main = async () => {
	const acao = new URL(document.location.href).searchParams.get('acao');
	switch (acao) {
		case 'oficio_requisitorio_requisicoes_editar':
			// Tela principal
			return telaPrincipal();

		case 'oficio_requisitorio_beneficiarioshonorarios_editar':
			// Edição de beneficiário ou honorário
			return telaBeneficiarios();

		case 'oficio_requisitorio_reembdeducoes_editar':
			// Edição de reembolsos ou deduções
			return telaReembolsos();

		default:
			return Promise.reject(new Error(`Ação desconhecida: ${acao}`));
	}
};

console.group('Digitar RPV');
main()
	.catch(error => {
		console.error(error);
	})
	.then(() => {
		console.groupEnd();
	});
