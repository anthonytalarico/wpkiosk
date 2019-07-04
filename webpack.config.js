var webpack = require('webpack');
var path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

var DEV_DIR = path.resolve(__dirname, 'js');
var APP_DIR = path.resolve(__dirname, 'dist/js');

var config = {
	entry: {
		init: DEV_DIR + '/init.js',
	},
	output: {
		path: APP_DIR,
		filename: '[name].js'
	},
	module: {
		rules: [
			{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
			{ test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
			},
			{
				test: /\.svg$/,
				loader: 'svg-inline-loader'
			},
			{
				test: /\.(png|jpg|gif)$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192
						}
					}
				]
			}
		]
	},
	resolve: {
		extensions: [ '.js', '.jsx' ]
	},
	externals: [
		(function() {
			var IGNORES = [ 'electron' ];
			return function(context, request, callback) {
				if (IGNORES.indexOf(request) >= 0) {
					return callback(null, "require('" + request + "')");
				}
				return callback();
			};
		})()
	],
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				uglifyOptions: {
					mangle: true,
					ecma: 8,
					warnings: true,
					output: {
						comments: false,
						beautify: false
					},
					ie8: false,
					output: {
						comments: false
					},
					keep_fnames: false,
					exclude: [ /\.min\.js$/gi ] // skip pre-minified libs
				}
			})
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				// This has effect on the react lib size
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new CompressionPlugin({
			filename: '[path].gz[query]',
			algorithm: 'gzip',
			test: /\.js$|\.css$|\.html$/,
			threshold: 10240,
			minRatio: 0
		})
	],
	cache: false,
	target: 'node',
	mode: 'development',
	watch: true
};

module.exports = config;
