const h = require('@loll/h')
const { connect } = require('@loll/state')

module.exports = connect(state => ({
  text: state.text
}))(function Text (props, state) {
  return h`
    <h4>${state.text}</h4>
  `
})
