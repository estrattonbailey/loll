const h = require('@loll/h')

module.exports = function App (children) {
  return h`
    <div>
      <nav>
        <ul>
          <li><a href='/'>Home</a></li>
          <li><a href='/about'>About</a></li>
        </ul>
      </nav>

      ${children}
    </div>
  `
}
