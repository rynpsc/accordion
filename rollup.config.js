import pkg from './package.json';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

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
		terser(),
		typescript({
			declaration: false,
			declarationDir: null,
		}),
	],
};
