# @loll/h
Component builder for @loll/app.

Exposes picodom's `h` function for building VDOM nodes. Can be used with or without JSX. See the [picodom README](https://github.com/picodom/picodom) for more.

## Install
```bash
npm i @loll/h --save
```

## Usage
```javascript
/** @jsx h */
import h from '@loll/h'

function MyComponent () {
  return (
    <h1>Hello world</h1>
  )
}
```

## Dependencies
- [picodom](https://github.com/picodom/picodom) - 1 KB VDOM builder and patch function.

MIT
