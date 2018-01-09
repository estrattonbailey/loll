function getParts (url) {
  const parts = url.split('/')
  return parts.slice(parts[0] !== '' ? 0 : 1)
}

export function createRoute (route, handler) {
  return {
    parts: getParts(route),
    handler
  }
}

export function getRoute (path, routes) {
  const urls = getParts(path)
  const params = {}
  outer: for (let route of routes) {
    if (urls.length === route.parts.length) {
      inner: for (let i = 0; i < route.parts.length; i++) {
        if (route.parts[i][0] === ':') {
          params[route.parts[i].slice(1)] = urls[i]
          continue inner
        } else if (route.parts[i] === urls[i]) {
          continue inner
        } else if (route.parts[i] === '*') {
          break
        }
        continue outer
      }
      return route.handler(params)
    } else if (route.parts[0] == '*') {
      return route.handler(params)
    }
  }
}
