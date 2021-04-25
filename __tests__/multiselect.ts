// @ts-nocheck

import { accordion } from '../src/index';

document.body.innerHTML =
	`<div id="test-a">
		<h2 data-accordion-for="test-a-0">One</h2>

		<div id="test-a-0">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>

		<h2 data-accordion-for="test-a-1" data-accordion-expanded>Two</h2>

		<div id="test-a-1">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>
	</div>

	<div id="test-b">
		<h2 data-accordion-for="test-b-0">One</h2>

		<div id="test-b-0">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>

		<h2 data-accordion-for="test-b-1" data-accordion-expanded>Two</h2>

		<div id="test-b-1">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>
	</div>
`;

let instanceA = accordion('test-a', {
	multiselect: true,
});

let instanceB = accordion('test-b', {
	multiselect: false,
});

describe('when multiselect is enabled multiple items can be open at the same time', () => {
	instanceA.init();
	instanceA.open([0, 1]);

	test('item 1 is open', () => {
		expect(instanceA.getItem(0).active).toBe(true);
	});

	test('item 2 is open', () => {
		expect(instanceA.getItem(1).active).toBe(true);
	});
});

describe('when multiselect is disabled multiple items cannot be open the same time', () => {
	instanceB.init();
	instanceB.open([0, 1]);

	test('item 1 is closed', () => {
		expect(instanceB.getItem(0).active).toBe(false);
	});

	test('item 2 is open', () => {
		expect(instanceB.getItem(1).active).toBe(true);
	});
});
