// @ts-nocheck

import { accordion } from '../src/index';

document.body.innerHTML =
	`<div id="test">
		<h2 data-accordion-for="item-a">One</h2>

		<div id="item-a">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>
	</div>
`;

let instance = accordion('test');

test('init event is triggered', () => {
	let handler = jest.fn();
	instance.on('init', handler);
	instance.init();
	expect(handler).toBeCalledTimes(1);
});

test('open event is triggered', () => {
	let handler = jest.fn();
	instance.on('open', handler);
	instance.close(0);
	instance.open(0);
	expect(handler).toBeCalledTimes(1);
});

test('close event is triggered', () => {
	let handler = jest.fn();
	instance.on('close', handler);
	instance.open(0);
	instance.close(0);
	expect(handler).toBeCalledTimes(1);
});

test('enable event is triggered', () => {
	let handler = jest.fn();
	instance.on('enable', handler);
	instance.disable(0);
	instance.enable(0);
	expect(handler).toBeCalledTimes(1);
});

test('disable event is triggered', () => {
	let handler = jest.fn();
	instance.on('disable', handler);
	instance.enable(0);
	instance.disable(0);
	expect(handler).toBeCalledTimes(1);
});

test('destroy event is triggered', () => {
	let handler = jest.fn();
	instance.on('destroy', handler);
	instance.init();
	instance.destroy(0);
	expect(handler).toBeCalledTimes(1);
});
