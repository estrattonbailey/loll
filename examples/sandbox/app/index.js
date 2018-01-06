const app = require('./app.js')
const store = require('./store.js')

const program = app(document.getElementById('root'), () => {
  console.info('App initialized.')
})

store.on('update', () => program.render())

program.on('render', next => {
  console.info(`on('render')`)
})
