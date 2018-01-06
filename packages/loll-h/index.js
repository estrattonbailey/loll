const vdom = require('hyperx')
const dom = require('hyperscript')

let transforms = []

const h = vdom(function (tag, props, children) {
  for (let fn of transforms) {
    props = fn(props)
  }

  return dom(tag, props, children)
})

module.exports = h

module.exports.applyTransform = fn => {
  transforms.push(fn)
}
