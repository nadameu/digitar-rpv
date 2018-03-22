//@ts-nocheck
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const UserscriptMeta = require('userscript-meta');
const webpack = require('webpack');

const pkg = require('./package.json');
const GenerateMetaFilePlugin = require('./lib/GenerateMetaFilePlugin');

const getMetadata = () => {
	const { name, description, version, author, userscript } = pkg;
	return Object.assign({ name, description, version, author }, userscript);
};

const defaultConfig = {
	entry: path.resolve(__dirname, pkg.main),
	module: {
		rules: [
			{ test: /\.tsx?$/, loader: 'ts-loader' },
			{
				test: /\.s?css$/,
				loader: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.html$/,
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

module.exports = config;
