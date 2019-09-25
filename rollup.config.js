import path from 'path';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { string } from 'rollup-plugin-string';
import { terser } from 'rollup-plugin-terser';
import { stringify } from 'userscript-meta';
import data from './metadata';
import pkg from './package.json';
import serve from 'rollup-plugin-serve';
import postcss from 'rollup-plugin-postcss';

const extensions = ['.js', '.ts'];

export default {
	input: './src/index.ts',

	external: [],

	plugins: [
		resolve({ extensions }),

		commonjs(),

		process.env.BUILD !== 'development' &&
			process.env.BUILD !== 'serve' &&
			terser({
				ecma: 8,
				compress: {
					passes: 5,
					unsafe_arrows: true,
				},
				output: {
					preamble: generateBanner(),
				},
				toplevel: true,
			}),

		babel({ extensions, include: ['src/**/*'] }),

		string({
			include: ['**/*.html'],
		}),

		process.env.BUILD === 'serve' &&
			serve({
				open: true,
				openPage: `/${pkg.name}.user.js`,
				contentBase: 'dist',
			}),
		postcss(),
	],

	output: [
		{
			banner:
				(process.env.BUILD === 'development' ||
					process.env.BUILD === 'serve') &&
				generateBanner(),
			file: path.resolve(__dirname, 'dist', `${pkg.name}.user.js`),
			format: 'es',
		},
	],
};

function generateBanner() {
	const { name, version, description, author } = pkg;
	return stringify({
		name,
		...(description ? { 'name:pt-BR': description } : {}),
		version,
		author,
		...data,
	});
}
