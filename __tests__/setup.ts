// @ts-nocheck

import { accordion } from '../src/index';

describe('initialisation', () => {
	document.body.innerHTML =
		`<div id="test">
			<h2 data-accordion-for="item-a" data-accordion-expanded>One</h2>

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

	let options = {
		initialisedClass: 'initialised',
		headerButtonClass: 'header-button',
	};

	let instance = accordion('test', options);

	instance.init();

	test('instance is created when id is valid', () => {
		expect(instance).not.toBeUndefined();
	});

	test('instance is undefined when id is invalid', () => {
		expect(accordion('error')).toBeUndefined();
	});

	test('initialised class is added', () => {
		expect(instance.root.classList.contains(options.initialisedClass)).toBe(true);
	});

	describe.each`
		id          | label             | display    | text
		${'item-a'} | ${'item-a-label'} | ${'block'}  | ${'One'}
		${'item-b'} | ${'item-b-label'} | ${'none'} | ${'Two'}
		${'item-c'} | ${'item-c-label'} | ${'none'}  | ${'Three'}
	`('setup $id', ({id, label, display, text}) => {
		let panel = document.getElementById(id);
		let header = document.querySelector(`[data-accordion-for="${id}"]`);
		let headerChild = header.firstElementChild;

		test('panels role attribute is region', () => {
			expect(panel.getAttribute('role')).toEqual('region');
		});

		test(`panel display is '${display}'`, () => {
			expect(panel.getAttribute('style')).toEqual(`display: ${display};`);
		});

		test(`panel aria-labelledby is '${label}'`, () => {
			expect(panel.getAttribute('aria-labelledby')).toEqual(label);
		});

		test('header button added', () => {
			expect(headerChild.textContent).toEqual(text);
			expect(headerChild.tagName === 'BUTTON').toBe(true);
			expect(headerChild.classList.contains(options.headerButtonClass));
		});

		test(`header button aria-controls attribute is '${id}'`, () => {
			expect(headerChild.getAttribute('aria-controls')).toEqual(id);
		});
	});
});
