# @loll/h
Universal component microlibrary.

## Usage
```javascript
const h = require('@loll/h')

function MyComponent () {
  return h`
    <h1>Hello world</h1>
  `
}
```

## Applying Transforms
Transforms allow you to specify custom attributes for `h` to understand. Once applied, transforms apply to all subsequent `h` calls.

For example, transforms can be used to define a way to convert a `css` attribute to class names for css-in-js solutions. Below uses [cxs](https://github.com/jxnblk/cxs):
```javascript
// index.js
const cxs = require('cxs')
const { applyTransform } = require('@loll/h')

applyTransform(props => {
  if (props.css && typeof props.css === 'object') {
    props.className = [props.className || '', cxs(props.css)].join(' ')
    delete props.css
  }
  return props
})
```
```javascript
// SomeComponent.js
const h = require('@loll/h')

function MyComponent () {
  return h`
    <h1 css=${{
      color: 'tomato',
      paddingLeft: '1em',
      paddingRight: '1em',
      '@media (min-width: 36em)': {
        'color': '#bada55'
      }
    }}>Hello world</h1>
  `
}
```

## Server Side
Rendering to a string is easy. Every element has an `outerHTML` property, just like in the browser.
```javascript
const app = require('express')()
const HomePage = require('./pages/HomePage.js')

app.get('/', (req, res) => {
  res.send(`
    <!doctype html>
    <html>
      <body>
        ${HomePage().outerHTML}
      </body>
    </html>
  `)
})
```

## Dependencies
- [hyperscript](https://github.com/hyperhype/hyperscript) - Create HyperText with JavaScript.
- [hyperx](https://github.com/choojs/hyperx) - Tagged template string virtual dom builder

MIT
