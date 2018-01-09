function e(e){window.addEventListener("click",function(t){if(!(t.ctrlKey||t.metaKey||t.altKey||t.shiftKey||t.defaultPrevented)){for(var n=t.target;n&&(!n.href||"A"!==n.nodeName);)n=n.parentNode;!n||window.location.origin!==n.origin||n.hasAttribute("download")||"_blank"===n.target||/mailto|tel/.test(n.href)||(t.preventDefault(),e(n))}})}module.exports=e;
//# sourceMappingURL=loll-href.js.map
