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

var Component = function Component(config) {
    Object.assign(this, config);
    if (!this.state) {
        this.state = {};
    }
    this._proxy = document.createElement('div');
};
Component.prototype.setState = function setState (fn) {
    Object.assign(this.state, typeof fn === 'function' ? fn(this.state) : fn);
    this._render();
};
Component.prototype._render = function _render () {
    this._proxy.appendChild(this.ref.cloneNode(true));
    patch(this._proxy, this._self, this._self = this.render(this.props, this.state));
    var next = this._proxy.childNodes[0];
    this.ref.parentNode.replaceChild(next, this.ref);
    this.ref = next;
};
function component(config) {
    var comp = new Component(config);
    var initialState = comp.state || {};
    return function wrappedComponent(props) {
        if (!comp._self) {
            comp.props = props;
            comp.init(props);
            comp._self = comp.render(comp.props, comp.state);
            Object.assign(comp._self.props, {
                oncreate: function oncreate(el) {
                    comp.ref = el;
                    comp.mount && comp.mount();
                },
                ondestroy: function ondestroy() {
                    comp.state = initialState;
                    comp.ref = null;
                    comp.unmount && comp.unmount();
                }
            });
        }
        for (var key in props) {
            if (props[key] !== comp.props[key]) {
                comp.props = props;
                if (!comp.update || comp.update(props, comp.state)) {
                    comp._render();
                }
            }
        }
        return comp._self;
    };
}

export default component;
//# sourceMappingURL=loll-component.es.js.map
