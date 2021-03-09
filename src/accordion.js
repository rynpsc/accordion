import defaults from './defaults';
import { modulo } from './utils';

export const instances = {};

/**
 * Get the accordion instance with the corresponding ID.
 *
 * @param {string} id - ID of accordion element.
 * @returns {Object|null} Returns the instance of one is found matching the ID, null otherwise.
 */
export function getInstanceById(id) {
	if (id === undefined) {
		return null;
	}

	if (!instances.hasOwnProperty(id)) {
		return null;
	}

	return instances[id];
}

/**
 * Accordion.
 *
 * @constructor
 * @param {string} id - The ID of the containing HTMLElement.
 * @param {Object} options
 */
export function accordion(id, options) {
	const config = { ...defaults, ...options };
	const element = document.getElementById(id);

	if (!element) {
		return;
	}

	if (instances.hasOwnProperty(id)) {
		return instances[id];
	}

	const events = {};
	const items = [];
	const activeIDs = [];
	let initialised = false;

	const headers = Array.from(element.querySelectorAll('[data-for]'));

	/**
	 * Gets an accordion item by either it's numerical index or id.
	 *
	 * @returns {object|undefined}
	 * @param value
	 */
	function getItem(value) {
		let index = getItemIndex(value);

		return items[index];
	}

	/**
	 * Gets an accordion items index by either it's numerical index or id.
	 *
	 * @param {number|string} value
	 * @returns {number} Returns the value passed in if it's a number or the
	 * index of the first item with the matching ID if passed a string,
	 * -1 otherwise.
	 */
	function getItemIndex(value) {
		let index;

		if (typeof value === 'number') {
			index = value;
		} else if (typeof value === 'string') {
			index = items.findIndex(item => item.id === value);
		} else {
			new TypeError('ID must be typeof number or string.');
		}

		return index;
	}

	/**
	 * Init
	 */
	function init() {
		if (initialised) {
			return;
		}

		headers.forEach(header => {
			const id = header.dataset.for;
			const panel = document.getElementById(id);
			const control = document.createElement('button');

			control.type = 'button';
			control.id = `${ id }-label`;

			if (config.moveTriggerClass) {
				control.className = header.className;
			}

			control.innerHTML = header.innerHTML;

			header.innerHTML = '';
			header.className = '';
			header.appendChild(control);

			control.setAttribute('aria-controls', id);
			control.setAttribute('aria-expanded', 'false');

			control.addEventListener('click', onHeaderClick);
			control.addEventListener('keydown', onHeaderKeydown);

			panel.style.display = 'none';
			panel.setAttribute('role', 'region');
			panel.setAttribute('aria-labelledby', `${ id }-label`);

			let item = {
				id,
				panel,
				control,
				active: false,
				disabled: false,
			};

			items.push(item);

			if (header.dataset.expanded !== undefined) {
				open(id, { animate: false });
			}

			if (header.dataset.disabled !== undefined) {
				disable(id);
			}
		});

		initialised = true;
		emit('initialised');
		element.classList.add(config.initialisedClass);
	}

	/**
	 * Destroy accordion - removes any classes or attributes added in `init`,
	 * removes any registered event listeners, and removes the accordion instance.
	 */
	function destroy() {
		if (!initialised) {
			return;
		}

		element.classList.remove(config.initialisedClass);

		items.forEach(item => {
			const { control, panel } = item;

			control.removeAttribute('aria-controls');
			control.removeAttribute('aria-expanded');
			control.classList.remove(config.activeHeaderClass);

			if (config.moveTriggerClass) {
				control.parentNode.className = control.className;
			}

			control.parentNode.innerHTML = control.innerHTML;
			control.removeEventListener('click', onHeaderClick);
			control.removeEventListener('keydown', onHeaderKeydown);

			panel.removeAttribute('role');
			panel.removeAttribute('style');
			panel.removeAttribute('aria-labelledby');
			panel.classList.remove(config.activePanelClass);
		});

		items.length = 0;
		activeIDs.length = 0;
		delete instances[id];

		emit('destroy');

		for (const [name, handlers] of Object.entries(events)) {
			handlers.forEach(handler => off(name, handler));

			delete events[name];
		}

		initialised = false;
	}

	/**
	 * Focus the next accordion control.
	 */
	function focusNext() {
		focusPreviousOrNext(false);
	}

	/**
	 * Focus the previous accordion control.
	 */
	function focusPrevious() {
		focusPreviousOrNext(true);
	}

	/**
	 * Focus the first accordion control.
	 */
	function focusFirst() {
		items[0].control.focus();
	}

	/**
	 * Focus the last accordion control.
	 */
	function focusLast() {
		items[items.length - 1].control.focus();
	}

	/**
	 * Focuses the previous or next control, wraps around to first or last control when required.
	 *
	 * @param {boolean} previous - If true focus the previous control, otherwise focus the next.
	 */
	function focusPreviousOrNext(previous) {
		let active = document.activeElement;
		let activeIndex = items.findIndex(item => item.control === active);

		if (activeIndex === -1) {
			return false;
		}

		let newIndex = previous ? activeIndex - 1 : activeIndex + 1;

		items[modulo(newIndex, items)].control.focus();
	}

	/**
	 * Toggle the panel with the provided ID.
	 *
	 * @param id
	 * @param options
	 */
	function toggle(id, options = {}) {
		let { active } = getItem(id);

		active ? close(id, options) : open(id, options);
	}

	/**
	 * Expand an accordion item(s), by either it's index or id.
	 *
	 * @param {array|number|string} id
	 * @param {object} options
	 */
	function open(id, options = {}) {
		if (Array.isArray(id)) {
			id.forEach(id => _expand(id, options));
		} else {
			_expand(id, options);
		}
	}

	/**
	 * Collapse an accordion item(s), by either it's index or id.
	 *
	 * @param {array|number|string} ids
	 * @param {object} options
	 */
	function close(ids, options = {}) {
		if (Array.isArray(ids)) {
			ids.forEach(id => _collapse(id, options));
		} else {
			_collapse(ids, options);
		}
	}

	/**
	 * Expand all panels.
	 */
	function openAll() {
		items.forEach(item => open(item.id, {
			animate: false,
			multiselect: true,
		}));
	}

	/**
	 * Collapse all panels.
	 */
	function closeAll() {
		items.reverse().forEach(item => close(item.id, {
			animate: false,
		}));
	}

	/**
	 * Enable a panel, allowing to be collapsed or expanded.
	 *
	 * @param {number|string} id
	 */
	function enable(id) {
		let index = getItemIndex(id);
		let { control } = items[index];

		items[index].disabled = false;
		control.setAttribute('aria-disabled', false);
	}

	/**
	 * Disable a panel, preventing it from being collapsed or expanded.
	 *
	 * @param {number|string} id
	 */
	function disable(id) {
		let index = getItemIndex(id);
		let { control } = items[index];

		items[index].disabled = true;
		control.setAttribute('aria-disabled', true);
	}

	/**
	 * Expand the panel with the provided ID.
	 *
	 * @param {string} id
	 * @param animate
	 * @param multiselect
	 */
	function _expand(id, {
		animate = config.animate,
		multiselect = config.multiselect,
	} = {}) {

		let index = getItemIndex(id);
		let { active, control, panel, disabled } = items[index];

		if (active || disabled) {
			return;
		}

		if (!emit('open', {
			cancelable: true,
			detail: items[index],
		})) {
			return;
		}

		items[index].active = true;
		control.setAttribute('aria-expanded', 'true');

		panel.classList.add(config.activePanelClass);
		control.classList.add(config.activeHeaderClass);

		if (!animate) {
			panel.style.height = '';
			panel.style.display = 'block';
		} else {
			let startHeight = panel.clientHeight;

			panel.style.height = 'auto';
			panel.style.display = 'block';

			let endHeight = panel.clientHeight;

			animateHeight(panel, startHeight, endHeight);
		}

		if (!multiselect) {
			close(activeIDs, options);
		}

		activeIDs.push(id);
	}

	/**
	 * Collapse the panel with the provided ID.
	 *
	 * @param {string} id
	 */
	function _collapse(id, { animate = config.animate } = {}) {

		let index = getItemIndex(id);
		let { active, panel, control, disabled } = items[index];

		if (!active || disabled) {
			return;
		}

		if (!emit('close', {
			cancelable: true,
			detail: items[index],
		})) {
			return;
		}

		items[index].active = false;

		control.setAttribute('aria-expanded', false);

		panel.classList.remove(config.activePanelClass);
		control.classList.remove(config.activeHeaderClass);

		if (!animate) {
			panel.style.display = 'none';
		} else {
			animateHeight(panel, panel.clientHeight, 0);
		}

		{
			let index = activeIDs.indexOf(id);

			if (index > -1) {
				activeIDs.splice(index, 1);
			}
		}
	}

	/**
	 * Handles the header click event.
	 *
	 * @param {Event} event
	 */
	function onHeaderClick(event) {
		event.preventDefault();
		toggle(event.currentTarget.getAttribute('aria-controls'));
	}

	/**
	 * Handles the header keydown event.
	 *
	 * @param {Event} event
	 */
	function onHeaderKeydown(event) {
		switch (event.key) {
			case 'ArrowUp':
				focusPrevious();
				event.preventDefault();
				break;
			case 'ArrowDown':
				focusNext();
				event.preventDefault();
				break;
			case 'End':
				focusLast();
				break;
			case 'Home':
				focusFirst();
				break;
		}
	}

	/**
	 * Animates the height of an element between two values.
	 *
	 * @param {HTMLElement} element - The element to animate.
	 * @param {number} start - The start height of the element.
	 * @param {number} end - The end height of the element.
	 */
	function animateHeight(element, start, end) {
		window.requestAnimationFrame(() => {
			element.style.height = `${ start }px`;

			window.requestAnimationFrame(() => {
				element.style.height = `${ end }px`;
				element.addEventListener('transitionend', onTransitionend);
			});
		});
	}

	function onTransitionend(event) {
		if (event.propertyName !== 'height') {
			return;
		}

		const element = event.currentTarget;

		if (getInnerHeight(element) === 0) {
			element.style.display = 'none';
		}

		element.style.height = '';

		element.removeEventListener('transitionend', onTransitionend);

		function getInnerHeight(element) {
			const style = window.getComputedStyle(element);

			let height = parseInt(style.getPropertyValue('height'));
			let paddingTop = parseInt(style.getPropertyValue('padding-top'), 10);
			let paddingBottom = parseInt(style.getPropertyValue('padding-bottom'), 10);

			return height - paddingTop - paddingBottom;
		}
	}

	/**
	 * Wrapper method to add an event listener.
	 *
	 * @param {string} type - The event name.
	 * @param {Function} handler - Callback function to handle the event.
	 */
	function on(type, handler) {
		element.addEventListener(type, handler);

		// Track event listeners to remove when calling destroy.
		(events[type] || (events[type] = [])).push(handler);
	}

	/**
	 * Wrapper method to remove an event listener.
	 *
	 * @param {string} type - The event name.
	 * @param {Function} handler - Callback function to handle the event.
	 */
	function off(type, handler) {
		element.removeEventListener(type, handler);
	}

	/**
	 * Dispatches a custom event.
	 *
	 * @param {string} name - The event name.
	 * @param options
	 * @returns {boolean} False if preventDefault() was called, true otherwise.
	 */
	function emit(name, options = {}) {
		const defaultOptions = {
			bubbles: true,
			cancelable: false,
		};

		const prefixedName = `accordion:${name}`;

		let event = new CustomEvent(
			prefixedName,
			{ ...defaultOptions, ...options }
		);

		return element.dispatchEvent(event);
	}

	const instance = {
		on,
		off,
		init,
		destroy,
		open,
		close,
		toggle,
		enable,
		disable,
		openAll,
		closeAll,
	};

	return instances[id] = instance;
}
