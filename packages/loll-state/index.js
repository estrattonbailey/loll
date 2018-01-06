const mitt = require('mitt')

module.exports = function createStore (initialState) {
  let state = initialState
  const ev = typeof mitt === 'function' ? mitt() : mitt.default()

  return Object.assign(ev, {
    getState () {
      return state
    },
    setState (fn, cb) {
      state = Object.assign(state, typeof fn === 'function' ? fn(state) : fn)
      ev.emit('update')
      cb && setTimeout(cb, 0)
      return state
    },
    connect (map) {
      return comp => props => {
        return comp(
          props,
          map(state)
        )
      }
    }
  })
}
