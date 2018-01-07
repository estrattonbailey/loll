const morph = require('nanomorph')
const onload = require('on-load')
const KEY_ATTR = onload.KEY_ATTR
const assert = require('nanoassert')

function noop () {}

function merge (one, two) {
  let o = {}
  for (let key in one) o[key] = one[key]
  for (let key in two) o[key] = two[key]
  return o
}

function isSameId (one, two){
  return one.getAttribute(KEY_ATTR) === two.getAttribute(KEY_ATTR)
}

module.exports = function Component (comp) {
  assert.ok(typeof comp === 'object', 'component is not an object')
  assert.ok(typeof comp.render === 'function', 'component.render() must be a function')
  if (comp.update) assert.ok(typeof comp.update === 'function', 'component.update() must be a function')

  let loaded = false
  let olId

  Object.assign(comp, {
    state: {},
    ref: null,
    setState
  })

  function shouldUpdate (props, state) {
    return !comp.update || comp.update(props, state)
  }

  function setState (fn) {
    if (!shouldUpdate(comp.props, comp.state)) return () => {}

    const state = typeof fn === 'function' ? fn(comp.state) : fn

    assert.ok(typeof state === 'object', 'setState received a value that was not an object')

    Object.assign(comp.state, state)

    return () => {
      const next = comp.render(comp.props, comp.state)
      olId && next.setAttribute(KEY_ATTR, olId)
      morph(comp.ref, next)
    }
  }

  return (props, externalState = {}) => {
    assert.ok(typeof externalState === 'object', 'external state passed to component must be an object')
    console.log(externalState)

    /**
     * Initial render
     */
    if (!comp.ref) {
      comp.init && comp.init(props, externalState)

      comp.state = merge(
        externalState,
        comp.state
      )

      comp.ref = comp.render(props, comp.state)
      comp.props = props

      if (comp.mount || comp.unmount) {
        onload(comp.ref, () => {
          if (loaded) return
          loaded = true
          comp.mount && comp.mount()
        }, (el) => {
          if (!loaded) return
          // comp.ref = null
          comp.unmount && comp.unmount()
          loaded = false
        }, comp)

        olId = comp.ref.getAttribute(KEY_ATTR)
      }
    }

    if (!shouldUpdate(props, merge(externalState, comp.state))) {
      return comp.ref
    }

    const newState = externalState
    comp.props = props

    for (let key in newState) {
      if (comp.state[key] !== newState[key]) {
        comp.setState(newState)()
        break
      }
    }

    return comp.ref
  }
}
