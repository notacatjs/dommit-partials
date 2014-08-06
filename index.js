var foreach = require('lodash.foreach')
  , carry = require('carry')

module.exports = partialsPlugin

// Add partials support to the reactive view
function partialsPlugin(reactive) {
  foreach(reactive.opt.partials, function (View, name) {
    reactive.bind('partial-'+name, staticPartial(View, name))
  })

  reactive.bind('partial', dynamicPartial(reactive.opt.partials))
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