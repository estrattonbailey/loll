import { patch } from 'ultradom'
import mitt from 'mitt'
import href from '@loll/href'
import createRouter from '@loll/router'

function currentURL (loc = window.location) {
  return loc.href.replace(loc.origin, '')
}

module.exports = function loll (r = []) {
  const router = createRouter(r)

  function mount (root, done) {
    let element = root.firstElementChild
    const ev = mitt.default ? mitt.default() : mitt()

    function render (url = currentURL()) {
      ev.emit('navigate', url)
      return Promise.resolve(router.get(url))
        .then(next => requestAnimationFrame(() => {
          element = element ? patch(next, element) : root.appendChild(patch(next))
          ev.emit('render')
        }))
        .then(() => router.push(url))
    }

    href(l => render(currentURL(l)))

    window.onpopstate = e => render(currentURL(e.target.location))

    render().then(done)

    return Object.assign(ev, {
      render
    })
  }

  return typeof window !== 'undefined' ? mount : router.get
}
