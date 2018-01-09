function href(cb) {
    window.addEventListener('click', function (e) {
        if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.defaultPrevented) 
            { return; }
        var a = e.target;
        while (a && !(a.href && a.nodeName === 'A')) {
            a = a.parentNode;
        }
        if (!a || window.location.origin !== a.origin || a.hasAttribute('download') || a.target === '_blank' || /mailto|tel/.test(a.href)) 
            { return; }
        e.preventDefault();
        cb(a);
    });
}

export default href;
//# sourceMappingURL=loll-href.es.js.map
