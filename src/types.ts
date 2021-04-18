export type Target = number | string;

export interface EventMap {
	'open': AccordionItemEvent;
	'close': AccordionItemEvent;
	'enable': AccordionItemEvent;
	'disable': AccordionItemEvent;
	'init': CustomEvent;
	'destroy': CustomEvent;
}

export interface AccordionItemEvent extends CustomEvent {
	detail: AccordionItem;
}

export interface EventFunctionSignature {
	<K extends keyof EventMap>(type: K, listener: (event: EventMap[K]) => any): void;
}

export interface Accordion {
	/**
	 * The instance id
	 */
	id: string

	/**
	 * The root element matching the id.
	 */
	root: HTMLElement;

	/**
	 * Array of AccordionItem Objects.
	 */
	items: AccordionItem[];

	/**
	 * Gets an accordion item by either it's numerical index or id.
	 *
	 * @param target The items id or index
	 */
	getItem(target: Target): AccordionItem | undefined;

	/**
	 * Initialises the instance.
	 */
	init(): void;

	/**
	 * Restores the DOM changed in the `init` method and removes any registered event listeners added via the `on` method.
	 */
	destroy(): void;

	/**
	 * Expand an accordion item.
	 *
	 * @param target The items id or index
	 * @param options
	 */
	open(target: Target | Target[], options: OpenCloseOptions): void;

	/**
	 * Collapse an accordion item.
	 *
	 * @param target The items id or index
	 * @param options
	 */
	close(target: Target | Target[], options: OpenCloseOptions): void;

	/**
	 * Toggle the panel with the provided ID.
	 *
	 * @param target The id or index of the panel to toggle
	 * @param options
	 */
	toggle(target: Target, options: OpenCloseOptions): void;

	/**
	 * Open all panels.
	 */
	openAll(): void;

	/**
	 * Close all panels.
	 */
	closeAll(): void;

	/**
	 * Enable a panel, allowing it to be collapsed or expanded.
	 *
	 * @param target The id or index of the panel to enable
	 */
	enable(target: Target): void;

	/**
	 * Disable a panel, preventing it from being collapsed or expanded.
	 *
	 * @param target The id or index of the panel to disable
	 */
	disable(target: Target): void;

	/**
	 * Add an event listener.
	 *
	 * @param type The event type
	 * @param listener - Callback function to handle the event.
	 */
	on: EventFunctionSignature;

	/**
	 * Remove an event listener.
	 *
	 * @param type The event type
	 * @param listener - Callback function to handle the event.
	 */
	off: EventFunctionSignature;
}

export interface AccordionItem {
	/**
	 * The item id, this is the id used to link the header and panel.
	 */
	id: string;

	/**
	 * The element with the associated `data-for` attribute.
	 */
	header: HTMLElement;

	/**
	 * The element that controls the opening and closing of the associated panel.
	 */
	button: HTMLButtonElement;

	/**
	 * The element associated with the the control.
	 */
	panel: HTMLElement;

	/**
	 * Indicates if the item is open.
	 */
	active: boolean;

	/**
	 * Indicates if the item is disabled.
	 */
	disabled: boolean;

	/**
	 * Enable the item, allowing it to be opened and closed.
	 */
	enable(): void;

	/**
	 * Disable the item, disallowing it to be opened and closed.
	 */
	disable(): void;

	/**
	 * Open the items panel.
	 */
	open(options?: OpenCloseOptions): void;

	/**
	 * Close the items panel.
	 */
	close(options?: OpenCloseOptions): void;
}

export interface OpenCloseOptions {
	animate?: boolean;
}

export interface Options {
	/**
	 * Class to add to root element on initialisation.
	 */
	initialisedClass: string;

	/**
	 * Class to add to the active panel
	 */
	activePanelClass: string;

	/**
	 * Class to add to the active header.
	 */
	activeHeaderClass: string;

	/**
	 * Class to add to the generated header button.
	 */
	headerButtonClass: string;

	/**
	 * Animate the opening and closing of panels.
	 */
	animate: boolean;

	/**
	 * Allow multiple panels to be expanded at once.
	 */
	multiselect: boolean;

	/**
	 * Prefix to use for data attributes e.g data-prefix-for.
	 */
	prefix: string;
}
