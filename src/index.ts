import { defaults } from './defaults';
import { getInnerHeight, modulo } from './utils';
import {
	Accordion,
	AccordionItem,
	AccordionItemEvent,
	EventFunctionSignature,
	EventMap,
	OpenCloseOptions,
	Options,
	Target,
} from './types';

export const instances: {
	[id: string]: Accordion | undefined;
} = {};

export function getInstanceById(id: string) {
	if (!(Object.prototype.hasOwnProperty.call(instances, id))) {
		return undefined;
	}

	return instances[id];
}

/**
 * @param id - The ID of the containing HTMLElement.
 * @param options
 */
export function accordion(id: string, options: Partial<Options> = {}): Accordion | undefined {
	const config = { ...defaults, ...options };

	const rootElement = <HTMLElement>document.getElementById(id);

	if (rootElement === null) {
		return;
	}

	if (getInstanceById(id)) {
		return getInstanceById(id);
	}

	let initialised = false;

	let activeIds: string[] = [];
	let items: AccordionItem[] = [];
	let events: { [id: string]: Array<(listener: AccordionItemEvent | CustomEvent) => any> } = {};

	function getItemIndex(target: Target) {
		let index: number;

		if (typeof target === 'number') {
			index = target;
		} else {
			index = items.findIndex(item => item.id === target);
		}

		return index;
	}

	function getItem(target: Target) {
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

		const headers = Array.from(rootElement.querySelectorAll('[data-for]'));

		headers.forEach(header => {
			if (!(header instanceof HTMLElement)) {
				return;
			}

			let item = addItem(header);

			if (item === undefined) {
				return;
			}

			if (header.dataset.expanded !== undefined) {
				item.open({ animate: false });
			}

			if (header.dataset.disabled !== undefined) {
				item.disable();
			}
		});

		initialised = true;
		emit('init');

		if (config.initialisedClass) {
			rootElement.classList.add(config.initialisedClass);
		}
	}

	function addItem(element: HTMLElement) {
		let id = <string>element.dataset.for;

		if (id === undefined) {
			return;
		}

		let panel = document.getElementById(id);
		let button = document.createElement('button');

		if (panel === null) {
			return;
		}

		button.type = 'button';
		button.id = `${ id }-label`;

		if (config.headerButtonClass) {
			button.className = config.headerButtonClass;
		}

		button.innerHTML = element.innerHTML;

		element.innerHTML = '';
		element.appendChild(button);

		button.setAttribute('aria-controls', id);
		button.setAttribute('aria-expanded', 'false');

		button.addEventListener('click', event => onHeaderClick(event, id));
		button.addEventListener('keydown', event => onHeaderKeydown(event, id));

		panel.style.display = 'none';
		panel.setAttribute('role', 'region');
		panel.setAttribute('aria-labelledby', `${ id }-label`);

		let item: AccordionItem = {
			id,
			panel,
			button,
			header: element,
			active: false,
			disabled: false,
			enable: () => enable(id),
			disable: () => disable(id),
			open: (options: OpenCloseOptions = {} ) => _expand(id, options),
			close: (options: OpenCloseOptions = {} ) => _collapse(id, options),
		};

		items.push(item);

		return item;
	}

	function destroy() {
		if (!initialised) {
			return;
		}

		if (config.initialisedClass) {
			rootElement.classList.remove(config.initialisedClass);
		}

		items.forEach(item => {
			let controlHtml = item.button.innerHTML;
			let controlParent = <HTMLElement>item.button.parentNode;

			if (config.activeHeaderClass) {
				item.button.classList.remove(config.activeHeaderClass);
			}

			if (config.headerButtonClass) {
				controlParent.className = item.button.className;
			}

			item.button.remove();
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

		for (let [name, handlers] of Object.entries(events)) {
			handlers.forEach(handler => off(<keyof EventMap>name, handler));

			delete events[name];
		}

		initialised = false;
	}

	function focusNext() {
		shiftFocus(1);
	}

	function focusPrevious() {
		shiftFocus(-1);
	}

	function focusFirst() {
		items[0].button.focus();
	}

	function focusLast() {
		items[items.length - 1].button.focus();
	}

	function shiftFocus(step: number) {
		let active = document.activeElement;
		let activeIndex = items.findIndex(item => item.button === active);

		if (activeIndex === -1) {
			return false;
		}

		let newIndex = activeIndex + step;

		items[modulo(newIndex, items.length)].button.focus();
	}

	function open(target: Target | Target[], options: OpenCloseOptions = {}) {
		if (!Array.isArray(target)) {
			_expand(target, options);
		} else {
			target.forEach(id => _expand(id, options));
		}
	}

	function close(target: Target | Target[], options: OpenCloseOptions = {}) {
		if (!Array.isArray(target)) {
			_collapse(target, options);
		} else {
			target.forEach(id => _collapse(id, options));
		}
	}

	function toggle(target: Target, options: OpenCloseOptions = {}) {
		let item = getItem(target);

		if (item === undefined) {
			return;
		}

		item.active ? item.close(options) : item.open(options);
	}

	function openAll() {
		items.forEach(item => item.open(<OpenCloseOptions>{ animate: false, multiselect: true }));
	}

	function closeAll() {
		items.forEach(item => item.close({ animate: false }));
	}

	function enable(target: Target) {
		let item = getItem(target);

		if (item === undefined) {
			return;
		}

		if (!emit('enable', { cancelable: true, detail: item })) {
			return;
		}

		item.disabled = false;
		item.button.setAttribute('aria-disabled', 'false');
	}

	function disable(target: Target) {
		let item = getItem(target);

		if (item === undefined) {
			return;
		}

		if (!emit('disable', { cancelable: true, detail: item })) {
			return;
		}

		item.disabled = true;
		item.button.setAttribute('aria-disabled', 'true');
	}

	function _expand(target: Target, { animate = config.animate, multiselect = config.multiselect } = {}) {
		let item = getItem(target);

		if (item === undefined || item.active || item.disabled) {
			return;
		}

		if (!emit('open', { cancelable: true, detail: item })) {
			return;
		}

		item.active = true;
		item.button.setAttribute('aria-expanded', 'true');

		let { activePanelClass, activeHeaderClass } = config;

		if (activePanelClass) {
			item.panel.classList.add(activePanelClass);
		}

		if (activeHeaderClass) {
			item.header.classList.add(activeHeaderClass);
		}

		if (!animate || !hasHeightTransition(item.panel)) {
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

	function _collapse(target: Target, { animate = config.animate } = {}) {
		let item = getItem(target);

		if (item === undefined || !item.active || item.disabled) {
			return;
		}

		if (!emit('close', { cancelable: true, detail: item })) {
			return;
		}

		item.active = false;
		item.button.setAttribute('aria-expanded', 'false');

		if (config.activePanelClass) {
			item.panel.classList.remove(config.activePanelClass);
		}

		if (config.activeHeaderClass) {
			item.header.classList.remove(config.activeHeaderClass);
		}

		if (!animate || !hasHeightTransition(item.panel)) {
			item.panel.style.display = 'none';
		} else {
			animateHeight(item.panel, item.panel.clientHeight, 0);
		}

		let index = activeIds.indexOf(item.id);

		if (index > -1) {
			activeIds.splice(index, 1);
		}
	}

	function onHeaderClick(event: MouseEvent, id: string) {
		event.preventDefault();

		toggle(id);
	}

	function onHeaderKeydown(event: KeyboardEvent, id: string) {
		let { key } = event;

		let keys:{ [index: string]: () => any } = {
			'ArrowUp': focusPrevious,
			'ArrowDown': focusNext,
			'End': focusLast,
			'Home': focusFirst,
			'Enter': () => toggle(id),
			'Space': () => toggle(id),
		};

		if (!Object.prototype.hasOwnProperty.call(keys, key)) {
			return;
		}

		keys[key]();
		event.preventDefault();
	}

	/**
	 * Test if an Element has a height transition with a non zero duration.
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

	let on: EventFunctionSignature = function(type, listener) {
		let prefixedName = getPrefixedEventName(type);

		rootElement.addEventListener(prefixedName, listener as EventListener);

		// Track event listeners to remove when calling destroy.
		(events[prefixedName] || (events[prefixedName] = [])).push(listener);
	}

	let off: EventFunctionSignature = function (type, listener) {
		rootElement.removeEventListener(getPrefixedEventName(type), listener as EventListener);
	}

	/**
	 * Dispatches an event.
	 *
	 * @param type - The event type.
	 * @param options
	 * @returns False if preventDefault() was called, true otherwise.
	 */
	function emit(type: keyof EventMap, options = {}) {
		let defaults = {
			bubbles: true,
			cancelable: false,
		};

		let event = new CustomEvent(getPrefixedEventName(type), {
			...defaults,
			...options,
		});

		return rootElement.dispatchEvent(event);
	}

	/**
	 * Returns the given event name with the event prefix.
	 *
	 * @param name The event name
	 * @returns The prefixed event name
	 */
	function getPrefixedEventName(name: string) {
		return `accordion:${name};`
	}

	return instances[id] = {
		id,
		root: rootElement,
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
