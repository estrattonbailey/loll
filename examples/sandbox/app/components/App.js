/** @jsx h */
import h from '@loll/h'
import Counter from './Counter.js'

export default function App (children) {
  return (
    <div>
      <nav>
        <ul>
          <li><a href='/'>Home</a></li>
          <li><a href='/about'>About</a></li>
        </ul>
      </nav>

      <Counter />

      {children}
    </div>
  )
}
