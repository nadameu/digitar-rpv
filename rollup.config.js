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

	// Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
	// https://rollupjs.org/guide/en#external-e-external
	external: [],

	plugins: [
		// Allows node_modules resolution
		resolve({ extensions }),

		// Allow bundling cjs modules. Rollup doesn't understand cjs
		commonjs(),

		process.env.BUILD === 'development'
			? null
			: terser({
					ecma: 8,
					compress: {
						passes: 3,
						unsafe_arrows: true,
					},
					output: {
						preamble: generateBanner(),
					},
					toplevel: true,
			  }),
		// Compile TypeScript/JavaScript files
		babel({ extensions, include: ['src/**/*'] }),

		string({
			include: ['**/*.html'],
		}),

		process.env.BUILD === 'development'
			? serve({
					open: true,
					openPage: `/${pkg.name}.user.js`,
					contentBase: 'dist',
			  })
			: null,
		postcss(),
	],

	output: [
		{
			banner: process.env.BUILD === 'development' ? generateBanner() : null,
			file: path.resolve(__dirname, 'dist', `${pkg.name}.user.js`),
			format: 'es',
		},
	],
};

function generateBanner() {
	const { name, version, description, author } = pkg;
	return stringify({
		name,
		version,
		...(description ? { description } : {}),
		author,
		...data,
	});
}
