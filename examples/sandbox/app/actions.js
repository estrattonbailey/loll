import store from './store.js'

export function inc () {
  store.setState(state => ({ count: state.count + 1 }))
}
