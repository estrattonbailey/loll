var morph = require('nanomorph');
var onload = require('on-load');
var KEY_ATTR = onload.KEY_ATTR;
var assert = require('nanoassert');
function merge(one, two) {
    var o = {};
    for (var key in one) 
        { o[key] = one[key]; }
    for (var key$1 in two) 
        { o[key$1] = two[key$1]; }
    return o;
}

module.exports = function Component(comp) {
    assert.ok(typeof comp === 'object', 'component is not an object');
    assert.ok(typeof comp.render === 'function', 'component.render() must be a function');
    if (comp.update) 
        { assert.ok(typeof comp.update === 'function', 'component.update() must be a function'); }
    var loaded = false;
    var olId;
    Object.assign(comp, {
        state: {},
        ref: null,
        setState: setState
    });
    function shouldUpdate(props, state) {
        return !comp.update || comp.update(props, state);
    }
    
    function setState(fn) {
        if (!shouldUpdate(comp.props, comp.state)) 
            { return function () {}; }
        var state = typeof fn === 'function' ? fn(comp.state) : fn;
        assert.ok(typeof state === 'object', 'setState received a value that was not an object');
        Object.assign(comp.state, state);
        return function () {
            var next = comp.render(comp.props, comp.state);
            olId && next.setAttribute(KEY_ATTR, olId);
            morph(comp.ref, next);
        };
    }
    
    return function (props, externalState) {
        if ( externalState === void 0 ) externalState = {};

        assert.ok(typeof externalState === 'object', 'external state passed to component must be an object');
        console.log(externalState);
        if (!comp.ref) {
            comp.init && comp.init(props, externalState);
            comp.state = merge(externalState, comp.state);
            comp.ref = comp.render(props, comp.state);
            comp.props = props;
            if (comp.mount || comp.unmount) {
                onload(comp.ref, function () {
                    if (loaded) 
                        { return; }
                    loaded = true;
                    comp.mount && comp.mount();
                }, function (el) {
                    if (!loaded) 
                        { return; }
                    comp.unmount && comp.unmount();
                    loaded = false;
                }, comp);
                olId = comp.ref.getAttribute(KEY_ATTR);
            }
        }
        if (!shouldUpdate(props, merge(externalState, comp.state))) {
            return comp.ref;
        }
        var newState = externalState;
        comp.props = props;
        for (var key in newState) {
            if (comp.state[key] !== newState[key]) {
                comp.setState(newState)();
                break;
            }
        }
        return comp.ref;
    };
};
//# sourceMappingURL=loll-component.es.js.map
