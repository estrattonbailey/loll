import { patch } from 'ultradom'

class Component {
  constructor (config) {
    Object.assign(this, config)

    if (!this.state) {
      this.state = {}
    }

    this._proxy = document.createElement('div')
  }

  setState (fn) {
    Object.assign(
      this.state,
      typeof fn === 'function' ? fn(this.state) : fn
    )

    this._render()
  }

  _render () {
    this._proxy = patch(this.render(this.props, this.state), this._proxy)
    this.ref = this._proxy
  }
}

export default function component (config) {
  const comp = new Component(config)
  const initialState = comp.state || {}

  return function wrappedComponent (props) {
    if (!comp._self) {
      comp.props = props
      comp.init(props)
      comp._self = comp.render(comp.props, comp.state)
      Object.assign(comp._self.props, {
        oncreate (el) {
          comp.mount && comp.mount()
        },
        ondestroy () {
          comp.state = initialState
          comp.ref = null
          comp.unmount && comp.unmount()
        }
      })
    }

    for (let key in props) {
      if (props[key] !== comp.props[key]) {
        comp.props[key] = props[key]

        if (!comp.update || comp.update(props, comp.state)) {
          comp._render()
        }
      }
    }

    return comp._self
  }
}
