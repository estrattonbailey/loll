/** @jsx h */
import h from '@loll/h'
import Counter from './Counter.js'
import ContainedCounter from './ContainedCounter.js'

export default function App (props, children) {
  return (
    <div>
      <nav>
        <ul>
          <li><a href='/'>Home</a></li>
          <li><a href='/about'>About</a></li>
        </ul>
      </nav>

      {children}
    </div>
  )
}

