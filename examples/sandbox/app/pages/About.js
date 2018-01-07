const h = require('@loll/h')

module.exports = function Home (props) {
  return h`
    <div>
      <h1 css=${props === 'Home' ? {
        color: 'tomato'
      } : {
        color: 'palevioletred'
      }}>${props}</h1>
    </div>
  `
}
