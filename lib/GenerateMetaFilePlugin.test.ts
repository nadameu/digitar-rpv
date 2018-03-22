import GenerateMetaFilePlugin from './GenerateMetaFilePlugin';

describe('GenerateMetaFilePlugin', () => {
	it('Possui um construtor', () => {
		expect(typeof GenerateMetaFilePlugin).toBe('function');
		expect(GenerateMetaFilePlugin.prototype.constructor).toBe(
			GenerateMetaFilePlugin
		);
	});

	it('Possui um método apply', () => {
		expect(typeof GenerateMetaFilePlugin.prototype.apply).toBe('function');
	});

	it('Adiciona um plugin à fase de emissão do webpack', () => {
		const options = {
			filename: 'test.meta.js',
			metadata: {
				name: 'test',
			},
		};
		const expected = '// ==UserScript==\n// @name test\n// ==/UserScript==\n';
		const plugin = new GenerateMetaFilePlugin(options);
		const compilation: Compilation = { assets: {} };
		const compiler: Compiler = {
			hooks: {
				emit: {
					tap(pluginName: string, fn: Function) {
						expect(pluginName).toBe('GenerateMetaFilePlugin');
						expect(typeof fn).toBe('function');
						fn(compilation);
						const addedAsset = compilation.assets[options.filename];
						expect(addedAsset).not.toBeUndefined();
						const { source, size } = addedAsset;
						expect(source()).toBe(expected);
						expect(size()).toBe(expected.length);
					},
				},
			},
		};
		plugin.apply(compiler);
	});
});
