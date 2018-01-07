const h = require('@loll/h')
// const Text = require('../components/Text.js')
// const Updater = require('../components/Updater.js')
const MyComponent = require('../components/MyComponent.js')

module.exports = function Home (props) {
  return h`
    <div>
      <h1 css=${props === 'Home' ? {
        color: 'tomato'
      } : {
        color: 'palevioletred'
      }}>${props}</h1>

      ${MyComponent('Hello')}
    </div>
  `
}
