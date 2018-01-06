const store = require('./store.js')

module.exports = {
  updateText (text) {
    store.setState({ text })
  }
}
