import { getInnerHeight, modulo } from './utils';

export const instances = {};

export function getInstanceById(id) {
	if (!Object.prototype.hasOwnProperty.call(instances, id)) {
		return undefined;
	}

	return instances[id];
}

/**
 * @param id - The ID of the containing HTMLElement.
 * @param options
 */
export function accordion(id, options = {}) {
	const config = { ...{
		initialisedClass: '',
		activePanelClass: '',
		activeTriggerClass: '',
		triggerClass: true,
		animate: true,
		multiselect: true,
	}, ...options };

	const element = document.getElementById(id);

	if (!element) {
		return;
	}

	if (getInstanceById(id)) {
		return getInstanceById(id);
	}

	let initialised = false;

	const events = {};

	const items = [];
	const activeIds = [];

	/**
	 * Gets an accordion items index by either it's numerical index or id.
	 *
	 * @param target The items id or index
	 * @returns The value passed in if it's a number or the
	 * index of the first item with the matching ID if passed a string,
	 * -1 otherwise.
	 */
	 function getItemIndex(target) {
		let index;

		if (typeof target === 'number') {
			index = target;
		} else {
			index = items.findIndex(item => item.id === target);
		}

		return index;
	}

	/**
	 * Gets an accordion item by either it's numerical index or id.
	 *
	 * @param target The items id or index
	 */
	function getItem(target) {
		let index = getItemIndex(target);

		if (index === -1) {
			return undefined;
		}

		return items[index];
	}

	function init() {
		if (initialised) {
			return;
		}

		const headers = Array.from(element.querySelectorAll('[data-for]'));

		headers.forEach(header => {
			if (!(header instanceof HTMLElement)) {
				return;
			}

			let item = addItem(header);

			if (header.dataset.expanded !== undefined) {
				item.open({ animate: false });
			}

			if (header.dataset.disabled !== undefined) {
				item.disable();
			}
		});

		initialised = true;
		emit('initialised');

		if (config.initialisedClass) {
			element.classList.add(config.initialisedClass);
		}
	}

	function addItem(element) {
		let id = element.dataset.for;
		let panel = document.getElementById(id);
		let control = document.createElement('button');

		control.type = 'button';
		control.id = `${ id }-label`;

		if (config.triggerClass === true) {
			control.className = element.className;
			element.className = '';
		} else if (typeof config.triggerClass === 'string') {
			control.className = config.triggerClass;
		}

		control.innerHTML = element.innerHTML;

		element.innerHTML = '';
		element.appendChild(control);

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
			enable: () => enable(id),
			disable: () => disable(id),
			open: (options) => _expand(id, options),
			close: (options) => _collapse(id, options),
		};

		items.push(item);

		return item;
	}

	/**
	 * Removes any classes or attributes added in `init` and removes any
	 * registered event listeners added via the `on` method.
	 */
	function destroy() {
		if (!initialised) {
			return;
		}

		if (config.initialisedClass) {
			element.classList.remove(config.initialisedClass);
		}

		items.forEach(item => {
			let controlHtml = item.control.innerHTML;
			let controlParent = item.control.parentNode;

			if (config.activeTriggerClass) {
				item.control.classList.remove(config.activeTriggerClass);
			}

			if (config.triggerClass === true) {
				controlParent.className = item.control.className;
			}

			item.control.remove();
			controlParent.innerHTML = controlHtml;

			['role', 'style', 'aria-labelledby'].forEach(attribute => {
				item.panel.removeAttribute(attribute);
			});

			if (config.activePanelClass) {
				item.panel.classList.remove(config.activePanelClass);
			}
		});

		items.length = 0;
		activeIds.length = 0;

		delete instances[id];

		emit('destroy');

		for (const [ name, handlers ] of Object.entries(events)) {
			handlers.forEach(handler => off(name, handler));

			delete events[name];
		}

		initialised = false;
	}

	/**
	 * Focus the next accordion control.
	 */
	function focusNext() {
		shiftFocus(1);
	}

	/**
	 * Focus the previous accordion control.
	 */
	function focusPrevious() {
		shiftFocus(-1);
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
	 * Shifts focus by the given amount relative to the currently focused control.
	 *
	 * @param step
	 */
	function shiftFocus(step) {
		let active = document.activeElement;
		let activeIndex = items.findIndex(item => item.control === active);

		if (activeIndex === -1) {
			return false;
		}

		let newIndex = activeIndex + step;

		items[modulo(newIndex, items)].control.focus();
	}

	/**
	 * Expand an accordion item.
	 *
	 * @param target The items id or index
	 * @param options
	 */
		 function open(target, options = {}) {
			if (!Array.isArray(target)) {
				_expand(target, options);
			} else {
				target.forEach(id => _expand(id, options));
			}
		}

		/**
		 * Collapse an accordion item.
		 *
		 * @param target The items id or index
		 * @param options
		 */
		function close(target, options = {}) {
			if (!Array.isArray(target)) {
				_collapse(target, options);
			} else {
				target.forEach(id => _collapse(id, options));
			}
		}

	/**
	 * Toggle the panel with the provided ID.
	 *
	 * @param target The id or index of the panel to toggle
	 * @param options
	 */
	function toggle(target, options = {}) {
		let item = getItem(target);

		if (item === undefined) {
			return;
		}

		item.active ? item.close(options) : item.open(options);
	}

	/**
	 * Open all panels.
	 */
	function openAll() {
		items.forEach(item => item.open({ animate: false, multiselect: true }));
	}

	/**
	 * Close all panels.
	 */
	function closeAll() {
		items.forEach(item => item.close({ animate: false }));
	}

	/**
	 * Enable a panel, allowing it to be collapsed or expanded.
	 *
	 * @param target The id or index of the panel to enable
	 */
	function enable(target) {
		let item = getItem(target);

		if (item === undefined) {
			return;
		}

		if (!emit('enable', { cancelable: true, detail: item })) {
			return;
		}

		item.disabled = false;
		item.control.setAttribute('aria-disabled', 'false');
	}

	/**
	 * Disable a panel, preventing it from being collapsed or expanded.
	 *
	 * @param target The id or index of the panel to disable
	 */
	function disable(target) {
		let item = getItem(target);

		if (item === undefined) {
			return;
		}

		if (!emit('disable', { cancelable: true, detail: item })) {
			return;
		}

		item.disabled = true;
		item.control.setAttribute('aria-disabled', 'true');
	}

	/**
	 * Expand the panel with the provided ID.
	 *
	 * @param target
	 * @param animate
	 * @param multiselect
	 */
	function _expand(target, { animate = config.animate, multiselect = config.multiselect } = {}) {
		let item = getItem(target);

		if (item === undefined || item.active || item.disabled) {
			return;
		}

		if (!emit('open', { cancelable: true, detail: item })) {
			return;
		}

		item.active = true;
		item.control.setAttribute('aria-expanded', 'true');

		if (config.activePanelClass) {
			item.panel.classList.add(config.activePanelClass);
		}

		if (config.activeTriggerClass) {
			item.control.classList.add(config.activeTriggerClass);
		}

		if (!animate) {
			item.panel.style.height = '';
			item.panel.style.display = 'block';
		} else {
			let startHeight = item.panel.clientHeight;

			item.panel.style.height = 'auto';
			item.panel.style.display = 'block';

			let endHeight = item.panel.clientHeight;

			animateHeight(item.panel, startHeight, endHeight);
		}

		if (!multiselect) {
			close(activeIds, options);
		}

		activeIds.push(item.id);
	}

	/**
	 * Collapse the panel with the provided ID.
	 *
	 * @param target
	 */
	function _collapse(target, { animate = config.animate } = {}) {
		let item = getItem(target);

		if (item === undefined || !item.active || item.disabled) {
			return;
		}

		if (!emit('close', { cancelable: true, detail: item })) {
			return;
		}

		item.active = false;
		item.control.setAttribute('aria-expanded', 'false');

		if (config.activePanelClass) {
			item.panel.classList.remove(config.activePanelClass);
		}

		if (config.activeTriggerClass) {
			item.control.classList.remove(config.activeTriggerClass);
		}

		if (!animate) {
			item.panel.style.display = 'none';
		} else {
			animateHeight(item.panel, item.panel.clientHeight, 0);
		}

		let index = activeIds.indexOf(item.id);

		if (index > -1) {
			activeIds.splice(index, 1);
		}
	}

	/**
	 * Handles the header click event.
	 *
	 * @param event
	 */
	function onHeaderClick(event) {
		event.preventDefault();
		toggle(event.currentTarget.getAttribute('aria-controls'));
	}

	/**
	 * Handles the header keydown event.
	 *
	 * @param event
	 */
	function onHeaderKeydown(event) {
		let { key } = event;

		let keys = {
			'ArrowUp': focusPrevious,
			'ArrowDown': focusNext,
			'End': focusLast,
			'Home': focusFirst,
		};

		if (!Object.prototype.hasOwnProperty.call(keys, key)) {
			return;
		}

		keys[key]();
		event.preventDefault();
	}

	/**
	 * Animates the height of an element between two values.
	 *
	 * @param element - The element to animate.
	 * @param start - The start height of the element.
	 * @param end - The end height of the element.
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
	 * Wrapper method to add an event listener.
	 *
	 * @param type - The event name.
	 * @param handler - Callback function to handle the event.
	 */
	function on(type, handler) {
		let prefixedName = getPrefixedEventName(type);

		element.addEventListener(prefixedName, handler);

		// Track event listeners to remove when calling destroy.
		(events[prefixedName] || (events[prefixedName] = [])).push(handler);
	}

	/**
	 * Wrapper method to remove an event listener.
	 *
	 * @param type - The event name.
	 * @param handler - Callback function to handle the event.
	 */
	function off(type, handler) {
		element.removeEventListener(getPrefixedEventName(type), handler);
	}

	/**
	 * Dispatches a custom event.
	 *
	 * @param name - The event name.
	 * @param options
	 * @returns False if preventDefault() was called, true otherwise.
	 */
	function emit(name, options = {}) {
		const defaults = {
			bubbles: true,
			cancelable: false,
		};

		let event = new CustomEvent(getPrefixedEventName(name), {
			...defaults,
			...options,
		});

		return element.dispatchEvent(event);
	}

	/**
	 * Returns the given event name with the event prefix.
	 *
	 * @param name The event name
	 * @returns The prefixed event name
	 */
	function getPrefixedEventName(name) {
		return `accordion:${name};`
	}

	return instances[id] = {
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
		getItem,
		items,
	};
}
