import { defaults } from './defaults';
import { modulo } from './utils';
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
import { up, down } from './animate';

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

		const headers = Array.from(rootElement.querySelectorAll(`[${getPrefixedDataAttribute('for')}]`));

		headers.forEach(header => {
			if (!(header instanceof HTMLElement)) {
				return;
			}

			let item = addItem(header);

			if (item === undefined) {
				return;
			}

			if (header.getAttribute(getPrefixedDataAttribute('expanded')) !== null) {
				item.open({ animate: false });
			}

			if (header.getAttribute(getPrefixedDataAttribute('disabled')) !== null) {
				item.disable();
			}
		});

		initialised = true;

		if (config.initialisedClass) {
			rootElement.classList.add(config.initialisedClass);
		}

		emit('init');
	}

	function addItem(element: HTMLElement) {
		let id = <string>element.getAttribute(getPrefixedDataAttribute('for'));

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
			let buttonHtml = item.button.innerHTML;
			let buttonParent = <HTMLElement>item.button.parentNode;
			let { activePanelClass, activeHeaderClass } = config;

			if (activeHeaderClass) {
				item.button.classList.remove(activeHeaderClass);
			}

			if (activePanelClass) {
				item.panel.classList.remove(activePanelClass);
			}

			item.button.remove();
			buttonParent.innerHTML = buttonHtml;

			['role', 'style', 'aria-labelledby'].forEach(attribute => {
				item.panel.removeAttribute(attribute);
			});
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

	function moveFocus(index: number, relative = false) {
		let newIndex: number;

		if (!relative) {
			newIndex = index;
		} else {
			let active = document.activeElement;
			let activeIndex = items.findIndex(item => item.button === active);

			if (activeIndex === -1) {
				return false;
			}

			newIndex = activeIndex + index;
		}

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

		up(item.panel, animate);

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

		let { activePanelClass, activeHeaderClass } = config;

		if (activePanelClass) {
			item.panel.classList.remove(activePanelClass);
		}

		if (activeHeaderClass) {
			item.header.classList.remove(activeHeaderClass);
		}

		down(item.panel, animate);

		let index = activeIds.indexOf(item.id);

		if (index > -1) {
			activeIds.splice(index, 1);
		}
	}

	function onHeaderClick(event: MouseEvent, id: string) {
		toggle(id);
		event.preventDefault();
	}

	function onHeaderKeydown(event: KeyboardEvent, id: string) {
		let { key } = event;

		let keys:{ [index: string]: () => any } = {
			'ArrowUp': () => moveFocus(-1, true),
			'ArrowDown': () => moveFocus(1, true),
			'End': () => moveFocus(items.length - 1),
			'Home': () => moveFocus(0),
			'Enter': () => toggle(id),
			'Space': () => toggle(id),
		};

		if (!Object.prototype.hasOwnProperty.call(keys, key)) {
			return;
		}

		keys[key]();
		event.preventDefault();
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

	function getPrefixedDataAttribute(name: string) {
		return `data-${config.prefix}-${name}`;
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
