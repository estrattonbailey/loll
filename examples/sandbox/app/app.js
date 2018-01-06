const loll = require('@loll/router')
const { applyTransform } = require('@loll/h')
const cxs = require('cxs')

applyTransform(props => {
  if (props.css && typeof props.css === 'object') {
    props.className = [props.className || '', cxs(props.css)].join(' ').replace(/^\s/, '')
  }

  return props
})

const App = require('./components/App.js')
const Home = require('./pages/Home.js')

const app = loll([
  ['/', () => {
    return App(Home('Home'))
  }],
  ['/about', () => {
    return App(Home('About'))
  }],
  ['*', () => {
    return App(Home('404'))
  }]
])

module.exports = app
