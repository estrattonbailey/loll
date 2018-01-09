var href = require('nanohref');
var ref = require('picodom');
var patch = ref.patch;
var mitt = require('mitt');
var ref$1 = require('@loll/route-parser');
var createRoute = ref$1.createRoute;
var getRoute = ref$1.getRoute;
function currentURL(loc) {
    if ( loc === void 0 ) loc = window.location;

    return loc.href.replace(loc.origin, '');
}

module.exports = function loll(r) {
    if ( r === void 0 ) r = [];

    var ref;
    var routes = r.map(function (r) { return createRoute(r[0], r[1]); });
    function fetchRoute(path) {
        return Promise.resolve(getRoute(path, routes));
    }
    
    function mount(root, done) {
        var ev = mitt.default ? mitt.default() : mitt();
        function render(url) {
            if ( url === void 0 ) url = currentURL();

            ev.emit('navigate', url);
            return fetchRoute(url, routes).then(function (next) { return requestAnimationFrame(function () {
                patch(root, ref, ref = next);
                ev.emit('render');
            }); }).then(function () { return window.history.pushState({}, document.title, url); });
        }
        
        href(function (l) { return render(currentURL(l)); });
        window.onpopstate = (function (e) { return render(currentURL(e.target.location)); });
        render().then(done);
        return Object.assign(ev, {
            render: render
        });
    }
    
    return typeof window !== 'undefined' ? mount : fetchRoute;
};
//# sourceMappingURL=loll-router.es.js.map
