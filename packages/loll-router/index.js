import { createRoute, getRoute } from '@loll/route-parser'

export default function createRouter (routesConfig) {
  const routes = routesConfig.map(r => createRoute(r[0], r[1]))

  return {
    get (url) {
      return getRoute(url, routes)
    },
    push (url) {
      window.history.pushState({}, document.title, url)
    }
  }
}
