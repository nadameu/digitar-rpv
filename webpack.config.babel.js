/* global __dirname */

import CleanWebpackPlugin from 'clean-webpack-plugin';
import path from 'path';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import UserscriptMeta from 'userscript-meta';
import webpack from 'webpack';

import pkg from './package.json';
import GenerateMetaFilePlugin from './lib/GenerateMetaFilePlugin';

const getMetadata = () => {
	const { name, description, version, author, userscript } = pkg;
	return Object.assign({ name, description, version, author }, userscript);
};

const defaultConfig = {
	entry: path.resolve(__dirname, pkg.main),
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
			{ test: /\.ts$/, exclude: /node_modules/, loader: 'ts-loader' },
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				loader: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.html$/,
				exclude: /node_modules/,
				loader: ['raw-loader'],
			},
		],
	},
	optimization: {
		minimizer: [],
	},
	output: {
		filename: `${pkg.name}.user.js`,
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
	},
	plugins: [
		new webpack.BannerPlugin({
			banner: UserscriptMeta.stringify(getMetadata()),
			raw: true,
			entryOnly: true,
		}),
	],
	resolve: { extensions: ['.js', '.ts'] },
};

const devConfig = Object.assign({}, defaultConfig, {
	devServer: {
		contentBase: './dist',
	},
});

const prodConfig = Object.assign({}, defaultConfig, {
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new UglifyJsPlugin({}),
		...(defaultConfig.plugins || []),
		new GenerateMetaFilePlugin({
			filename: `${pkg.name}.meta.js`,
			metadata: getMetadata(),
		}),
	],
});

const config = (env = {}) => (env.production ? prodConfig : devConfig);

export default config;
