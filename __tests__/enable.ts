// @ts-nocheck

import { accordion } from '../src/index';

document.body.innerHTML =
	`<div id="test">
		<h2 data-accordion-for="item-a">One</h2>

		<div id="item-a">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>

		<h2 data-accordion-for="item-b" data-accordion-expanded>Two</h2>

		<div id="item-b">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>
	</div>
`;

let instance = accordion('test', {
	animate: false,
	activePanelClass: 'active-panel',
	activeHeaderClass: 'active-header',
});

instance.init();

describe('disabled item can be enabled', () => {
	let item = instance.getItem(0);

	item.disable();
	item.enable();

	test('disabled property is false', () => {
		expect(item.disabled).toBe(false);
	});

	test('button aria-disabled attribute is false', () => {
		expect(item.button.getAttribute('aria-disabled')).toBe('false');
	});

	test('able to open item', () => {
		item.open();
		expect(item.active).toBe(true);
	});
});
