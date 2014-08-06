reactive-partials
=================

A partial system for [Reactive](https://github.com/component/reactive).

## Install

Currently installs via browserify only (PR's welcome!).

```
npm install reactive-partials
```

```javascript
var partials = require('reactive-partials')
```

## How To Use

Partials are, simply, functions that returns DOM elements. More likely, they are instantiating reactive views and subscribing to the state of the parent.

Here's the most _basic_ partial.

```javascript
function ATable() {
  return document.createElement("table")
}

var view = reactive("<div partial-a-table></div>", {}, {
  partials: { 'a-table': ATable }
}).use(partials)

// Now view.el is "<table></table>"
```

The partial function takes two arguments:
- `parent` The reactive view of the parent. Use this for subscribing to changes.
- `property` The raw string from the attribute property when using static partials `partial-my-partial="some_property"`. Use this to pass in data to your partials, perhaps from `each` bindings.

Here's an more realistic partial definition:

```javascript
function iconPartial(parent, property) {
  var state = {
              // Use either the property passed in or a variable from the above view
        type: property || parent.get('icon_type')
      }
    , icon_template = '<i class="icon-{ type } icon"></i>'
    , view = reactive(icon_template, state)

  parent.sub('icon_type', function (t) {
    view.set('type', t)
  })

  return view.el
}
```

Now, here's how to use that partial in two ways:

```javascript
var template1 = '<label><i partial-icon="merry-go-round"></i>Merry Go Rounds!</label>'
  , view1 = reactive(template1, {}, { partials: { 'icon': iconPartial } }).use(partials)

var template2 = '<tr each="rows"><td><i partial-icon></i></td><td data-text="text"></td></tr>'
  , state = { rows: [
      { text: 'yoyos are cool', icon_type: 'yoyo' },
      { text: 'kites are cooler', icon_type: 'kites' },
      { text: 'ps2 was the coolest', icon_type: 'ps2' }
    ]}
  , view2 = reactive(template2, state, { partials: { 'icon': iconPartial } }).use(partials)
```

## Dynamic Partials

Sometimes, you want to use partials but don't know which one at compile-time. Thats where dynamic partials comes in.

```javascript
function partialA() { return domify('<div class="a"></div>') }
function partialB() { return domify('<div class="b"></div>') }

var template = '<div><div partial="type"></div></div>'
  , view = reactive(template, { type: 'a' }, {
      partials: { a: partialA, b: partialB }
    }).use(partials)

view.set('type', 'b') // updates the view
```

## Notes

- A partial cannot be the top element in a view because it must have a parent to be replaced.

## License

MIT license found in `LICENSE` file.
