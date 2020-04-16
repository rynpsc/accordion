import pkg from './package.json';

export default [
	{
		input: './src/accordion.js',
		output: [
			{
				file: pkg.module,
				format: 'es',
				sourcemap: true,
			},
			{
				file: pkg.main,
				format: 'cjs',
				sourcemap: true,
			},
		],
	},
]
