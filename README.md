# Accordion

![npm version](https://img.shields.io/npm/v/@rynpsc/accordion)
![npm bundle size (minified and gziped)](https://img.shields.io/bundlephobia/minzip/@rynpsc/accordion?label=size)

## Install

```
$ npm install @rynpsc/accordion
```

## Getting Started

### HTML

The accordion library tries to impose as few structural HTML requirements as possible. The minimum required HTML structure is as follows:

1. A containing element with a valid `id` attribute.
2. Pairs of header and panel elements whose relationship is described by the `data-for` attribute on the header element, its value is the `id` of the related panel.

```html
<div id="example">
  <h2 data-for="panel-one">Panel One</h2>
  <div id="panel-one">...</div>

  <h2 data-for="panel-two">Panel Two</h2>
  <div id="panel-two">...</div>
</div>
```

### JavaScript

The [`accordion`](#accordionid-options) constructor takes two parameters:

- id - The ID of the containing element
- options - Configuration Object [(see options)](#options) (optional)

```js
import { accordion } from '@rynpsc/accordion';

let instance = accordion('example', {
  multiselect: true,
});

if (instance) {
  instance.init();
}
```

### CSS

The library takes care of hiding and showing panels via display `none` and `block`.

### Animation

To enable animating the opening and closing of a panel set the `animate` option to `true` and add a CSS height transition to the panel.

```css
.panel {
  transition: height 200ms ease-in-out;
}
```

#### Padding and Animation

To animate a panel that has padding it is recommended to apply the padding to a child element.

```html
<div class="panel" id="panel-one">
  <div class="panel-inner"></div>
</div>
```

```css
.panel {
  transition: height 200ms ease-in-out;
}

.panel-inner {
  padding: 20px;
}
```

## API

### accordion(id, options)

- id: `string`
- options: [`Options`](#options)
- Returns: <code><a href="#accordion-1">Accordion</a> | undefined</code>

Creates an [`Accordion`](#accordion-1) instance.

If the passed in `id` doesn't match an element in the DOM,` undefined` is returned. It is therefore recommended to add a check before calling any properties or methods.

```js
import { accordion } from '@rynpsc/accordion';

let instance = accordion('example', options);

if (instance) {
  instance.init();
}
```

### instances

An Object containing all the current [`Accordion`](#accordion-1) instances indexed by the containing elements `id`.

```js
import { instances } from '@rynpsc/accordion';

for (let [ id, instance ] of Object.entries(instances)) {
  console.log(id, instance);
}
```

### getInstanceById(id)

Helper method for getting an [`Accordion`](#accordion-1) instance by its `id`.

- id: `string`
- Returns: <code><a href="#accordion-1">Accordion</a> | undefined</code>

```js
import { getInstanceById } from '@rynpsc/accordion';

let instance = getInstanceById('accordion');

if (instance) {
  instance.openAll();
}
```

## Accordion

### init()

Initialises the instance.

- Returns: `void`

```js
instance.init();
```

If calling `init` after calling `destroy` any event listeners will need to be re-registered.

### destroy()

Restores the DOM changed in the `init` method and removes any registered event listeners added via the `on` method.

- Returns: `void`

```js
instance.destroy();
```

### id

The `id` passed into the `accordion` constructor.

- Type: `string`

### root

The element that matches the `id` passed into the `accordion` constructor.

- Type: `HTMLElement`

### items

An Array of [`AccordionItem`](#accordionitem) Objects.

### getItem(target)

Gets an accordion item by either its numerical index or id.

- target: `string | number`
- Returns: <code><a href="#accordionitem">AccordionItem</a> | undefined</code>

```ts
instance.getItem('panel-one');
```

### open(target, options)

Open a panel by either its numerical index or ID.

- target: `string | number`
- options `Object`
  - `animate` - Animate the height, by default is the same as the global `animate` option.

```js
instance.open(0);

instance.open('panel-one', {
  animate: true
});
```

An array can also be provided to open multiple panels.

```js
instance.open(['panel-one', 'panel-two']);
```

### close(target, options)

Close a panel by either its numerical index or ID.

- target: `string | number`
- options `Object`
  - `animate` - Animate the height, by default is the same as the global `animate` option.

```js
instance.close(0);

instance.open('panel-one', {
  animate: true
});
```

An array can also be provided to close multiple panels.

```js
instance.close(['panel-one', 'panel-two']);
```

### toggle(target, options)

Toggle a panel between opened and closed by either its numerical index or ID.

- target: `string | number`
- options `Object`
  - `animate` - Animate the height, by default is the same as the global `animate` option.

```js
instance.toggle(0);

instance.toggle('panel-one', {
  animate: true
});
```

### openAll()

Open all panels.

```js
instance.openAll();
```

### closeAll()

Close all panels.

```js
instance.closeAll();
```

### enable()

Enable a panel, allowing it to be opened and closed.

```js
instance.enable('panel-one');
```

### disable()

Disable a panel, preventing it from being opened and closed.

```js
instance.disable('panel-one');
```

### on(type, listener)

Adds an event listener, see [events](#events).

```js
instance.on('open', function(event) {
  console.log(event.detail);
});
```

### off(type, listener)

Removes an event listener, see [events](#events).

```js
instance.off('open', function(event) {
  console.log(event.detail);
});
```

## AccordionItem

A header panel pair is represented by an [`AccordionItem`](#accordionitem).

```js
let item = instance.getItemById('panel-one');

item?.open({ animate: true });
```

### id

The item id, this is the id used to link the header and panel.

- Type: `string`

### panel

The element that controls the opening and closing of the associated panel.

- Type: `HTMLElement`

### control

The element associated with the control.

- Type: `HTMLButtonElement`

### active

Indicates if the item is open.

- Type: `boolean`

### disabled

Indicates if the item is disabled.

- Type: `boolean`

### enable()

Enable the item, allowing it to be opened and closed.

- Returns: `void`

### disable()

Disable the item, disallowing it to be opened and closed.

- Returns: `void`

### open(options)

Open the items panel.

- Returns: `void`

#### Options:

- `animate: boolean`

### close(options)

Close the items panel.

- Returns: `void`

#### Options:

- `animate: boolean`

## Options

### initialisedClass

Class to add to root element on initialisation.

- Type: `string | undefined`
- Default: `''`
  
### activePanelClass
  
Class to add to the active panel.

- Type: `string`
- Default: `''`
  
### activeHeaderClass

Class to add to the active header.

- Type: `string`
- Default: `''`

### triggerClass

Class to add to the generated header button.

- Type: `string`
- Default: `''`

### animate

Animate the opening and closing of panels.

- Type: `boolean`
- Default: `true`

### multiselect

Allow multiple panels to be expanded at once.

- Type: `boolean`
- Default: `true`

## Events

Events are handled via the [CustomEvent API](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent). For some events additional event information is available via `event.detail`.

| Name     | Description                                | Detail                            | Cancelable  |
| :--------| :----------------------------------------- | :-------------------------------- | :---------- |
| open     | Dispatched when a panel is opened          | [`AccordionItem`](#accordionitem) | Yes         |
| close    | Dispatched when a panel is closed          | [`AccordionItem`](#accordionitem) | Yes         |
| enable   | Dispatched when a panel is enabled         | [`AccordionItem`](#accordionitem) | Yes         |
| disable  | Dispatched when a panel is disabled        | [`AccordionItem`](#accordionitem) | Yes         |
| create   | Dispatched when the accordion is created   | `null`                            | No          |
| destroy  | Dispatched when the accordion is destroyed | `null`                            | No          |

```js
instance.on('open', function(event) {
  console.log(event.detail.active) // true
})
```

### Canceling Events

Cancelable events can be canceled by calling `event.preventDefault()`.

```js
instance.on('open', function(event) {
  event.preventDefault();
});
```

## Requirements

This package is distributed in commonjs, umd and ES module format. It is written in ES2020 syntax and requires the following browser APIs:

- CustomEvent
- Element.classList
- HTMLOrForeignElement.dataset
- Element​.query​SelectorAll
- Window.requestAnimation

## License

MIT
