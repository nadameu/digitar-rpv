export default {
	description: 'Auxilia a conferência de RPVs e precatórios.',
	namespace: 'http://nadameu.com.br/',
	include: [
		'/^https:\\/\\/eproc\\.(jf(pr|rs|sc)|trf4)\\.jus\\.br\\/eproc(V2|2trf4)\\/controlador\\.php\\?acao=oficio_requisitorio_beneficiarioshonorarios_editar&/',
	],
	grant: 'none',
	'run-at': 'document-start',
};
