const h = require('@loll/h')
const { connect } = require('@loll/state')

module.exports = connect()(function Text (props, state) {
  return h`
    <button onclick=${e => {
      state.update(state => ({ text: 'Pew pew' }))
    }}>Update text</button>
  `
})
