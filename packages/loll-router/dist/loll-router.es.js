var href = require('nanohref');
var morph = require('nanomorph');
var mitt = require('mitt');
var isBrowser = typeof window !== 'undefined';
function currentURL(loc) {
    if ( loc === void 0 ) loc = window.location;

    return loc.href.replace(loc.origin, '');
}

function collectParams(r, pathname) {
    var match = null;
    pathname.replace(r.regex, function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var loop = function ( i ) {
            r.keys.forEach(function (key) {
                r.params[key] = args[i];
            });
            match = true;
        };

        for (var i = 1;i < args.length - 2; i++) loop( i );
    });
    return match ? r.params : match;
}

function createRoute(ref) {
    var route = ref[0];
    var handler = ref[1];

    var keys = [];
    var regex = new RegExp(route.replace(/\*/g, '(?:.*)').replace(/([:*])(\w+)/g, function (key) {
        keys.push(key.slice(1));
        return '([\\w-]+)';
    }) + '(?:[\/|?\w+]$|$)' + '$', 'ig');
    return {
        route: route,
        handler: handler,
        regex: regex,
        keys: keys,
        params: {},
        match: function match(pathname) {
            return regex.test(pathname) ? collectParams(this, pathname) : false;
        }
    };
}

function getRoute(pathname, routes) {
    if ( pathname === void 0 ) pathname = '/';

    for (var i = 0, list = routes; i < list.length; i += 1) {
        var r = list[i];

        var params = r.match(pathname);
        if (params === false) 
            { continue; }
        return Promise.resolve(r.handler(params || {})).catch(function (e) { return console.error(e); });
    }
    return Promise.resolve(false);
}

module.exports = function loll(routes) {
    if ( routes === void 0 ) routes = [];

    var rootRef;
    routes = routes.map(createRoute);
    function mount(root, store, done) {
        var ev = typeof mitt === 'function' ? mitt() : mitt.default();
        function write(path, next, quiet) {
            window.requestAnimationFrame(function () {
                if (rootRef) {
                    morph(rootRef, next);
                } else {
                    root.appendChild(next);
                    rootRef = root.children[0];
                }
                window.history.pushState({}, document.title, path);
                !quiet && ev.emit('render', next);
            });
        }
        
        function go(pathname, quiet) {
            return getRoute(pathname, routes).then(function (next) { return write(pathname, next, quiet); });
        }
        
        href(function (location) {
            var loc = currentURL(location);
            ev.emit('navigate', loc);
            go(loc);
        });
        window.onpopstate = function onPopState(e) {
            var path = currentURL(e.target.location);
            go(path);
        };
        go(currentURL(), true).then(function () { return done && done(); });
        return Object.assign(ev, {
            render: function render(url, quiet) {
                if ( url === void 0 ) url = currentURL();

                go(url, quiet);
            }
        });
    }
    
    function renderToString(location) {
        return getRoute(location, routes).then(function (markup) { return markup.outerHTML; });
    }
    
    return isBrowser ? mount : renderToString;
};
//# sourceMappingURL=loll-router.es.js.map
