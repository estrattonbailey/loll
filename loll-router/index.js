const href = require('nanohref')
const morph = require('nanomorph')
const mitt = require('mitt')

const isBrowser = typeof window !== 'undefined'

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

function executeRoute (pathname = '/', routes, done) {
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
}

module.exports = function loll (routes = []) {
  const middleware = []

  routes = routes.map(createRoute)

  /**
   * This is assuming every route returns
   * markup. If we ever want to return something
   * else and transform it back to markup
   * using middleware, this attr setting
   * will need to be handled elsewhere.
   */
  function getRoute (location) {
    const next = executeRoute(location, routes)
    next.then(el => {
      el.setAttribute('data-cuppa-root', '')
      return el
    })
    return next
  }

  function use (fn) {
    (fn && typeof fn === 'function') && middleware.push(fn)
  }

  function applyMiddleware (next) {
    for (let fn of middleware) {
      next = fn(next)
    }

    return next
  }

  function mount (root, store, done) {
    const ev = typeof mitt === 'function' ? mitt() : mitt.default()

    function write (path, next, force) {
      next = applyMiddleware(next)

      window.requestAnimationFrame(() => {
        const prev = document.querySelector('[data-cuppa-root]')
        prev ? force ? root.replaceChild(next, prev) : morph(prev, next) : root.appendChild(next)
        window.history.pushState({}, document.title, path)
        !force && ev.emit('render', next)
      })
    }

    function go (pathname, force) {
      return getRoute(pathname).then(next => (
        write(pathname, next, force)
      ))
    }

    href(({ pathname }) => {
      ev.emit('navigate', pathname)
      go(pathname)
    })

    window.onpopstate = function onPopState (e) {
      const path = e.target.location.pathname
      go(path)
    }

    go(window.location.pathname, true).then(() => done && done())

    return Object.assign(ev, {
      use,
      go
    })
  }

  function renderToString (location) {
    return getRoute(location)
      .then(markup => markup.outerHTML)
  }

  return isBrowser ? mount : renderToString
}
