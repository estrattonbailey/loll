# @loll/state
Library agnostic state management.

## Install
```bash
npm i @loll/state --save
```

## Creating a Store
Create new stores by passing an initial state object to `createStore`:
```javascript
// store.js
const createStore = require('@loll/state')

module.exports = createStore({
  count: 0
})
```

## Actions
Create actions that mutate state using `store.setState`:
```javascript
// actions.js
const { setState } = require('./store.js')

module.exports = {
  inc () {
    setState(state => ({ count: state.count + 1 }))
  }
}
```

## Components
Attach state to components using the `connect` export from `./store.js`. Import actions to mutate state:
```javascript
const { connect } = require('./store.js')
const { inc } = require('./actions.js')

module.exports = connect(state => ({
  count: state.count
}))((props, state) => {
  return h`
    <div>
      <h1>The count is ${state.count}</h1>

      <button onclick=${inc}>Up</button>
    </div>
  `
})
```

## Rendering
The store returns emitter methods. When `setState` is called, a shallow-compare checks the state object for differences. If one is found, an `update` event is emitted.
```javascript
const { on } = require('./store.js')

on('update', () => {
  // re-render application here
})
```

## API

### `setState`
Accepts an object or a function that returns an object.
```javascript
setState({
  count: 12
})

// or

setState(state => ({
  count: state.count + 1
}))
```

### `getState`
Returns the full state object.
```javascript
getState() // { count: 12 }
```

### `connect`
Accepts an function that returns a slice of state. That in turn accepts a component. When rendered, the component receives the parameters `props, shape`
```javascript
const Component = connect(state => ({
  number: state.count
}))((props, state) => {
  return h`<h1>${state.count}</h1>`
})
```

### `on` & `off`
The store uses [mitt](https://github.com/developit/mitt) interally to emit a single `update` event when the state is updated. It also exposes mitt's `off` handler, should you need it.
```javascript
function render () {}

on('update', render)

off('update', render)
```

MIT
