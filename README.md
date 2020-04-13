# Accordion

## Install

```
$ npm install @rynpsc/accordion
```

## Usage

### HTML

Accordion imposes following markup requirements:

1. A containing element with an unique `id`.
2. Pairs of header, panel elements linked via a `data-for` attribute on the header whose value is set to the `id` of the related panel.

The following example shows the minimum required markup.

```html
<div id="accordion">
  <h2 data-for="panel-one">Panel One</h2>
  <div id="panel-one">...</div>

  <h2 data-for="panel-two">Panel Two</h2>
  <div id="panel-two">...</div>
</div>
```

### JavaScript

The `accordion` constructor takes two parameters:

- `id` - The ID of the element
- `options` -  Configuration Object [(see options)](#options)

```js
import { accordion } from '@rynpsc/accordion';

const accordion = accordion('accordion', options);

if (accordion) {
  accordion.create();
}
```

#### Padding and Animation

To animate a panel that has padding it is recommended to apply the padding to a child element.

```html
<div id="panel-two">
  <div class="panel"></div>
</div>
```

```css
.panel {
  padding: 10px
}
```

## Options

```javascript
{
  /**
   * Class to add to root element on initialisation.
   */
  initialisedClass: 'accordion--initialised',
  
  /**
   * Class to add active panel.
   */
  activePanelClass: 'accordion-panel--active',
  
  /**
   * Class to add to active header.
   */
  activeHeaderClass: 'accordion-header--active',
  
  /**
   * Animate the opening and closing of panels.
   */
  animate: true,
  
  /**
   * Allow multiple panels to expanded at once.
   */
  multiselect: true,
}
```

## API

###  `accordrion(id: string, options: Object)`

Creates an accordion instance.

#### `init()`

```js
accordion.init();
```

#### `destroy()`

```js
accordion.destroy();
```

#### `open()`

Open panels by either their numerical index or ID.

```js
accordion.open(0);

accordion.open('panel-one');
```

An array can also be provided to open multiple panels.

```js
accordion.open(['panel-one', 'panel-two']);
```

#### `close()`

Close panels by either their numerical index or ID.

```js
accordion.close(0);

accordion.close('panel-one');
```

An array can also be provided to close multiple panels.

```js
accordion.close(['panel-one', 'panel-two']);
```

#### `toggle()`

Toggle a panel by either it's numerical index or ID.

```js
accordion.toggle('panel-one');
```

#### `openAll()`

Open all panels.

```js
accordion.openAll();
```

#### `closeAll()`

Close all panels.

```js
accordion.closeAll();
```

#### `enable()`

Enable panel interactions.

```js
accordion.enable('panel-one');
```

#### `disable()`

Disable panel interactions.

```js
accordion.disable('panel-one');
```

### `getInstanceById(id: string)`

```js
import { getInstanceById } from '@rynpsc/accordion';

const instance = getInstanceById('accordion');

if (instance) {
  instance.openAll();
}
```

## Events

Events are handled via the [CustomEvent API](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).

| Name              | Description                                | Cancelable |
| ----------------- | ------------------------------------------ | ---------- |
| accordion:open    | Dispatched when a panel is opened          | Yes        |
| accordion:close   | Dispatched when a panel is closed          | Yes        |
| accordion:create  | Dispatched when the accordion is created   | No         |
| accordion:destroy | Dispatched when the accordion is destroyed | No         |

### Canceling events

Certain events can be canceled by calling `event.preventDefault()`.

```js
accordion.on('accordion:open', function(event) {
  event.preventDefault();
});
```

## Browser Support

Requires the following APIs:

- Array.from
- Array.prototype.filter
- Array.prototype.findIndex
- CustomEvent
- Element.prototype.contains
- Element.prototype.classList
- Element.prototype.dataset
- Element​.query​Selector() / Element​.query​SelectorAll()
- requestAnimationFrame
