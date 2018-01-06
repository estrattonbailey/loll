var mitt = require('mitt');
module.exports = function createStore(initialState) {
    var state = initialState;
    var ev = typeof mitt === 'function' ? mitt() : mitt.default();
    return Object.assign(ev, {
        getState: function getState() {
            return state;
        },
        setState: function setState(fn, cb) {
            state = Object.assign(state, typeof fn === 'function' ? fn(state) : fn);
            ev.emit('update');
            cb && setTimeout(cb, 0);
            return state;
        },
        connect: function connect(map) {
            return function (comp) { return function (props) { return comp(props, map(state)); }; };
        }
    });
};
//# sourceMappingURL=loll-state.es.js.map
