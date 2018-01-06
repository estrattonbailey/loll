var vdom = require('hyperx');
var dom = require('hyperscript');
var transforms = [];
var h = vdom(function (tag, props, children) {
    for (var i = 0, list = transforms; i < list.length; i += 1) {
        var fn = list[i];

        props = fn(props);
    }
    return dom(tag, props, children);
});
module.exports = h;
module.exports.applyTransform = (function (fn) {
    transforms.push(fn);
});
//# sourceMappingURL=loll-h.es.js.map
