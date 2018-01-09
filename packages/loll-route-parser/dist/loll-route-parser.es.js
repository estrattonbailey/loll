function getParts(url) {
    var parts = url.split('/');
    return parts.slice(parts[0] !== '' ? 0 : 1);
}

function createRoute(route, handler) {
    return {
        parts: getParts(route),
        handler: handler
    };
}

function getRoute(path, routes) {
    var urls = getParts(path);
    var params = {};
    outer:for (var i$1 = 0, list = routes; i$1 < list.length; i$1 += 1) {
        var route = list[i$1];

        if (urls.length === route.parts.length) {
            inner:for (var i = 0;i < route.parts.length; i++) {
                if (route.parts[i][0] === ':') {
                    params[route.parts[i].slice(1)] = urls[i];
                    continue inner;
                } else if (route.parts[i] === urls[i]) {
                    continue inner;
                } else if (route.parts[i] === '*') {
                    break;
                }
                continue outer;
            }
            return route.handler(params);
        } else if (route.parts[0] == '*') {
            return route.handler(params);
        }
    }
}

export { createRoute, getRoute };
//# sourceMappingURL=loll-route-parser.es.js.map
