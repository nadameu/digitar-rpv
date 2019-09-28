const main = async () => {
	const acao = new URL(document.location.href).searchParams.get('acao');
	switch (acao) {
		case 'oficio_requisitorio_requisicoes_editar':
			// Tela principal
			return (await import('./telas/principal')).telaPrincipal();

		case 'oficio_requisitorio_beneficiarioshonorarios_editar':
			// Edição de beneficiário ou honorário
			return (await import('./telas/beneficiarios')).telaBeneficiarios();

		case 'oficio_requisitorio_reembdeducoes_editar':
			// Edição de reembolsos ou deduções
			return (await import('./telas/reembolsos')).telaReembolsos();

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
