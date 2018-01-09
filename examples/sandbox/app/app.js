import loll from '@loll/app'

import App from './components/App.js'

export default loll([
  ['/', () => {
    return App('Hello')
  }],
  ['/about', () => {
    return App('About')
  }],
])
