// @ts-nocheck

import { accordion, instances, getInstanceById } from '../src/index';

document.body.innerHTML =
	`<div id="test">
		<h2 data-accordion-for="item-a">One</h2>

		<div id="item-a">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>
	</div>
`;

accordion('test');

test('get instances object', () => {
	expect(instances).toHaveProperty('test');
});

test('get instance by id', () => {
	expect(getInstanceById('test')).not.toBeUndefined();
});
