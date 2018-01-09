# @loll/app
Library agnostic routing and DOM diffing.

## Configure Routes
Routes are evaluated in the order they are defined:
```javascript
/** @jsx h */
import h from '@loll/h'
import loll from '@loll/app'

function Component (props) {
  return h`<h1>${props.title}</h1>`
}

const app = loll([
  ['/', () => {
    return Component({ title: 'Home' })
  }],
  ['/about', () => {
    return Component({ title: 'About' })
  }]
])
```
Routes can also be asynchronous:
```javascript
const app = loll([
  ['/', () => {
    return Component({ title: 'Home' })
  }],
  ['/about', () => {
    return getAbout().then(data => Component({ title: 'About', ...data }))
  }]
])
```
And may contain route parameters:
```javascript
const app = loll([
  ['/', () => {
    return Component({ title: 'Home' })
  }],
  ['/about', () => {
    return getAbout().then(data => Component({ title: 'About', ...data }))
  }],
  ['/posts/:id', ({ id }) => {
    return getPost(id).then(data => Component({ title: `Post: ${id}`, ...data }))
  }]
])
```
Configure a wildcard route to catch any routes that don't match, and show a 404:
```javascript
const app = loll([
  ['/', () => {
    return Component({ title: 'Home' })
  }],
  ['/about', () => {
    return getAbout().then(data => Component({ title: 'About', ...data }))
  }],
  ['/posts/:id', ({ id }) => {
    return getPost(id).then(data => Component({ title: `Post: ${id}`, ...data }))
  }]
  ['*', () => {
    return Component({ title: '404 - Page not found' })
  }]
])
```

## Mounting to the DOM
`app` now returns a function `mount`. Pass it your application's root DOM node.
```javascript
const program = app(document.getElementById('root'), () => {
  console.log('Router is active')
})
```

## Events
Once mounted, `loll` uses [mitt](https://github.com/developit/mitt) internally to emit two helpful events:
### `navigate`
Fires when a valid link is clicked.
```javascript
program.on('navigate', () => {
  // show a loader, etc
})
```
### `render`
Fires on the same tick as the render.
```javascript
program.on('render', () => {})
```

## Methods
### `render(route)`
Navigate to a given route. If no route is provided, it simply re-renders the page in it's current state. Use this method to re-render after a state change.
```javascript
program.render('/about') // navigate and render route /about

program.render() // re-render
```
### `on(event, callback)`
Subscribe to an event.
```javascript
program.on('render', () => {})
```

### Usage with State Management
Usage with state management is simple, provided the store implements a callback when the store is updated. Below is an example with [@loll/state](https://github.com/estrattonbailey/loll/tree/master/packages/loll-state).
```javascript
const createStore = require('@loll/state')

const store = createStore({
  foo: false,
  bar: true
})

store.on('update', () => program.render())
```

## Server Side Rendering
WIP, easy peasy.

## Dependencies
- [@loll/router](https://github.com/estrattonbailey/loll/tree/master/packages/loll-router) - Library agnostic route handling.
- [@loll/href](https://github.com/estrattonbailey/loll/tree/master/packages/loll-href) - Tiny click handler.
- [mitt](https://github.com/developit/mitt) - Tiny 200 byte functional event emitter / pubsub.
- [picodom](https://github.com/picodom/picodom) - 1 KB VDOM builder and patch function.

MIT
