/** @jsx h */
import h from '@loll/h'
import component from '@loll/component'
import store from '../store.js'

export default store.connect(state => ({
  globalCount: state.count
}))(
  component({
    init (props) {
      this.state = {
        count: 0
      }
    },
    inc () {
      this.setState(state => ({ count: state.count + 1 }))
    },
    mount () {
      console.log('mount')
    },
    unmount () {
      console.log('unmount')
    },
    render (props, state) {
      return (
        <div>
          <h1>The count is {state.count}</h1>
          <h1>The global count is {props.globalCount}</h1>

          <button onclick={this.inc.bind(this)}>Up</button>
        </div>
      )
    }
  })
)
