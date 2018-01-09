import { patch } from 'picodom'

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
    this._proxy.appendChild(this.ref.cloneNode(true))
    patch(this._proxy, this._self, (this._self = this.render(this.props, this.state)))
    const next = this._proxy.childNodes[0]
    this.ref.parentNode.replaceChild(next, this.ref)
    this.ref = next
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
          comp.ref = el
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
        comp.props = props

        if (!comp.update || comp.update(props, comp.state)) {
          comp._render()
        }
      }
    }

    return comp._self
  }
}
