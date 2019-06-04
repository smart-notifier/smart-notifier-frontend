const react = require('@neutrinojs/react');
const merge = require('babel-merge');

module.exports = {
	options: {
		root: __dirname,
	},
	use: [
		react({
			html: {
				title: 'Smart Notifier - Easily get automated notifications from freelance websites.',
				template: 'src/static/index.html'
			},
			devServer: {
				port: 5001,
				proxy: {
					'/api': 'http://localhost:8080',
				}
			}
		}),
		(neutrino) => neutrino.config
			.plugin("copy")
			.use(require.resolve('copy-webpack-plugin'), [
				[
					{
						from: 'src/static',
						to: '',
					}
				],
				{
					debug: neutrino.options.debug,

				}
			]),
		(neutrino) => neutrino.config.module //needed because of how neutrino handles plugin configuration
			.rule('compile')
			.use('babel')
			.tap(options => merge({
				plugins: [
					[require.resolve('@babel/plugin-proposal-decorators'), {legacy: true}],
					[require.resolve('@babel/plugin-proposal-class-properties'), {loose: true}],
					require.resolve('@babel/plugin-transform-classes'),
					[require.resolve('@babel/plugin-transform-regenerator'), {asyncGenerators: false}],
					require.resolve('@babel/plugin-transform-runtime'),
				]
			}, options)),
		(neutrino) => neutrino.config.module
			.rule("file")
			.test(/\.(mp3)(\?v=\d+\.\d+\.\d+)?$/)
			.use('mp3')
			.loader('file-loader')

	],
};
