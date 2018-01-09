# @loll/router
Library agnostic route handling.

## Install
```bash
npm i @loll/router --save
```

## Route handling
```javascript
import createRouter from '@loll/router'

const router = createRouter([
  ['/', () => {
    return 'Hello world!'
  }]
])

router.get('/') // => Hello world!
```
Routes may also contain route parameters:
```javascript
import createRouter from '@loll/router'

const router = createRouter([
  ['/posts/:id', ({ id }) => {
    return `This is post ${id}.`
  }]
])

router.get('/posts/router') // => This is post router.
```
Configure a wildcard route to catch any fall-through:
```javascript
import createRouter from '@loll/router'

const router = createRouter([
  ['*', () => {
    return '404 - Page not found'
  }]
])

router.get('/some/other/route') // => 404 - Page not found
```

## Updating the URL
Sure:
```javascript
router.push('/about') // => window.location.pathname === 'about'
```

MIT
