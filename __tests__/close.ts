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

describe('open item can be closed', () => {
	let item = instance.getItem(0);

	instance.open(0);
	instance.close(0);

	test('active property is false', () => {
		expect(item.active).toBe(false);
	});

	test('button aria-expanded attribute is "false"', () => {
		expect(item.button.getAttribute('aria-expanded')).toBe('false');
	});

	test('header active class is removed', () => {
		expect(item.header.className).toBe('');
	});

	test('panel active class is removed', () => {
		expect(item.panel.className).toBe('');
	});

	test('panel display style is "none"', () => {
		expect(item.panel.getAttribute('style')).toBe('display: none;');
	});
});
