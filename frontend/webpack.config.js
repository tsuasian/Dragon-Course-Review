'use strict'

const ExtractPlugin = require('extract-text-webpack-plugin')
const HTMLPlugin = require('html-webpack-plugin')
module.exports = {
	devtool: 'eval',
	entry: ['babel-polyfill', __dirname + '/src/main.js'],
	output: {
		filename: 'bundle-[hash].js',
		path: __dirname + '/build',
		publicPath: '/',
	},
	plugins: [
		new HTMLPlugin(),
		new ExtractPlugin('bundle-[hash].css'),
	],
	devServer: {
		    historyApiFallback: true,
	},
	module: {
		rules: [
		{
			test: /\.js$/,
			exclude: /node-module/,
			loader: 'babel-loader',
		},
		{
			test: /\.scss$/,
			loader: ExtractPlugin.extract(['css-loader', 'sass-loader']),	
		},
		{
			test:/\.(png|jpe?g|gif)$/i,
			loader: 'file-loader',
		},
		{
			test:/\.css/,
			use: ['style-loader', 'css-loader'],
		},
		],
	}
}
