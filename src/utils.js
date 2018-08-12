/**
 * Wraps a number at a given value.
 *
 * @param {number} x
 * @param {array} array
 * @returns {number}
 */
export function modulo(x, array) {
	let l = array.length;
	return ((x % l) + l) % l;
}
