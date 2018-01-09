import mitt from 'mitt'

export default function createStore (initialState) {
  let state = initialState
  const ev = mitt()

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
        return comp(Object.assign(props, map(state)))
      }
    }
  })
}
