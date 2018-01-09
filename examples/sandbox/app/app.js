/** @jsx h */
import h from '@loll/h'
import loll from '@loll/app'

import App from './components/App.js'
import Home from './pages/Home.js'
import About from './pages/About.js'

export default loll([
  ['/', () => {
    return (
      <App>
        <Home title='Home' />
      </App>
    )
  }],
  ['/about', () => {
    return (
      <App>
        <About title='About' />
      </App>
    )
  }],
])
