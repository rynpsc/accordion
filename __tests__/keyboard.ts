// @ts-nocheck

import { accordion } from '../src/index';

document.body.innerHTML =
	`<div id="test">
		<h2 data-accordion-for="item-a">One</h2>

		<div id="item-a">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>

		<h2 data-accordion-for="item-b">Two</h2>

		<div id="item-b">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>

		<h2 data-accordion-for="item-c">Three</h2>

		<div id="item-c">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>
	</div>
`;

let instance = accordion('test');

instance.init();

let [ a, b, c ] = instance.items;

function simulateKeydown(element, key) {
	element.dispatchEvent(new KeyboardEvent('keydown', { key }));
}

test('cycle focus through items via "ArrowDown"', () => {
	a.button.focus();

	simulateKeydown(a.button, 'ArrowDown');
	expect(document.activeElement).toEqual(b.button);

	simulateKeydown(b.button, 'ArrowDown');
	expect(document.activeElement).toEqual(c.button);

	simulateKeydown(c.button, 'ArrowDown');
	expect(document.activeElement).toEqual(a.button);
});

test('cycle focus through items via "ArrowUp"', () => {
	c.button.focus();

	simulateKeydown(c.button, 'ArrowUp');
	expect(document.activeElement).toEqual(b.button);

	simulateKeydown(b.button, 'ArrowUp');
	expect(document.activeElement).toEqual(a.button);

	simulateKeydown(a.button, 'ArrowUp');
	expect(document.activeElement).toEqual(c.button);
});

test('move focus to first item via "Home" key', () => {
	c.button.focus();

	simulateKeydown(c.button, 'Home');
	expect(document.activeElement).toEqual(a.button);
});

test('move focus to last item via "End" key', () => {
	a.button.focus();

	simulateKeydown(a.button, 'End');
	expect(document.activeElement).toEqual(c.button);
});

test('toggle display via "Enter" or "Space" key', () => {
	a.button.focus();
	instance.close(0);

	simulateKeydown(a.button, 'Enter');
	expect(a.active).toBe(true);

	simulateKeydown(a.button, 'Space');
	expect(a.active).toBe(false);
});
