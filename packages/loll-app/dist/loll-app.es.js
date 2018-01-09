var callbacks = [];

function patch(parent, oldNode, newNode) {
  var element = patchElement(
    parent,
    parent.children[0],
    oldNode,
    newNode
  );

  for (var cb; (cb = callbacks.pop()); cb()) {}

  return element
}

function merge(target, source) {
  var result = {};

  for (var i in target) {
    result[i] = target[i];
  }
  for (var i in source) {
    result[i] = source[i];
  }

  return result
}

function createElement(node, isSVG) {
  if (typeof node === "string") {
    var element = document.createTextNode(node);
  } else {
    var element = (isSVG = isSVG || node.type === "svg")
      ? document.createElementNS("http://www.w3.org/2000/svg", node.type)
      : document.createElement(node.type);

    if (node.props && node.props.oncreate) {
      callbacks.push(function() {
        node.props.oncreate(element);
      });
    }

    for (var i = 0; i < node.children.length; i++) {
      element.appendChild(createElement(node.children[i], isSVG));
    }

    for (var i in node.props) {
      setElementProp(element, i, node.props[i]);
    }
  }
  return element
}

function setElementProp(element, name, value, oldValue) {
  if (name === "key") {
  } else if (name === "style") {
    for (var name in merge(oldValue, (value = value || {}))) {
      element.style[name] = value[name] || "";
    }
  } else {
    try {
      element[name] = value;
    } catch (_) {}

    if (typeof value !== "function") {
      if (value) {
        element.setAttribute(name, value);
      } else {
        element.removeAttribute(name);
      }
    }
  }
}

function updateElement(element, oldProps, props) {
  for (var i in merge(oldProps, props)) {
    var value = props[i];
    var oldValue = i === "value" || i === "checked" ? element[i] : oldProps[i];

    if (value !== oldValue) {
      setElementProp(element, i, value, oldValue);
    }
  }

  if (props && props.onupdate) {
    callbacks.push(function() {
      props.onupdate(element, oldProps);
    });
  }
}

function removeElement(parent, element, props) {
  if (
    props &&
    props.onremove &&
    typeof (props = props.onremove(element)) === "function"
  ) {
    props(remove);
  } else {
    remove();
  }

  function remove() {
    parent.removeChild(element);
  }
}

function getKey(node) {
  if (node && node.props) {
    return node.props.key
  }
}

function patchElement(parent, element, oldNode, node, isSVG, nextSibling) {
  if (oldNode == null) {
    element = parent.insertBefore(createElement(node, isSVG), element);
  } else if (node.type != null && node.type === oldNode.type) {
    updateElement(element, oldNode.props, node.props);

    isSVG = isSVG || node.type === "svg";

    var len = node.children.length;
    var oldLen = oldNode.children.length;
    var oldKeyed = {};
    var oldElements = [];
    var keyed = {};

    for (var i = 0; i < oldLen; i++) {
      var oldElement = (oldElements[i] = element.childNodes[i]);
      var oldChild = oldNode.children[i];
      var oldKey = getKey(oldChild);

      if (null != oldKey) {
        oldKeyed[oldKey] = [oldElement, oldChild];
      }
    }

    var i = 0;
    var j = 0;

    while (j < len) {
      var oldElement = oldElements[i];
      var oldChild = oldNode.children[i];
      var newChild = node.children[j];

      var oldKey = getKey(oldChild);
      if (keyed[oldKey]) {
        i++;
        continue
      }

      var newKey = getKey(newChild);

      var keyedNode = oldKeyed[newKey] || [];

      if (null == newKey) {
        if (null == oldKey) {
          patchElement(element, oldElement, oldChild, newChild, isSVG);
          j++;
        }
        i++;
      } else {
        if (oldKey === newKey) {
          patchElement(element, keyedNode[0], keyedNode[1], newChild, isSVG);
          i++;
        } else if (keyedNode[0]) {
          element.insertBefore(keyedNode[0], oldElement);
          patchElement(element, keyedNode[0], keyedNode[1], newChild, isSVG);
        } else {
          patchElement(element, oldElement, null, newChild, isSVG);
        }

        j++;
        keyed[newKey] = newChild;
      }
    }

    while (i < oldLen) {
      var oldChild = oldNode.children[i];
      var oldKey = getKey(oldChild);
      if (null == oldKey) {
        removeElement(element, oldElements[i], oldChild.props);
      }
      i++;
    }

    for (var i in oldKeyed) {
      var keyedNode = oldKeyed[i];
      var reusableNode = keyedNode[1];
      if (!keyed[reusableNode.props.key]) {
        removeElement(element, keyedNode[0], reusableNode.props);
      }
    }
  } else if (element && node !== element.nodeValue) {
    if (typeof node === "string" && typeof oldNode === "string") {
      element.nodeValue = node;
    } else {
      element = parent.insertBefore(
        createElement(node, isSVG),
        (nextSibling = element)
      );
      removeElement(parent, nextSibling, oldNode.props);
    }
  }
  return element
}

//      
// An event handler can take an optional event argument
// and should not return a value
                                          
                                                               

// An array of all currently registered event handlers for a type
                                            
                                                            
// A map of event types and their corresponding event handlers.
                        
                                 
                                   
  

/** Mitt: Tiny (~200b) functional event emitter / pubsub.
 *  @name mitt
 *  @returns {Mitt}
 */
function mitt(all                 ) {
	all = all || Object.create(null);

	return {
		/**
		 * Register an event handler for the given type.
		 *
		 * @param  {String} type	Type of event to listen for, or `"*"` for all events
		 * @param  {Function} handler Function to call in response to given event
		 * @memberOf mitt
		 */
		on: function on(type        , handler              ) {
			(all[type] || (all[type] = [])).push(handler);
		},

		/**
		 * Remove an event handler for the given type.
		 *
		 * @param  {String} type	Type of event to unregister `handler` from, or `"*"`
		 * @param  {Function} handler Handler function to remove
		 * @memberOf mitt
		 */
		off: function off(type        , handler              ) {
			if (all[type]) {
				all[type].splice(all[type].indexOf(handler) >>> 0, 1);
			}
		},

		/**
		 * Invoke all handlers for the given type.
		 * If present, `"*"` handlers are invoked after type-matched handlers.
		 *
		 * @param {String} type  The event type to invoke
		 * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
		 * @memberOf mitt
		 */
		emit: function emit(type        , evt     ) {
			(all[type] || []).slice().map(function (handler) { handler(evt); });
			(all['*'] || []).slice().map(function (handler) { handler(type, evt); });
		}
	};
}

function href(cb) {
    window.addEventListener('click', function (e) {
        if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.defaultPrevented) {
            return;
        }
        var a = e.target;
        while (a && !(a.href && a.nodeName === 'A')) {
            a = a.parentNode;
        }
        if (!a || window.location.origin !== a.origin || a.hasAttribute('download') || a.target === '_blank' || /mailto|tel/.test(a.href)) {
            return;
        }
        e.preventDefault();
        cb(a);
    });
}

function getParts(url) {
    var parts = url.split('/');
    return parts.slice(parts[0] !== '' ? 0 : 1);
}

function createRoute(route, handler) {
    return {
        parts: getParts(route),
        handler: handler
    };
}

function getRoute(path, routes) {
    var urls = getParts(path);
    var params = {};
    outer:for (var i$1 = 0, list = routes; i$1 < list.length; i$1 += 1) {
        var route = list[i$1];

        if (urls.length === route.parts.length) {
            inner:for (var i = 0;i < route.parts.length; i++) {
                if (route.parts[i][0] === ':') {
                    params[route.parts[i].slice(1)] = urls[i];
                    continue inner;
                } else if (route.parts[i] === urls[i]) {
                    continue inner;
                } else if (route.parts[i] === '*') {
                    break;
                }
                continue outer;
            }
            return route.handler(params);
        } else if (route.parts[0] == '*') {
            return route.handler(params);
        }
        console.log(route);
    }
}

function createRouter(routesConfig) {
    var routes = routesConfig.map(function (r) { return createRoute(r[0], r[1]); });
    return {
        get: function get(url) {
            return getRoute(url, routes);
        },
        push: function push(url) {
            window.history.pushState({}, document.title, url);
        }
    };
}

function currentURL(loc) {
    if ( loc === void 0 ) loc = window.location;

    return loc.href.replace(loc.origin, '');
}

module.exports = function loll(r) {
    if ( r === void 0 ) r = [];

    var ref = null;
    var router = createRouter(r);
    function mount(root, done) {
        var ev = mitt.default ? mitt.default() : mitt();
        function render(url) {
            if ( url === void 0 ) url = currentURL();

            ev.emit('navigate', url);
            return Promise.resolve(router.get(url)).then(function (next) { return requestAnimationFrame(function () {
                patch(root, ref, ref = next);
                ev.emit('render');
            }); }).then(function () { return router.push(url); });
        }
        
        href(function (l) { return render(currentURL(l)); });
        window.onpopstate = (function (e) { return render(currentURL(e.target.location)); });
        render().then(done);
        return Object.assign(ev, {
            render: render
        });
    }
    
    return typeof window !== 'undefined' ? mount : router.get;
};
//# sourceMappingURL=loll-app.es.js.map
