var partials = require('..')
  , reactive = partials(require('reactive'))

var assert = require('assert')


function iconPartial(parent, property) {
  var state = {
              // Use either the property passed in or a variable from the above view
        type: property || parent.get('icon_type') || ''
      }
    , icon_template = '<i class="icon-{ type } icon"></i>'
    , view = reactive(icon_template, state)

  if (!property) {
    parent.sub('icon_type', function (t) {
      view.set('type', t)
    })
  }

  return view.el
}

function buzzPartial() {
  var p = document.createElement('p')
  p.textContent = p.innerText = 'buzz!'
  return p
}

test('basic', function () {
  var view = reactive('<div><div partial-buzz></div></div>', {}, {
      partials: { buzz: buzzPartial }
    })

  assert.equal(view.el.outerHTML, '<div><p>buzz!</p></div>')
})

test('each', function () {
  var view = reactive('<div><div each="arr"><span partial-buzz></span></div></div>', { arr: [1,2] }, {
      partials: { buzz: buzzPartial }
    })

  assert.equal(view.el.outerHTML, '<div><div><p>buzz!</p></div><div><p>buzz!</p></div></div>')
})

test('property', function () {
  var template = '<label><span partial-icon="merry-go-round">no content here</span>Merry Go Rounds!</label>'
    , view = reactive(template, {}, { partials: { 'icon': iconPartial } })

  assert.equal(view.el.outerHTML, '<label><i class="icon-merry-go-round icon"></i>Merry Go Rounds!</label>')
})

test('parent', function () {
  var template = '<tr><td><i partial-icon></i></td><td data-text="text"></td></tr>'
    , state = { text: 'foo bar baz', icon_type: 'foobar' }
    , view = reactive(template, state, { partials: { 'icon': iconPartial } })

  assert.equal(view.el.outerHTML, '<tr><td><i class="icon-foobar icon"></i></td><td data-text="text">foo bar baz</td></tr>')

  view.set('icon_type', 'bazburn')
  assert.equal(view.el.outerHTML, '<tr><td><i class="icon-bazburn icon"></i></td><td data-text="text">foo bar baz</td></tr>')
})

test('dynamic', function () {
  var template = '<div><span partial="one"></span><span partial="two"></span></div>'
    , state = { one: 'buzz', two: 'icon', icon_type: 'abc' }
    , view = reactive(template, state, { partials: { icon: iconPartial, buzz: buzzPartial } })

  assert.equal(view.el.outerHTML, '<div><p>buzz!</p><i class="icon-abc icon"></i></div>')

  view.set({ two: 'buzz' })
  assert.equal(view.el.outerHTML, '<div><p>buzz!</p><p>buzz!</p></div>')
})

test('each with context', function () {
  var view = reactive('<div><div each="arr"><span partial-icon></span></div></div>',
      { arr: [{icon_type: 'baby'},{icon_type: 'rhino'}] },
      { partials: { icon: iconPartial } })

  assert.equal(view.el.outerHTML, '<div><div><i class="icon-baby icon"></i></div><div><i class="icon-rhino icon"></i></div></div>')
})