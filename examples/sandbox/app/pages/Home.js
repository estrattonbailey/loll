/** @jsx h */
import h from '@loll/h'
import Counter from '../components/Counter.js'
import ContainedCounter from '../components/ContainedCounter.js'

export default function Home (props) {
  console.log(props)
  return (
    <div>
      <h1>{props.title}</h1>
      <Counter />
      <ContainedCounter />
    </div>
  )
}
