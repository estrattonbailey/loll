const href = require('nanohref')
const morph = require('nanomorph')
const mitt = require('mitt')

const isBrowser = typeof window !== 'undefined'

function currentURL (loc = window.location) {
  return loc.href.replace(loc.origin, '')
}

/**
 * route utils lifted and adapted from
 * dush-router by @tunnckoCore
 * @see https://github.com/tunnckoCore/dush-router
 */
function collectParams (r, pathname) {
  let match = null

  pathname.replace(r.regex, function (...args) {
    for (let i = 1; i < args.length - 2; i++) {
      r.keys.forEach(function (key) {
        r.params[key] = args[i]
      })
      match = true
    }
  })

  return match ? r.params : match
}

function createRoute ([ route, handler ]) {
  const keys = []

  const regex = new RegExp(route.replace(/\*/g, '(?:.*)').replace(/([:*])(\w+)/g, (key) => {
    keys.push(key.slice(1))
    return '([\\w-]+)'
  }) + '(?:[\/|?\w+]$|$)' + '$', 'ig') // eslint-disable-line no-useless-escape

  return {
    route,
    handler,
    regex,
    keys,
    params: {},
    match (pathname) {
      return regex.test(pathname) ? collectParams(this, pathname) : false
    }
  }
}

function getRoute (pathname = '/', routes) {
  /**
   * Find first match and render
   */
  for (let r of routes) {
    const params = r.match(pathname)

    /**
     * params will return be `null` if
     * there was a match, but not parametized
     * route params. If params is `false`,
     * it means a no-match, so skip the handler
     */
    if (params === false) continue

    return Promise.resolve(r.handler(params || {})).catch(e => console.error(e))
  }

  return Promise.resolve(false)
}

module.exports = function loll (routes = []) {
  let rootRef

  routes = routes.map(createRoute)

  function mount (root, store, done) {
    const ev = typeof mitt === 'function' ? mitt() : mitt.default()

    function write (path, next, quiet) {
      window.requestAnimationFrame(() => {
        if (rootRef) {
          morph(rootRef, next)
        } else {
          root.appendChild(next)
          rootRef = root.children[0]
        }
        window.history.pushState({}, document.title, path)
        !quiet && ev.emit('render', next)
      })
    }

    function go (pathname, quiet) {
      return getRoute(pathname, routes).then(next => (
        write(pathname, next, quiet)
      ))
    }

    href(location => {
      const loc = currentURL(location)
      ev.emit('navigate', loc)
      go(loc)
    })

    window.onpopstate = function onPopState (e) {
      const path = currentURL(e.target.location)
      go(path)
    }

    go(currentURL(), true).then(() => done && done())

    return Object.assign(ev, {
      render (url = currentURL(), quiet) {
        go(url, quiet)
      }
    })
  }

  function renderToString (location) {
    return getRoute(location, routes)
      .then(markup => markup.outerHTML)
  }

  return isBrowser ? mount : renderToString
}
