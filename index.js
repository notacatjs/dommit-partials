var carry = require('carry')

module.exports = wrapReactive

function wrapReactive(reactive) {
  return function (template, state, options) {
    options = options || {}
    options.bindings = options.bindings || {}

    foreach(options.partials, function (View, name) {
      options.bindings['partial-'+name] = staticPartial(View, name)
    })

    options.bindings['partial'] = dynamicPartial(options.partials)

    return reactive(template, state, options)
  }
}

// reactive("<div partial=\"somevar\"></div>", {somvar: 'somepartial'}, {
//   partials: {somepartial: require('./somepartial')}
// })
function dynamicPartial(partials) {
  return function (el, property) {
    var binding = this
      , reactive = binding.reactive
      , origEl = el

    binding.change(function () {
      var value = binding.value(property)
        , View = partials[value]

      if (!View) return

      var partial = View(reactive)
        , newEl = carry(partial, origEl)

      newEl.removeAttribute('partial')

      el.parentNode.replaceChild(newEl, el)
      el = newEl
    })
  }
}

// reactive("<div partial-some-partial", {}, {
//   partials: {"some-partial": require('./some-partial')}
// }
function staticPartial(View, name) {
  return function (el, property) {
    el.removeAttribute('partial-' + name)

    var partial = View(this.reactive, property)
      , newEl = carry(partial, el)
    el.parentNode.replaceChild(newEl, el)
  }
}

function foreach(o, f) {
  return o && Object.keys(o).forEach(function (k) {
    return f(o[k], k)
  })
}