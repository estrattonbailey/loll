# @loll/router
Library agnostic routing and DOM diffing. **2.4kb gzipped.**

## Configure Routes
The main `router` exports accepts an `array` of routes, represented by an `array` with the shape `[route, handler]`.
```javascript
// router.js
const router = require('@loll/router')

function Page (props) {
  return h`<h1>${props.title}</h1>`
}

module.exports = router([
  ['/', () => {
    return Page({ title: 'Home' })
  }],
])
```
Routes can also be asynchronous:
```javascript
// router.js
const router = require('@loll/router')

function Page (props) {
  return h`<h1>${props.title}</h1>`
}

module.exports = router([
  ['/about', () => {
    return getAbout().then(data => {
      return Page(data)
    })
  }]
])
```
And may contain route parameters:
```javascript
// router.js
const router = require('@loll/router')

function Post (post) {
  return h`<h1>${post.title}</h1>`
}

module.exports = router([
  ['/posts/:id', ({ id }) => {
    return getPost(id).then(post => {
      return Post(post)
    })
  }]
])
```

## Mounting to the DOM
The export of `./router.js` returns a function to mount the router to the DOM. Pass it a DOM node to mount the router. Once mounted, the router will listen for link clicks via [nanohref](https://github.com/choojs/nanohref) and handle routing according to your config.
```javascript
// app.js
const router = require('./router.js')

module.exports = router(document.getElementById('root'), () => {
  console.log('Router is active')
})
```
## Events
The `app` uses [mitt](https://github.com/developit/mitt) internally to emit two helpful events:
### `navigate`
Fires when a valid link is clicked.
```javascript
const app = require('./app.js')

app.on('navigate', () => {
  // show a loader, etc
})
```
### `render`
Fires on the same tick as the render.
```javascript
const app = require('./app.js')

app.on('render', () => {})
```

## Methods
### `go(route)`
Navigate to a given route:
```javascript
const app = require('./app.js')

app.go('/about')
```

### Usage with State Management
Usage with state management is simple, provided the store implements a callback when the store is updated. Below is an example with [@loll/state](https://www.npmjs.com/package/@loll/state).
```javascript
const app = require('./app.js')
const createStore = require('@loll/state')

const store = createStore({
  foo: false,
  bar: true
})

store.on('update', () => {
  app.go(window.location.pathname) // render existing route again
})
```

## Server Side Rendering
On the server, the export from `./router.js` above returns a function that accepts a route and resolves the given route's handler:
```javascript
const router = require('./router.js')
const app = require('express')()

app.get('*', (req, res) => {
  router(req.originalUrl).then(markup => {
    res.send(`
      <!doctype html>
      <html>
        <body>
          <div id='root'>${markup}</div>
        </body>
      </html>
    `)
  })
})

app.listen(8080)
```

## Dependencies
- [mitt](https://github.com/developit/mitt) - Tiny 200 byte functional event emitter / pubsub.
- [nanohref](https://github.com/choojs/nanohref) - Tiny href click handler library.
- [nanomorph](https://github.com/choojs/nanomorph) - Hyper fast diffing algorithm for real DOM nodes 

MIT
