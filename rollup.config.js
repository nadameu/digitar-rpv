import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import { string } from 'rollup-plugin-string';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript';
import { stringify } from 'userscript-meta';
import data from './metadata';
import pkg from './package.json';

const IS_SERVE = process.env.BUILD === 'serve';
const IS_DEVELOPMENT = IS_SERVE || process.env.BUILD === 'development';
const IS_PRODUCTION = !IS_DEVELOPMENT;

export default {
	input: './src/index.ts',

	external: [],

	plugins: [
		resolve(),

		typescript(),

		terser({
			ecma: 8,
			compress: IS_PRODUCTION && {
				passes: 5,
				unsafe_arrows: true,
			},
			mangle: IS_PRODUCTION,
			output: {
				preamble: generateBanner(),
				beautify: IS_DEVELOPMENT,
			},
			toplevel: true,
		}),

		string({
			include: ['**/*.html'],
		}),

		IS_SERVE &&
			serve({
				open: true,
				openPage: `/${pkg.name}.user.js`,
				contentBase: 'dist',
			}),
		postcss(),
	],

	inlineDynamicImports: true,

	output: [
		{
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
