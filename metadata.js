const basePaths = [
	'eproc.jfpr.jus.br/eprocV2',
	'eproc.jfrs.jus.br/eprocV2',
	'eproc.jfsc.jus.br/eprocV2',
	'eproc.trf4.jus.br/eproc2trf4',
	(process.env.BUILD === 'development' || process.env.BUILD === 'serve') &&
		'homologa-1g1.trf4.jus.br/homologa_1g',
].filter(/** @returns {x is string} */ x => x !== false);

const acoes = [
	'oficio_requisitorio_requisicoes_editar', // Tela principal
	'oficio_requisitorio_beneficiarioshonorarios_editar', // Edição de beneficiário ou honorário
	'oficio_requisitorio_reembdeducoes_editar', // Edição de reembolsos ou deduções
];

const match = [];
for (const basePath of basePaths)
	for (const acao of acoes)
		match.push(`https://${basePath}/controlador.php?acao=${acao}&*`);

export default {
	description: 'Auxilia a conferência de RPVs e precatórios.',
	namespace: 'http://nadameu.com.br/',
	match: match,
	grant: 'none',
	'run-at': 'document-end',
};
