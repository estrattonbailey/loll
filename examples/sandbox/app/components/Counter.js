/** @jsx h */
import h from '@loll/h'
import { inc } from '../actions.js'
import store from '../store.js'

export default store.connect(state => ({
  count: state.count
}))(function Counter (props) {
  return (
    <div>
      <h1>The count is {props.count}</h1>

      <button onclick={inc}>Up</button>
    </div>
  )
})
