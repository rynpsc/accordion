/**
 * Wraps a number at a given value.
 *
 * @param x Value to wrap
 * @param n The maximum value
 */
 export function modulo(x: number, n: number) {
	return ((x % n) + n) % n;
}

/**
 * Gets the height of an element, including padding.
 *
 * @param element
 * @returns The elements height
 */
export function getInnerHeight(element: HTMLElement) {
	let style = window.getComputedStyle(element);

	let height = parseInt(style.getPropertyValue('height'), 10);
	let paddingTop = parseInt(style.getPropertyValue('padding-top'), 10);
	let paddingBottom = parseInt(style.getPropertyValue('padding-bottom'), 10);

	return height - paddingTop - paddingBottom;
}
