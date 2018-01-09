# @loll/route-parser
Simple & tiny route parser. 281 bytes gzipped.

## Install
```bash
npm i @loll/route-parser --save
```

## Usage
Pass `createRoute` a route (`string`) and a handler (`function`):
```javascript
const { createRoute, getRoute } = require('@loll/route-parser')

const route = createRoute('/', () => console.log('Hello world!'))
```
Run `getRoute` with a path and an array of your routes. The first route that matches will be returned:
```javascript
getRoute('/', [ route ]) // => Hello world!
```

## Params
Routes support parametized paths:
```javascript
const route = createRoute('/posts/:slug', ({ slug }) => console.log(`Post slug is ${slug}`))

getRoute('/posts/test-slug', [ route ]) // => Post slug is test-slug
```

## Wildcard
A lone wildcard is supported for fall-through situations i.e. 404 errors:
```javascript
const route = createRoute('*', () => console.log('404'))

getRoute('/anything', [ route ]) // => 404
```

## Real World Example
```javascript
const { createRoute, getRoute } = require('@loll/route-parser')

const routeConfig = [
  ['/', () => {
    console.log('home')
  }],
  ['about', () => {
    console.log('about')
  }],
  ['/about', () => {
    console.log('/about')
  }],
  ['/posts/:id', ({ id }) => {
    console.log('/posts/:id', id)
  }],
  ['/posts/:category/:id', ({ category, id }) => {
    console.log('/posts/:category/:id', category, id)
  }],
  ['*', () => {
    console.log('wildcard')
  }]
]

const routes = routeConfig.map(route => createRoute(route[0], route[1]))

getRoute('/posts/javascript/routing', routes) // => /posts/:category/:id javascript routing
```

MIT
