var t=require("mitt");module.exports=function(n){var e=n,u="function"==typeof t?t():t.default();return Object.assign(u,{getState:function(){return e},setState:function(t,n){return e=Object.assign(e,"function"==typeof t?t(e):t),u.emit("update"),n&&setTimeout(n,0),e},connect:function(t){return function(n){return function(u){return n(u,t(e))}}}})};
//# sourceMappingURL=loll-state.js.map
