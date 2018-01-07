const component = require('@loll/component')
const h = require('@loll/h')
const { connect } = require('../store.js')
const { updateText } = require('../actions.js')

module.exports = connect(state => ({
  text: state.text
}))(
  component({
    init (props) {
      this.state = {
        title: 'Hello'
      }
    },
    mount () {
      console.log('mounted')
    },
    unmount () {
      console.log('unmounted')
    },
    render (props, state) {
      return h`
        <div>
          <h1>${state.title}</h1>
          <h2>${state.text}</h2>

          <button onclick=${e => {
            this.setState({ title: 'Hello world' })()
          }}>Update title</button>

          <button onclick=${e => updateText('pew pew pew')}>Mutate</button>
        </div>
      `
    }
  })
)
