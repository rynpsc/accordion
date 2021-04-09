export type Target = number | string;

export interface EventMap {
	'open': AccordionItemEvent;
	'close': AccordionItemEvent;
	'enable': AccordionItemEvent;
	'disable': AccordionItemEvent;
	'create': CustomEvent;
	'destroy': CustomEvent;
}

export interface AccordionItemEvent extends CustomEvent {
	detail: AccordionItem;
}

export interface Accordion {
	init(): void;
	destroy(): void;
	items: AccordionItem[];

	/**
	 * Add an event listener.
	 *
	 * @param type The event type
	 * @param listener - Callback function to handle the event.
	 */
	on<K extends keyof EventMap>(type: K, listener: (event: EventMap[K]) => any): void;

	/**
	 * Remove an event listener.
	 *
	 * @param type The event type
	 * @param listener - Callback function to handle the event.
	 */
	off<K extends keyof EventMap>(type: K, listener: (event: EventMap[K]) => any): void;

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
	 * Open all panels.
	 */
	openAll(): void;

	/**
	 * Close all panels.
	 */
	closeAll(): void;

	/**
	 * Gets an accordion item by either it's numerical index or id.
	 *
	 * @param target The items id or index
	 */
	getItem(target: Target): AccordionItem | undefined;
}

export interface AccordionItem {
	/**
	 * The item id, this is the id used to link the header and panel
	 */
	id: string;

	/**
	 * The element that controls the opening and closing of the associated panel
	 */
	control: HTMLButtonElement;

	/**
	 * The element associated with the the control
	 */
	panel: HTMLElement;

	/**
	 * Indicates if the item is open
	 */
	active: boolean;

	/**
	 * Indicates if the item is disabled
	 */
	disabled: boolean;

	/**
	 * Enable the item
	 */
	enable(): void;

	/**
	 * Disable the item
	 */
	disable(): void;

	/**
	 * Open the item
	 */
	open(options?: OpenCloseOptions): void;

	/**
	 * Close the item
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
	 * Class to add active panel
	 */
	activePanelClass: string;

	/**
	 * Class to add to active trigger.
	 */
	activeTriggerClass: string;

	/**
	 * Class to add to the generated header button.
	 */
	triggerClass: true | string | undefined;

	/**
	 * Animate the opening and closing of panels.
	 */
	animate: boolean;

	/**
	 * Allow multiple panels to expanded at once.
	 */
	multiselect: boolean;
}
