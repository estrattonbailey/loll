var href = require('nanohref');
var morph = require('nanomorph');
var mitt = require('mitt');
var isBrowser = typeof window !== 'undefined';
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

function executeRoute(pathname, routes, done) {
    if ( pathname === void 0 ) pathname = '/';

    for (var i = 0, list = routes; i < list.length; i += 1) {
        var r = list[i];

        var params = r.match(pathname);
        if (params === false) 
            { continue; }
        return Promise.resolve(r.handler(params || {})).catch(function (e) { return console.error(e); });
    }
}

module.exports = function loll(routes) {
    if ( routes === void 0 ) routes = [];

    var middleware = [];
    routes = routes.map(createRoute);
    function getRoute(location) {
        var next = executeRoute(location, routes);
        next.then(function (el) {
            el.setAttribute('data-cuppa-root', '');
            return el;
        });
        return next;
    }
    
    function use(fn) {
        fn && typeof fn === 'function' && middleware.push(fn);
    }
    
    function applyMiddleware(next) {
        for (var i = 0, list = middleware; i < list.length; i += 1) {
            var fn = list[i];

            next = fn(next);
        }
        return next;
    }
    
    function mount(root, store, done) {
        var ev = typeof mitt === 'function' ? mitt() : mitt.default();
        function write(path, next, force) {
            next = applyMiddleware(next);
            window.requestAnimationFrame(function () {
                var prev = document.querySelector('[data-cuppa-root]');
                prev ? force ? root.replaceChild(next, prev) : morph(prev, next) : root.appendChild(next);
                window.history.pushState({}, document.title, path);
                !force && ev.emit('render', next);
            });
        }
        
        function go(pathname, force) {
            return getRoute(pathname).then(function (next) { return write(pathname, next, force); });
        }
        
        href(function (ref) {
            var pathname = ref.pathname;

            ev.emit('navigate', pathname);
            go(pathname);
        });
        window.onpopstate = function onPopState(e) {
            var path = e.target.location.pathname;
            go(path);
        };
        go(window.location.pathname, true).then(function () { return done && done(); });
        return Object.assign(ev, {
            use: use,
            go: go
        });
    }
    
    function renderToString(location) {
        return getRoute(location).then(function (markup) { return markup.outerHTML; });
    }
    
    return isBrowser ? mount : renderToString;
};
//# sourceMappingURL=loll-router.es.js.map
