export function animateOpen(element: HTMLElement, animate = true) {
	if (!animate || !hasHeightTransition(element)) {
		element.style.height = '';
		element.style.display = 'block';
	} else {
		let startHeight = element.clientHeight;

		element.style.height = 'auto';
		element.style.display = 'block';

		let endHeight = element.clientHeight;

		animateHeight(element, startHeight, endHeight);
	}
}

export function animateClose(element: HTMLElement, animate = true) {
	if (!animate || !hasHeightTransition(element)) {
		element.style.display = 'none';
	} else {
		animateHeight(element, getInnerHeight(element), 0);
	}
}

/**
 * Test if an Element has a height transition with a non zero duration.
 *
 * A panel may not have a CSS height transition set or its duration may be
 * zero. In these scenarios either the transitionEnd event is not fired,
 * event.propertyName is never equal to ‘height’, or the event may be fired
 * before we can catch it. We therefore need to check that the panel
 * will animate.
 */
function hasHeightTransition(element: Element) {
	let style = window.getComputedStyle(element);
	let property = style.getPropertyValue('transition-property');
	let duration = parseFloat(style.getPropertyValue('transition-duration'));

	return duration > 0 && ['all', 'height'].includes(property);
}

/**
 * Animates the height of an element between two values.
 *
 * @param element - The element to animate.
 * @param start - The start height of the element.
 * @param end - The end height of the element.
 */
function animateHeight(element: HTMLElement, start: number, end: number) {
	window.requestAnimationFrame(() => {
		element.style.height = `${ start }px`;

		window.requestAnimationFrame(() => {
			element.style.height = `${ end }px`;
			element.addEventListener('transitionend', onTransitionend);
		});
	});
}

function onTransitionend(event: TransitionEvent) {
	if (event.propertyName !== 'height') {
		return;
	}

	let element = event.currentTarget;

	if (!(element instanceof HTMLElement)) {
		return;
	}

	if (getInnerHeight(element) === 0) {
		element.style.display = 'none';
	}

	element.style.height = '';

	element.removeEventListener('transitionend', onTransitionend);
}

/**
 * Gets the height of an element, including padding.
 *
 * @param element
 * @returns The elements height
 */
function getInnerHeight(element: HTMLElement) {
	let style = window.getComputedStyle(element);

	let height = parseInt(style.getPropertyValue('height'), 10);
	let paddingTop = parseInt(style.getPropertyValue('padding-top'), 10);
	let paddingBottom = parseInt(style.getPropertyValue('padding-bottom'), 10);

	return height - paddingTop - paddingBottom;
}
