var morph = require('nanomorph');
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
            morph(comp.ref, comp.render(comp.props, comp.state));
        };
    }
    
    return function (props, externalState) {
        if ( externalState === void 0 ) externalState = {};

        assert.ok(typeof externalState === 'object', 'external state passed to component must be an object');
        if (!comp.ref) {
            comp.init && comp.init(props, externalState);
            comp.state = merge(externalState, comp.state);
            comp.ref = comp.render(props, comp.state);
            comp.props = props;
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


//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QkFDckMsSUFBQSxDQUFLLFFBQUwsQ0FBYyxTQUFkO2dCQUNBO1lBQ1I7UUFDQTtRQUVJLE9BQU8sSUFBQSxDQUFLO0lBQ2hCO0FBQ0E7QUF0RUEiLCJmaWxlIjoiaW5kZXguanMob3JpZ2luYWwpIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgbW9ycGggPSByZXF1aXJlKCduYW5vbW9ycGgnKVxuY29uc3QgYXNzZXJ0ID0gcmVxdWlyZSgnbmFub2Fzc2VydCcpXG5cbmZ1bmN0aW9uIG1lcmdlIChvbmUsIHR3bykge1xuICBsZXQgbyA9IHt9XG4gIGZvciAobGV0IGtleSBpbiBvbmUpIG9ba2V5XSA9IG9uZVtrZXldXG4gIGZvciAobGV0IGtleSBpbiB0d28pIG9ba2V5XSA9IHR3b1trZXldXG4gIHJldHVybiBvXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gQ29tcG9uZW50IChjb21wKSB7XG4gIGFzc2VydC5vayh0eXBlb2YgY29tcCA9PT0gJ29iamVjdCcsICdjb21wb25lbnQgaXMgbm90IGFuIG9iamVjdCcpXG4gIGFzc2VydC5vayh0eXBlb2YgY29tcC5yZW5kZXIgPT09ICdmdW5jdGlvbicsICdjb21wb25lbnQucmVuZGVyKCkgbXVzdCBiZSBhIGZ1bmN0aW9uJylcbiAgaWYgKGNvbXAudXBkYXRlKSBhc3NlcnQub2sodHlwZW9mIGNvbXAudXBkYXRlID09PSAnZnVuY3Rpb24nLCAnY29tcG9uZW50LnVwZGF0ZSgpIG11c3QgYmUgYSBmdW5jdGlvbicpXG5cbiAgT2JqZWN0LmFzc2lnbihjb21wLCB7XG4gICAgc3RhdGU6IHt9LFxuICAgIHJlZjogbnVsbCxcbiAgICBzZXRTdGF0ZVxuICB9KVxuXG4gIGZ1bmN0aW9uIHNob3VsZFVwZGF0ZSAocHJvcHMsIHN0YXRlKSB7XG4gICAgcmV0dXJuICFjb21wLnVwZGF0ZSB8fCBjb21wLnVwZGF0ZShwcm9wcywgc3RhdGUpXG4gIH1cblxuICBmdW5jdGlvbiBzZXRTdGF0ZSAoZm4pIHtcbiAgICBpZiAoIXNob3VsZFVwZGF0ZShjb21wLnByb3BzLCBjb21wLnN0YXRlKSkgcmV0dXJuICgpID0+IHt9XG5cbiAgICBjb25zdCBzdGF0ZSA9IHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJyA/IGZuKGNvbXAuc3RhdGUpIDogZm5cblxuICAgIGFzc2VydC5vayh0eXBlb2Ygc3RhdGUgPT09ICdvYmplY3QnLCAnc2V0U3RhdGUgcmVjZWl2ZWQgYSB2YWx1ZSB0aGF0IHdhcyBub3QgYW4gb2JqZWN0JylcblxuICAgIE9iamVjdC5hc3NpZ24oY29tcC5zdGF0ZSwgc3RhdGUpXG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgbW9ycGgoY29tcC5yZWYsIGNvbXAucmVuZGVyKGNvbXAucHJvcHMsIGNvbXAuc3RhdGUpKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAocHJvcHMsIGV4dGVybmFsU3RhdGUgPSB7fSkgPT4ge1xuICAgIGFzc2VydC5vayh0eXBlb2YgZXh0ZXJuYWxTdGF0ZSA9PT0gJ29iamVjdCcsICdleHRlcm5hbCBzdGF0ZSBwYXNzZWQgdG8gY29tcG9uZW50IG11c3QgYmUgYW4gb2JqZWN0JylcblxuICAgIGlmICghY29tcC5yZWYpIHtcbiAgICAgIGNvbXAuaW5pdCAmJiBjb21wLmluaXQocHJvcHMsIGV4dGVybmFsU3RhdGUpXG5cbiAgICAgIGNvbXAuc3RhdGUgPSBtZXJnZShcbiAgICAgICAgZXh0ZXJuYWxTdGF0ZSxcbiAgICAgICAgY29tcC5zdGF0ZVxuICAgICAgKVxuXG4gICAgICBjb21wLnJlZiA9IGNvbXAucmVuZGVyKHByb3BzLCBjb21wLnN0YXRlKVxuICAgICAgY29tcC5wcm9wcyA9IHByb3BzXG4gICAgfVxuXG4gICAgaWYgKCFzaG91bGRVcGRhdGUocHJvcHMsIG1lcmdlKGV4dGVybmFsU3RhdGUsIGNvbXAuc3RhdGUpKSkge1xuICAgICAgcmV0dXJuIGNvbXAucmVmXG4gICAgfVxuXG4gICAgY29uc3QgbmV3U3RhdGUgPSBleHRlcm5hbFN0YXRlXG4gICAgY29tcC5wcm9wcyA9IHByb3BzXG5cbiAgICBmb3IgKGxldCBrZXkgaW4gbmV3U3RhdGUpIHtcbiAgICAgIGlmIChjb21wLnN0YXRlW2tleV0gIT09IG5ld1N0YXRlW2tleV0pIHtcbiAgICAgICAgY29tcC5zZXRTdGF0ZShuZXdTdGF0ZSkoKVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjb21wLnJlZlxuICB9XG59XG4iXX0=
//# sourceMappingURL=loll-component.es.js.map
