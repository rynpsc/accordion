import pkg from './package.json';
import typescript from '@rollup/plugin-typescript';

export default {
	input: 'src/index.ts',
	output: [
		{
			format: 'es',
			file: pkg.module,
		},

		{
			format: 'cjs',
			file: pkg.main,
		},
	],
	plugins: [
		typescript({
			declaration: false,
			declarationDir: null,
		}),
	],
};
