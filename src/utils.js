/**
 * Wraps a number at a given value.
 *
 * @param x
 * @param array
 */
export function modulo(x, array) {
	let l = array.length;
	return ((x % l) + l) % l;
}

/**
 * Gets the height of an element, including padding.
 *
 * @param element
 * @returns The elements height
 */
export function getInnerHeight(element) {
	const style = window.getComputedStyle(element);

	let height = parseInt(style.getPropertyValue('height'), 10);
	let paddingTop = parseInt(style.getPropertyValue('padding-top'), 10);
	let paddingBottom = parseInt(style.getPropertyValue('padding-bottom'), 10);

	return height - paddingTop - paddingBottom;
}
