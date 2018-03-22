const { stringify } = require('userscript-meta');

export default class GenerateMetaFilePlugin {
	options: PluginOptions;

	constructor(options: PluginOptions) {
		this.options = options;
	}

	apply(compiler: Compiler) {
		const filename = this.options.filename;
		const text = stringify(this.options.metadata);
		compiler.hooks.emit.tap(
			'GenerateMetaFilePlugin',
			(compilation: Compilation) => {
				compilation.assets[filename] = {
					source: () => text,
					size: () => text.length,
				};
			}
		);
	}
}
