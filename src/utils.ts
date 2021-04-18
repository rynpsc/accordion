/**
 * Wraps a number at a given value.
 *
 * @param x Value to wrap
 * @param n The maximum value
 */
 export function modulo(x: number, n: number) {
	return ((x % n) + n) % n;
}
