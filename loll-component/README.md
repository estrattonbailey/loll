# @loll/component
Universal component microlibrary. Can be used with any template-literal component library like [@loll/h](https://github.com/estrattonbailey/loll/tree/master/loll-h), [bel](https://github.com/shama/bel), or [hyp](https://github.com/jxnblk/hyp).

## Install
```bash
npm i @loll/component --save
```

## Usage
Create a component. `h` here can be any library:
```javascript
// MyComponent.js
const component = require('component')

module.exports = component({
  render (props, state) {
    return h`
      <div>
        <h1>The count is 0</h1>
      </div>
    `
  }
})
```
Add state:
```javascript
// MyComponent.js
module.exports = component({
  initialState (props) {
    return {
      count: 0
    }
  },
  render (props, state) {
    return h`
      <div>
        <h1>The count is ${state.count}</h1>
      </div>
    `
  }
})
```
Add methods:
```javascript
// MyComponent.js
module.exports = component({
  initialState (props) {
    return {
      count: 0
    }
  },
  inc () {
    const render = this.setState(state => ({
      count: state.count + 1
    }))

    /*
     * Only updates when the return
     * from this.setState({})
     * is called
     */
    render()
  },
  render (props, state) {
    return h`
      <div>
        <h1>The count is 0</h1>

        <button onclick=${this.inc.bind(this)}>Up</button>
      </div>
    `
  }
})
```
Prevent updating. Think `shouldComponentUpdate`. The below will never update:
```javascript
// MyComponent.js
module.exports = component({
  initialState (props) {
    return {
      count: 0
    }
  },
  inc () {
    const render = this.setState(state => ({
      count: state.count + 1
    }))

    /*
     * Only updates when the return
     * from this.setState({})
     * is called
     */
    render()
  },
  update (props, state) {
    return false
  },
  render (props, state) {
    return h`
      <div>
        <h1>The count is 0</h1>

        <button onclick=${this.inc.bind(this)}>Up</button>
      </div>
    `
  }
})
```
Async actions and incremental rendering:
```javascript
// MyComponent.js
module.exports = component({
  initialState (props) {
    return {
      loading: false,
      posts: props.posts
    }
  },
  fetchMore () {
    // show a loading state while we fetch
    this.setState({ loading: true })()

    return fetch().then(posts => {
      this.setState({ loading: false, posts })
    })
  },
  render (props, { loading, posts }) {
    return h`
      <div>
        <h1>Posts</h1>

        ${loading ? h`
          <small>Posts are loading</small>
        ` : h`
          <div>
            ${posts.map(p => Post(p))}

            <button onclick=${this.fetchMore.bind(this)}>
          </div>
        `}
      </div>
    `
  }
})
```

## Rendering in an App
Components built with `@loll/component` can be used just like any other component in your app.
```javascript
// HomePage.js
const h = require('bel')
const MyComponent = require('./MyComponent.js')

module.exports = function HomePage (props) {
  return h`
    <div>
      ${MyComponent()}
    </div>
  `
}
```

## Dependencies
- [nanomorph](https://github.com/choojs/nanomorph) - Hyper fast diffing algorithm for real DOM nodes 
- [nanoassert](https://github.com/emilbayes/nanoassert) - Nanoscale assertion module.

MIT
