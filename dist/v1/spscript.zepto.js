(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Zepto 1.1.6 - zepto event ajax ie callbacks deferred - zeptojs.com/license */




var Zepto = (function() {
  var undefined, key, $, classList, emptyArray = [], concat = emptyArray.concat, filter = emptyArray.filter, slice = emptyArray.slice,
    document = window.document,
    elementDisplay = {}, classCache = {},
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rootNodeRE = /^(?:body|html)$/i,
    capitalRE = /([A-Z])/g,

    // special attributes that should be get/set via method calls
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
    },
    readyRE = /complete|loaded|interactive/,
    simpleSelectorRE = /^[\w-]*$/,
    class2type = {},
    toString = class2type.toString,
    zepto = {},
    camelize, uniq,
    tempParent = document.createElement('div'),
    propMap = {
      'tabindex': 'tabIndex',
      'readonly': 'readOnly',
      'for': 'htmlFor',
      'class': 'className',
      'maxlength': 'maxLength',
      'cellspacing': 'cellSpacing',
      'cellpadding': 'cellPadding',
      'rowspan': 'rowSpan',
      'colspan': 'colSpan',
      'usemap': 'useMap',
      'frameborder': 'frameBorder',
      'contenteditable': 'contentEditable'
    },
    isArray = Array.isArray ||
      function(object){ return object instanceof Array }

  zepto.matches = function(element, selector) {
    if (!selector || !element || element.nodeType !== 1) return false
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                          element.oMatchesSelector || element.matchesSelector
    if (matchesSelector) return matchesSelector.call(element, selector)
    // fall back to performing a selector:
    var match, parent = element.parentNode, temp = !parent
    if (temp) (parent = tempParent).appendChild(element)
    match = ~zepto.qsa(parent, selector).indexOf(element)
    temp && tempParent.removeChild(element)
    return match
  }

  function type(obj) {
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
  }

  function isFunction(value) { return type(value) == "function" }
  function isWindow(obj)     { return obj != null && obj == obj.window }
  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
  function isObject(obj)     { return type(obj) == "object" }
  function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
  }
  function likeArray(obj) { return typeof obj.length == 'number' }

  function compact(array) { return filter.call(array, function(item){ return item != null }) }
  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str) {
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
  }
  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

  function classRE(name) {
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }

  function maybeAddPx(name, value) {
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
  }

  function defaultDisplay(nodeName) {
    var element, display
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName)
      document.body.appendChild(element)
      display = getComputedStyle(element, '').getPropertyValue("display")
      element.parentNode.removeChild(element)
      display == "none" && (display = "block")
      elementDisplay[nodeName] = display
    }
    return elementDisplay[nodeName]
  }

  function children(element) {
    return 'children' in element ?
      slice.call(element.children) :
      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
  }

  function Z(dom, selector) {
    var i, len = dom ? dom.length : 0
    for (i = 0; i < len; i++) this[i] = dom[i]
    this.length = len
    this.selector = selector || ''
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // This function can be overriden in plugins for example to make
  // it compatible with browsers that don't support the DOM fully.
  zepto.fragment = function(html, name, properties) {
    var dom, nodes, container

    // A special case optimization for a single tag
    if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

    if (!dom) {
      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
      if (!(name in containers)) name = '*'

      container = containers[name]
      container.innerHTML = '' + html
      dom = $.each(slice.call(container.childNodes), function(){
        container.removeChild(this)
      })
    }

    if (isPlainObject(properties)) {
      nodes = $(dom)
      $.each(properties, function(key, value) {
        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
        else nodes.attr(key, value)
      })
    }

    return dom
  }

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. This method can be overriden in plugins.
  zepto.Z = function(dom, selector) {
    return new Z(dom, selector)
  }

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overriden in plugins.
  zepto.isZ = function(object) {
    return object instanceof zepto.Z
  }

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  // This method can be overriden in plugins.
  zepto.init = function(selector, context) {
    var dom
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z()
    // Optimize for string selectors
    else if (typeof selector == 'string') {
      selector = selector.trim()
      // If it's a html fragment, create nodes from it
      // Note: In both Chrome 21 and Firefox 15, DOM error 12
      // is thrown if the fragment doesn't begin with <
      if (selector[0] == '<' && fragmentRE.test(selector))
        dom = zepto.fragment(selector, RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // If it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return $(document).ready(selector)
    // If a Zepto collection is given, just return it
    else if (zepto.isZ(selector)) return selector
    else {
      // normalize array if an array of nodes is given
      if (isArray(selector)) dom = compact(selector)
      // Wrap DOM nodes.
      else if (isObject(selector))
        dom = [selector], selector = null
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))
        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // create a new Zepto collection from the nodes found
    return zepto.Z(dom, selector)
  }

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, which makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  $ = function(selector, context){
    return zepto.init(selector, context)
  }

  function extend(target, source, deep) {
    for (key in source)
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {}
        if (isArray(source[key]) && !isArray(target[key]))
          target[key] = []
        extend(target[key], source[key], deep)
      }
      else if (source[key] !== undefined) target[key] = source[key]
  }

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function(target){
    var deep, args = slice.call(arguments, 1)
    if (typeof target == 'boolean') {
      deep = target
      target = args.shift()
    }
    args.forEach(function(arg){ extend(target, arg, deep) })
    return target
  }

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overriden in plugins.
  zepto.qsa = function(element, selector){
    var found,
        maybeID = selector[0] == '#',
        maybeClass = !maybeID && selector[0] == '.',
        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
        isSimple = simpleSelectorRE.test(nameOnly)
    return (element.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
      ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
      (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
      slice.call(
        isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
          maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
          element.getElementsByTagName(selector) : // Or a tag
          element.querySelectorAll(selector) // Or it's not simple, and we need to query all
      )
  }

  function filtered(nodes, selector) {
    return selector == null ? $(nodes) : $(nodes).filter(selector)
  }

  $.contains = document.documentElement.contains ?
    function(parent, node) {
      return parent !== node && parent.contains(node)
    } :
    function(parent, node) {
      while (node && (node = node.parentNode))
        if (node === parent) return true
      return false
    }

  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  function setAttribute(node, name, value) {
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
  }

  // access className property while respecting SVGAnimatedString
  function className(node, value){
    var klass = node.className || '',
        svg   = klass && klass.baseVal !== undefined

    if (value === undefined) return svg ? klass.baseVal : klass
    svg ? (klass.baseVal = value) : (node.className = value)
  }

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // "08"    => "08"
  // JSON    => parse if valid
  // String  => self
  function deserializeValue(value) {
    try {
      return value ?
        value == "true" ||
        ( value == "false" ? false :
          value == "null" ? null :
          +value + "" == value ? +value :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value )
        : value
    } catch(e) {
      return value
    }
  }

  $.type = type
  $.isFunction = isFunction
  $.isWindow = isWindow
  $.isArray = isArray
  $.isPlainObject = isPlainObject

  $.isEmptyObject = function(obj) {
    var name
    for (name in obj) return false
    return true
  }

  $.inArray = function(elem, array, i){
    return emptyArray.indexOf.call(array, elem, i)
  }

  $.camelCase = camelize
  $.trim = function(str) {
    return str == null ? "" : String.prototype.trim.call(str)
  }

  // plugin compatibility
  $.uuid = 0
  $.support = { }
  $.expr = { }
  $.noop = function() {}

  $.map = function(elements, callback){
    var value, values = [], i, key
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i)
        if (value != null) values.push(value)
      }
    else
      for (key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    return flatten(values)
  }

  $.each = function(elements, callback){
    var i, key
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }

  $.grep = function(elements, callback){
    return filter.call(elements, callback)
  }

  if (window.JSON) $.parseJSON = JSON.parse

  // Populate the class2type map
  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase()
  })

  // Define methods that will be available on all
  // Zepto collections
  $.fn = {
    constructor: zepto.Z,
    length: 0,

    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    splice: emptyArray.splice,
    indexOf: emptyArray.indexOf,
    concat: function(){
      var i, value, args = []
      for (i = 0; i < arguments.length; i++) {
        value = arguments[i]
        args[i] = zepto.isZ(value) ? value.toArray() : value
      }
      return concat.apply(zepto.isZ(this) ? this.toArray() : this, args)
    },

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn){
      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
    },
    slice: function(){
      return $(slice.apply(this, arguments))
    },

    ready: function(callback){
      // need to check if document.body exists for IE as that browser reports
      // document ready when it hasn't yet created the body element
      if (readyRE.test(document.readyState) && document.body) callback($)
      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
      return this
    },
    get: function(idx){
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    },
    toArray: function(){ return this.get() },
    size: function(){
      return this.length
    },
    remove: function(){
      return this.each(function(){
        if (this.parentNode != null)
          this.parentNode.removeChild(this)
      })
    },
    each: function(callback){
      emptyArray.every.call(this, function(el, idx){
        return callback.call(el, idx, el) !== false
      })
      return this
    },
    filter: function(selector){
      if (isFunction(selector)) return this.not(this.not(selector))
      return $(filter.call(this, function(element){
        return zepto.matches(element, selector)
      }))
    },
    add: function(selector,context){
      return $(uniq(this.concat($(selector,context))))
    },
    is: function(selector){
      return this.length > 0 && zepto.matches(this[0], selector)
    },
    not: function(selector){
      var nodes=[]
      if (isFunction(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this)
        })
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el)
        })
      }
      return $(nodes)
    },
    has: function(selector){
      return this.filter(function(){
        return isObject(selector) ?
          $.contains(this, selector) :
          $(this).find(selector).size()
      })
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
    },
    first: function(){
      var el = this[0]
      return el && !isObject(el) ? el : $(el)
    },
    last: function(){
      var el = this[this.length - 1]
      return el && !isObject(el) ? el : $(el)
    },
    find: function(selector){
      var result, $this = this
      if (!selector) result = $()
      else if (typeof selector == 'object')
        result = $(selector).filter(function(){
          var node = this
          return emptyArray.some.call($this, function(parent){
            return $.contains(parent, node)
          })
        })
      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
      else result = this.map(function(){ return zepto.qsa(this, selector) })
      return result
    },
    closest: function(selector, context){
      var node = this[0], collection = false
      if (typeof selector == 'object') collection = $(selector)
      while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
        node = node !== context && !isDocument(node) && node.parentNode
      return $(node)
    },
    parents: function(selector){
      var ancestors = [], nodes = this
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node){
          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
            ancestors.push(node)
            return node
          }
        })
      return filtered(ancestors, selector)
    },
    parent: function(selector){
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function(selector){
      return filtered(this.map(function(){ return children(this) }), selector)
    },
    contents: function() {
      return this.map(function() { return this.contentDocument || slice.call(this.childNodes) })
    },
    siblings: function(selector){
      return filtered(this.map(function(i, el){
        return filter.call(children(el.parentNode), function(child){ return child!==el })
      }), selector)
    },
    empty: function(){
      return this.each(function(){ this.innerHTML = '' })
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function(property){
      return $.map(this, function(el){ return el[property] })
    },
    show: function(){
      return this.each(function(){
        this.style.display == "none" && (this.style.display = '')
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName)
      })
    },
    replaceWith: function(newContent){
      return this.before(newContent).remove()
    },
    wrap: function(structure){
      var func = isFunction(structure)
      if (this[0] && !func)
        var dom   = $(structure).get(0),
            clone = dom.parentNode || this.length > 1

      return this.each(function(index){
        $(this).wrapAll(
          func ? structure.call(this, index) :
            clone ? dom.cloneNode(true) : dom
        )
      })
    },
    wrapAll: function(structure){
      if (this[0]) {
        $(this[0]).before(structure = $(structure))
        var children
        // drill down to the inmost element
        while ((children = structure.children()).length) structure = children.first()
        $(structure).append(this)
      }
      return this
    },
    wrapInner: function(structure){
      var func = isFunction(structure)
      return this.each(function(index){
        var self = $(this), contents = self.contents(),
            dom  = func ? structure.call(this, index) : structure
        contents.length ? contents.wrapAll(dom) : self.append(dom)
      })
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children())
      })
      return this
    },
    clone: function(){
      return this.map(function(){ return this.cloneNode(true) })
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return this.each(function(){
        var el = $(this)
        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
      })
    },
    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
    html: function(html){
      return 0 in arguments ?
        this.each(function(idx){
          var originHtml = this.innerHTML
          $(this).empty().append( funcArg(this, html, idx, originHtml) )
        }) :
        (0 in this ? this[0].innerHTML : null)
    },
    text: function(text){
      return 0 in arguments ?
        this.each(function(idx){
          var newText = funcArg(this, text, idx, this.textContent)
          this.textContent = newText == null ? '' : ''+newText
        }) :
        (0 in this ? this[0].textContent : null)
    },
    attr: function(name, value){
      var result
      return (typeof name == 'string' && !(1 in arguments)) ?
        (!this.length || this[0].nodeType !== 1 ? undefined :
          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
        ) :
        this.each(function(idx){
          if (this.nodeType !== 1) return
          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
        })
    },
    removeAttr: function(name){
      return this.each(function(){ this.nodeType === 1 && name.split(' ').forEach(function(attribute){
        setAttribute(this, attribute)
      }, this)})
    },
    prop: function(name, value){
      name = propMap[name] || name
      return (1 in arguments) ?
        this.each(function(idx){
          this[name] = funcArg(this, value, idx, this[name])
        }) :
        (this[0] && this[0][name])
    },
    data: function(name, value){
      var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

      var data = (1 in arguments) ?
        this.attr(attrName, value) :
        this.attr(attrName)

      return data !== null ? deserializeValue(data) : undefined
    },
    val: function(value){
      return 0 in arguments ?
        this.each(function(idx){
          this.value = funcArg(this, value, idx, this.value)
        }) :
        (this[0] && (this[0].multiple ?
           $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
           this[0].value)
        )
    },
    offset: function(coordinates){
      if (coordinates) return this.each(function(index){
        var $this = $(this),
            coords = funcArg(this, coordinates, index, $this.offset()),
            parentOffset = $this.offsetParent().offset(),
            props = {
              top:  coords.top  - parentOffset.top,
              left: coords.left - parentOffset.left
            }

        if ($this.css('position') == 'static') props['position'] = 'relative'
        $this.css(props)
      })
      if (!this.length) return null
      if (!$.contains(document.documentElement, this[0]))
        return {top: 0, left: 0}
      var obj = this[0].getBoundingClientRect()
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      }
    },
    css: function(property, value){
      if (arguments.length < 2) {
        var computedStyle, element = this[0]
        if(!element) return
        computedStyle = getComputedStyle(element, '')
        if (typeof property == 'string')
          return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
        else if (isArray(property)) {
          var props = {}
          $.each(property, function(_, prop){
            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
          })
          return props
        }
      }

      var css = ''
      if (type(property) == 'string') {
        if (!value && value !== 0)
          this.each(function(){ this.style.removeProperty(dasherize(property)) })
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value)
      } else {
        for (key in property)
          if (!property[key] && property[key] !== 0)
            this.each(function(){ this.style.removeProperty(dasherize(key)) })
          else
            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
      }

      return this.each(function(){ this.style.cssText += ';' + css })
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function(name){
      if (!name) return false
      return emptyArray.some.call(this, function(el){
        return this.test(className(el))
      }, classRE(name))
    },
    addClass: function(name){
      if (!name) return this
      return this.each(function(idx){
        if (!('className' in this)) return
        classList = []
        var cls = className(this), newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach(function(klass){
          if (!$(this).hasClass(klass)) classList.push(klass)
        }, this)
        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function(idx){
        if (!('className' in this)) return
        if (name === undefined) return className(this, '')
        classList = className(this)
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
          classList = classList.replace(classRE(klass), " ")
        })
        className(this, classList.trim())
      })
    },
    toggleClass: function(name, when){
      if (!name) return this
      return this.each(function(idx){
        var $this = $(this), names = funcArg(this, name, idx, className(this))
        names.split(/\s+/g).forEach(function(klass){
          (when === undefined ? !$this.hasClass(klass) : when) ?
            $this.addClass(klass) : $this.removeClass(klass)
        })
      })
    },
    scrollTop: function(value){
      if (!this.length) return
      var hasScrollTop = 'scrollTop' in this[0]
      if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
      return this.each(hasScrollTop ?
        function(){ this.scrollTop = value } :
        function(){ this.scrollTo(this.scrollX, value) })
    },
    scrollLeft: function(value){
      if (!this.length) return
      var hasScrollLeft = 'scrollLeft' in this[0]
      if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
      return this.each(hasScrollLeft ?
        function(){ this.scrollLeft = value } :
        function(){ this.scrollTo(value, this.scrollY) })
    },
    position: function() {
      if (!this.length) return

      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset       = this.offset(),
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

      // Add offsetParent borders
      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

      // Subtract the two offsets
      return {
        top:  offset.top  - parentOffset.top,
        left: offset.left - parentOffset.left
      }
    },
    offsetParent: function() {
      return this.map(function(){
        var parent = this.offsetParent || document.body
        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
          parent = parent.offsetParent
        return parent
      })
    }
  }

  // for now
  $.fn.detach = $.fn.remove

  // Generate the `width` and `height` functions
  ;['width', 'height'].forEach(function(dimension){
    var dimensionProperty =
      dimension.replace(/./, function(m){ return m[0].toUpperCase() })

    $.fn[dimension] = function(value){
      var offset, el = this[0]
      if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
        isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
        (offset = this.offset()) && offset[dimension]
      else return this.each(function(idx){
        el = $(this)
        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
      })
    }
  })

  function traverseNode(node, fun) {
    fun(node)
    for (var i = 0, len = node.childNodes.length; i < len; i++)
      traverseNode(node.childNodes[i], fun)
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(operator, operatorIndex) {
    var inside = operatorIndex % 2 //=> prepend, append

    $.fn[operator] = function(){
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var argType, nodes = $.map(arguments, function(arg) {
            argType = type(arg)
            return argType == "object" || argType == "array" || arg == null ?
              arg : zepto.fragment(arg)
          }),
          parent, copyByClone = this.length > 1
      if (nodes.length < 1) return this

      return this.each(function(_, target){
        parent = inside ? target : target.parentNode

        // convert all methods to a "before" operation
        target = operatorIndex == 0 ? target.nextSibling :
                 operatorIndex == 1 ? target.firstChild :
                 operatorIndex == 2 ? target :
                 null

        var parentInDocument = $.contains(document.documentElement, parent)

        nodes.forEach(function(node){
          if (copyByClone) node = node.cloneNode(true)
          else if (!parent) return $(node).remove()

          parent.insertBefore(node, target)
          if (parentInDocument) traverseNode(node, function(el){
            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
               (!el.type || el.type === 'text/javascript') && !el.src)
              window['eval'].call(window, el.innerHTML)
          })
        })
      })
    }

    // after    => insertAfter
    // prepend  => prependTo
    // before   => insertBefore
    // append   => appendTo
    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
      $(html)[operator](this)
      return this
    }
  })

  zepto.Z.prototype = Z.prototype = $.fn

  // Export internal API functions in the `$.zepto` namespace
  zepto.uniq = uniq
  zepto.deserializeValue = deserializeValue
  $.zepto = zepto

  return $
})()


window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)





;(function($){
  var _zid = 1, undefined,
      slice = Array.prototype.slice,
      isFunction = $.isFunction,
      isString = function(obj){ return typeof obj == 'string' },
      handlers = {},
      specialEvents={},
      focusinSupported = 'onfocusin' in window,
      focus = { focus: 'focusin', blur: 'focusout' },
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eventCapture(handler, captureSetting) {
    return handler.del &&
      (!focusinSupported && (handler.e in focus)) ||
      !!captureSetting
  }

  function realEvent(type) {
    return hover[type] || (focusinSupported && focus[type]) || type
  }

  function add(element, events, fn, data, selector, delegator, capture){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    events.split(/\s/).forEach(function(event){
      if (event == 'ready') return $(document).ready(fn)
      var handler   = parse(event)
      handler.fn    = fn
      handler.sel   = selector
      // emulate mouseenter, mouseleave
      if (handler.e in hover) fn = function(e){
        var related = e.relatedTarget
        if (!related || (related !== this && !$.contains(this, related)))
          return handler.fn.apply(this, arguments)
      }
      handler.del   = delegator
      var callback  = delegator || fn
      handler.proxy = function(e){
        e = compatible(e)
        if (e.isImmediatePropagationStopped()) return
        e.data = data
        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
        if (result === false) e.preventDefault(), e.stopPropagation()
        return result
      }
      handler.i = set.length
      set.push(handler)
      if ('addEventListener' in element)
        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
    })
  }
  function remove(element, events, fn, selector, capture){
    var id = zid(element)
    ;(events || '').split(/\s/).forEach(function(event){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
      if ('removeEventListener' in element)
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    var args = (2 in arguments) && slice.call(arguments, 2)
    if (isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (isString(context)) {
      if (args) {
        args.unshift(fn[context], fn)
        return $.proxy.apply(null, args)
      } else {
        return $.proxy(fn[context], fn)
      }
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, data, callback){
    return this.on(event, data, callback)
  }
  $.fn.unbind = function(event, callback){
    return this.off(event, callback)
  }
  $.fn.one = function(event, selector, data, callback){
    return this.on(event, selector, data, callback, 1)
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }

  function compatible(event, source) {
    if (source || !event.isDefaultPrevented) {
      source || (source = event)

      $.each(eventMethods, function(name, predicate) {
        var sourceMethod = source[name]
        event[name] = function(){
          this[predicate] = returnTrue
          return sourceMethod && sourceMethod.apply(source, arguments)
        }
        event[predicate] = returnFalse
      })

      if (source.defaultPrevented !== undefined ? source.defaultPrevented :
          'returnValue' in source ? source.returnValue === false :
          source.getPreventDefault && source.getPreventDefault())
        event.isDefaultPrevented = returnTrue
    }
    return event
  }

  function createProxy(event) {
    var key, proxy = { originalEvent: event }
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

    return compatible(proxy, event)
  }

  $.fn.delegate = function(selector, event, callback){
    return this.on(event, selector, callback)
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.off(event, selector, callback)
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, data, callback, one){
    var autoRemove, delegator, $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.on(type, selector, data, fn, one)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = data, data = selector, selector = undefined
    if (callback === undefined || data === false)
      callback = data, data = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(_, element){
      if (one) autoRemove = function(e){
        remove(element, e.type, callback)
        return callback.apply(this, arguments)
      }

      if (selector) delegator = function(e){
        var evt, match = $(e.target).closest(selector, element).get(0)
        if (match && match !== element) {
          evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
        }
      }

      add(element, event, callback, data, selector, delegator || autoRemove)
    })
  }
  $.fn.off = function(event, selector, callback){
    var $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.off(type, selector, fn)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = selector, selector = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.trigger = function(event, args){
    event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
    event._args = args
    return this.each(function(){
      // handle focus(), blur() by calling them directly
      if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
      // items in the collection might not be DOM elements
      else if ('dispatchEvent' in this) this.dispatchEvent(event)
      else $(this).triggerHandler(event, args)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, args){
    var e, result
    this.each(function(i, element){
      e = createProxy(isString(event) ? $.Event(event) : event)
      e._args = args
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout focus blur load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback) {
      return (0 in arguments) ?
        this.bind(event, callback) :
        this.trigger(event)
    }
  })

  $.Event = function(type, props) {
    if (!isString(type)) props = type, type = props.type
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true)
    return compatible(event)
  }

})(Zepto)





;(function($){
  var jsonpID = 0,
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = 'application/json',
      htmlType = 'text/html',
      blankRE = /^\s*$/,
      originAnchor = document.createElement('a')

  originAnchor.href = window.location.href

  // trigger a custom event and return false if it was cancelled
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName)
    $(context).trigger(event, data)
    return !event.isDefaultPrevented()
  }

  // trigger an Ajax "global" event
  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global) return triggerAndReturn(context || document, eventName, data)
  }

  // Number of active Ajax requests
  $.active = 0

  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
  }
  function ajaxStop(settings) {
    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context
    if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
      return false

    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
  }
  function ajaxSuccess(data, xhr, settings, deferred) {
    var context = settings.context, status = 'success'
    settings.success.call(context, data, status, xhr)
    if (deferred) deferred.resolveWith(context, [data, status, xhr])
    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
    ajaxComplete(status, xhr, settings)
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings, deferred) {
    var context = settings.context
    settings.error.call(context, xhr, type, error)
    if (deferred) deferred.rejectWith(context, [xhr, type, error])
    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
    ajaxComplete(type, xhr, settings)
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context
    settings.complete.call(context, xhr, status)
    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
    ajaxStop(settings)
  }

  // Empty function, used as default callback
  function empty() {}

  $.ajaxJSONP = function(options, deferred){
    if (!('type' in options)) return $.ajax(options)

    var _callbackName = options.jsonpCallback,
      callbackName = ($.isFunction(_callbackName) ?
        _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
      script = document.createElement('script'),
      originalCallback = window[callbackName],
      responseData,
      abort = function(errorType) {
        $(script).triggerHandler('error', errorType || 'abort')
      },
      xhr = { abort: abort }, abortTimeout

    if (deferred) deferred.promise(xhr)

    $(script).on('load error', function(e, errorType){
      clearTimeout(abortTimeout)
      $(script).off().remove()

      if (e.type == 'error' || !responseData) {
        ajaxError(null, errorType || 'error', xhr, options, deferred)
      } else {
        ajaxSuccess(responseData[0], xhr, options, deferred)
      }

      window[callbackName] = originalCallback
      if (responseData && $.isFunction(originalCallback))
        originalCallback(responseData[0])

      originalCallback = responseData = undefined
    })

    if (ajaxBeforeSend(xhr, options) === false) {
      abort('abort')
      return xhr
    }

    window[callbackName] = function(){
      responseData = arguments
    }

    script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
    document.head.appendChild(script)

    if (options.timeout > 0) abortTimeout = setTimeout(function(){
      abort('timeout')
    }, options.timeout)

    return xhr
  }

  $.ajaxSettings = {
    // Default type of request
    type: 'GET',
    // Callback that is executed before request
    beforeSend: empty,
    // Callback that is executed if the request succeeds
    success: empty,
    // Callback that is executed the the server drops error
    error: empty,
    // Callback that is executed on request complete (both: error and success)
    complete: empty,
    // The context for the callbacks
    context: null,
    // Whether to trigger "global" Ajax events
    global: true,
    // Transport
    xhr: function () {
      return new window.XMLHttpRequest()
    },
    // MIME types mapping
    // IIS returns Javascript as "application/x-javascript"
    accepts: {
      script: 'text/javascript, application/javascript, application/x-javascript',
      json:   jsonType,
      xml:    'application/xml, text/xml',
      html:   htmlType,
      text:   'text/plain'
    },
    // Whether the request is to another domain
    crossDomain: false,
    // Default timeout
    timeout: 0,
    // Whether data should be serialized to string
    processData: true,
    // Whether the browser should be allowed to cache GET responses
    cache: true
  }

  function mimeToDataType(mime) {
    if (mime) mime = mime.split(';', 2)[0]
    return mime && ( mime == htmlType ? 'html' :
      mime == jsonType ? 'json' :
      scriptTypeRE.test(mime) ? 'script' :
      xmlTypeRE.test(mime) && 'xml' ) || 'text'
  }

  function appendQuery(url, query) {
    if (query == '') return url
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
  }

  // serialize payload and append it to the URL for GET requests
  function serializeData(options) {
    if (options.processData && options.data && $.type(options.data) != "string")
      options.data = $.param(options.data, options.traditional)
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
      options.url = appendQuery(options.url, options.data), options.data = undefined
  }

  $.ajax = function(options){
    var settings = $.extend({}, options || {}),
        deferred = $.Deferred && $.Deferred(),
        urlAnchor, hashIndex
    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

    ajaxStart(settings)

    if (!settings.crossDomain) {
      urlAnchor = document.createElement('a')
      urlAnchor.href = settings.url
      urlAnchor.href = urlAnchor.href
      settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
    }

    if (!settings.url) settings.url = window.location.toString()
    if ((hashIndex = settings.url.indexOf('#')) > -1) settings.url = settings.url.slice(0, hashIndex)
    serializeData(settings)

    var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
    if (hasPlaceholder) dataType = 'jsonp'

    if (settings.cache === false || (
         (!options || options.cache !== true) &&
         ('script' == dataType || 'jsonp' == dataType)
        ))
      settings.url = appendQuery(settings.url, '_=' + Date.now())

    if ('jsonp' == dataType) {
      if (!hasPlaceholder)
        settings.url = appendQuery(settings.url,
          settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
      return $.ajaxJSONP(settings, deferred)
    }

    var mime = settings.accepts[dataType],
        headers = { },
        setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = settings.xhr(),
        nativeSetHeader = xhr.setRequestHeader,
        abortTimeout

    if (deferred) deferred.promise(xhr)

    if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
    setHeader('Accept', mime || '*/*')
    if (mime = settings.mimeType || mime) {
      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
      xhr.overrideMimeType && xhr.overrideMimeType(mime)
    }
    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
      setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

    if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
    xhr.setRequestHeader = setHeader

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        xhr.onreadystatechange = empty
        clearTimeout(abortTimeout)
        var result, error = false
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
          dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
          result = xhr.responseText

          try {
            // http://perfectionkills.com/global-eval-what-are-the-options/
            if (dataType == 'script')    (1,eval)(result)
            else if (dataType == 'xml')  result = xhr.responseXML
            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
          } catch (e) { error = e }

          if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
          else ajaxSuccess(result, xhr, settings, deferred)
        } else {
          ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
        }
      }
    }

    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort()
      ajaxError(null, 'abort', xhr, settings, deferred)
      return xhr
    }

    if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

    var async = 'async' in settings ? settings.async : true
    xhr.open(settings.type, settings.url, async, settings.username, settings.password)

    for (name in headers) nativeSetHeader.apply(xhr, headers[name])

    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = empty
        xhr.abort()
        ajaxError(null, 'timeout', xhr, settings, deferred)
      }, settings.timeout)

    // avoid sending empty string (#319)
    xhr.send(settings.data ? settings.data : null)
    return xhr
  }

  // handle optional data/success arguments
  function parseArguments(url, data, success, dataType) {
    if ($.isFunction(data)) dataType = success, success = data, data = undefined
    if (!$.isFunction(success)) dataType = success, success = undefined
    return {
      url: url
    , data: data
    , success: success
    , dataType: dataType
    }
  }

  $.get = function(/* url, data, success, dataType */){
    return $.ajax(parseArguments.apply(null, arguments))
  }

  $.post = function(/* url, data, success, dataType */){
    var options = parseArguments.apply(null, arguments)
    options.type = 'POST'
    return $.ajax(options)
  }

  $.getJSON = function(/* url, data, success */){
    var options = parseArguments.apply(null, arguments)
    options.dataType = 'json'
    return $.ajax(options)
  }

  $.fn.load = function(url, data, success){
    if (!this.length) return this
    var self = this, parts = url.split(/\s/), selector,
        options = parseArguments(url, data, success),
        callback = options.success
    if (parts.length > 1) options.url = parts[0], selector = parts[1]
    options.success = function(response){
      self.html(selector ?
        $('<div>').html(response.replace(rscript, "")).find(selector)
        : response)
      callback && callback.apply(self, arguments)
    }
    $.ajax(options)
    return this
  }

  var escape = encodeURIComponent

  function serialize(params, obj, traditional, scope){
    var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
    $.each(obj, function(key, value) {
      type = $.type(value)
      if (scope) key = traditional ? scope :
        scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
      // handle data in serializeArray() format
      if (!scope && array) params.add(value.name, value.value)
      // recurse into nested objects
      else if (type == "array" || (!traditional && type == "object"))
        serialize(params, value, traditional, key)
      else params.add(key, value)
    })
  }

  $.param = function(obj, traditional){
    var params = []
    params.add = function(key, value) {
      if ($.isFunction(value)) value = value()
      if (value == null) value = ""
      this.push(escape(key) + '=' + escape(value))
    }
    serialize(params, obj, traditional)
    return params.join('&').replace(/%20/g, '+')
  }
})(Zepto)





;(function(){
  // getComputedStyle shouldn't freak out when called
  // without a valid element as argument
  try {
    getComputedStyle(undefined)
  } catch(e) {
    var nativeGetComputedStyle = getComputedStyle;
    window.getComputedStyle = function(element){
      try {
        return nativeGetComputedStyle(element)
      } catch(e) {
        return null
      }
    }
  }
})()





;(function($){
  // Create a collection of callbacks to be fired in a sequence, with configurable behaviour
  // Option flags:
  //   - once: Callbacks fired at most one time.
  //   - memory: Remember the most recent context and arguments
  //   - stopOnFalse: Cease iterating over callback list
  //   - unique: Permit adding at most one instance of the same callback
  $.Callbacks = function(options) {
    options = $.extend({}, options)

    var memory, // Last fire value (for non-forgettable lists)
        fired,  // Flag to know if list was already fired
        firing, // Flag to know if list is currently firing
        firingStart, // First callback to fire (used internally by add and fireWith)
        firingLength, // End of the loop when firing
        firingIndex, // Index of currently firing callback (modified by remove if needed)
        list = [], // Actual callback list
        stack = !options.once && [], // Stack of fire calls for repeatable lists
        fire = function(data) {
          memory = options.memory && data
          fired = true
          firingIndex = firingStart || 0
          firingStart = 0
          firingLength = list.length
          firing = true
          for ( ; list && firingIndex < firingLength ; ++firingIndex ) {
            if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
              memory = false
              break
            }
          }
          firing = false
          if (list) {
            if (stack) stack.length && fire(stack.shift())
            else if (memory) list.length = 0
            else Callbacks.disable()
          }
        },

        Callbacks = {
          add: function() {
            if (list) {
              var start = list.length,
                  add = function(args) {
                    $.each(args, function(_, arg){
                      if (typeof arg === "function") {
                        if (!options.unique || !Callbacks.has(arg)) list.push(arg)
                      }
                      else if (arg && arg.length && typeof arg !== 'string') add(arg)
                    })
                  }
              add(arguments)
              if (firing) firingLength = list.length
              else if (memory) {
                firingStart = start
                fire(memory)
              }
            }
            return this
          },
          remove: function() {
            if (list) {
              $.each(arguments, function(_, arg){
                var index
                while ((index = $.inArray(arg, list, index)) > -1) {
                  list.splice(index, 1)
                  // Handle firing indexes
                  if (firing) {
                    if (index <= firingLength) --firingLength
                    if (index <= firingIndex) --firingIndex
                  }
                }
              })
            }
            return this
          },
          has: function(fn) {
            return !!(list && (fn ? $.inArray(fn, list) > -1 : list.length))
          },
          empty: function() {
            firingLength = list.length = 0
            return this
          },
          disable: function() {
            list = stack = memory = undefined
            return this
          },
          disabled: function() {
            return !list
          },
          lock: function() {
            stack = undefined;
            if (!memory) Callbacks.disable()
            return this
          },
          locked: function() {
            return !stack
          },
          fireWith: function(context, args) {
            if (list && (!fired || stack)) {
              args = args || []
              args = [context, args.slice ? args.slice() : args]
              if (firing) stack.push(args)
              else fire(args)
            }
            return this
          },
          fire: function() {
            return Callbacks.fireWith(this, arguments)
          },
          fired: function() {
            return !!fired
          }
        }

    return Callbacks
  }
})(Zepto)







;(function($){
  var slice = Array.prototype.slice

  function Deferred(func) {
    var tuples = [
          // action, add listener, listener list, final state
          [ "resolve", "done", $.Callbacks({once:1, memory:1}), "resolved" ],
          [ "reject", "fail", $.Callbacks({once:1, memory:1}), "rejected" ],
          [ "notify", "progress", $.Callbacks({memory:1}) ]
        ],
        state = "pending",
        promise = {
          state: function() {
            return state
          },
          always: function() {
            deferred.done(arguments).fail(arguments)
            return this
          },
          then: function(/* fnDone [, fnFailed [, fnProgress]] */) {
            var fns = arguments
            return Deferred(function(defer){
              $.each(tuples, function(i, tuple){
                var fn = $.isFunction(fns[i]) && fns[i]
                deferred[tuple[1]](function(){
                  var returned = fn && fn.apply(this, arguments)
                  if (returned && $.isFunction(returned.promise)) {
                    returned.promise()
                      .done(defer.resolve)
                      .fail(defer.reject)
                      .progress(defer.notify)
                  } else {
                    var context = this === promise ? defer.promise() : this,
                        values = fn ? [returned] : arguments
                    defer[tuple[0] + "With"](context, values)
                  }
                })
              })
              fns = null
            }).promise()
          },

          promise: function(obj) {
            return obj != null ? $.extend( obj, promise ) : promise
          }
        },
        deferred = {}

    $.each(tuples, function(i, tuple){
      var list = tuple[2],
          stateString = tuple[3]

      promise[tuple[1]] = list.add

      if (stateString) {
        list.add(function(){
          state = stateString
        }, tuples[i^1][2].disable, tuples[2][2].lock)
      }

      deferred[tuple[0]] = function(){
        deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments)
        return this
      }
      deferred[tuple[0] + "With"] = list.fireWith
    })

    promise.promise(deferred)
    if (func) func.call(deferred, deferred)
    return deferred
  }

  $.when = function(sub) {
    var resolveValues = slice.call(arguments),
        len = resolveValues.length,
        i = 0,
        remain = len !== 1 || (sub && $.isFunction(sub.promise)) ? len : 0,
        deferred = remain === 1 ? sub : Deferred(),
        progressValues, progressContexts, resolveContexts,
        updateFn = function(i, ctx, val){
          return function(value){
            ctx[i] = this
            val[i] = arguments.length > 1 ? slice.call(arguments) : value
            if (val === progressValues) {
              deferred.notifyWith(ctx, val)
            } else if (!(--remain)) {
              deferred.resolveWith(ctx, val)
            }
          }
        }

    if (len > 1) {
      progressValues = new Array(len)
      progressContexts = new Array(len)
      resolveContexts = new Array(len)
      for ( ; i < len; ++i ) {
        if (resolveValues[i] && $.isFunction(resolveValues[i].promise)) {
          resolveValues[i].promise()
            .done(updateFn(i, resolveContexts, resolveValues))
            .fail(deferred.reject)
            .progress(updateFn(i, progressContexts, progressValues))
        } else {
          --remain
        }
      }
    }
    if (!remain) deferred.resolveWith(resolveContexts, resolveValues)
    return deferred.promise()
  }

  $.Deferred = Deferred
})(Zepto)

module.exports = Zepto;
},{}],2:[function(require,module,exports){
SPScript = require("./spscript");
SPScript.List = require("./list");
SPScript.Web = require("./web");
SPScript.Profiles = require("./profiles")
SPScript.helpers = require("./helpers");

(function(sp) {
	var BaseDao = function() {
		var self = this;

		self.web = new sp.Web(self);
		self.search = new sp.Search(self);
		self.profiles = new sp.Profiles(self);
	};

	BaseDao.prototype.executeRequest = function() {
		throw "Not implemented exception";
	};

	BaseDao.prototype.get = function(relativeQueryUrl, extendedOptions, raw) {
		var options = {
			type: "GET"
		};

		if (extendedOptions) {
			$.extend(options, extendedOptions);
		}
		return this.executeRequest(relativeQueryUrl, options);
	};

	BaseDao.prototype.lists = function(listname) {
		if(!listname) {
			return this.get("/web/lists").then(sp.helpers.validateODataV2);
		}
		return new sp.List(listname, this);
	};

	BaseDao.prototype.post = function(relativePostUrl, body, extendedOptions) {
		var strBody = JSON.stringify(body);
		var options = {
			type: "POST",
			data: strBody,
			contentType: "application/json;odata=verbose"
		};
		$.extend(options, extendedOptions);
		return this.executeRequest(relativePostUrl, options);
	};

	BaseDao.prototype.uploadFile = function(folderUrl, name, base64Binary) {
		var uploadUrl = "/web/GetFolderByServerRelativeUrl('" + folderUrl + "')/Files/Add(url='" + name + "',overwrite=true)",
			options = {
				binaryStringRequestBody: true,
				state: "Update"
			};
		return this.post(uploadUrl, base64Binary, options);
	};

	sp.BaseDao = BaseDao;
})(SPScript);

module.exports = SPScript.BaseDao;
},{"./helpers":6,"./list":7,"./profiles":9,"./spscript":13,"./web":15}],3:[function(require,module,exports){
SPScript = require("./spscript");
SPScript.helpers = require("./helpers");
SPScript.BaseDao = require("./baseDao");

(function(sp) {
	var CrossDomainDao = function(appWebUrl, hostUrl) {
		this.appUrl = appWebUrl;
		this.hostUrl = hostUrl;
		this.scriptReady = new $.Deferred();

		//Load of up to RequestExecutor javascript from the host site if its not there.
		if (!SP || !SP.RequestExecutor) {
			this.scriptReady = $.getScript(hostUrl + "/_layouts/15/SP.RequestExecutor.js");
		} else {
			setTimeout(function() {
				this.scriptReady.resolve();	
			}, 1);
		}
	};

	CrossDomainDao.prototype = new SPScript.BaseDao();

	CrossDomainDao.prototype.executeRequest = function(hostRelativeUrl, options) {
		var self = this,
			deferred = new $.Deferred(),

			//If a callback was given execute it, passing response then the deferred
			//otherwise just resolve the deferred.
			successCallback = function(response) {
				var data = $.parseJSON(response.body);
				//a suceess callback was passed in
				if (options.success) {
					options.success(data, deferred);
				} else {
					//no success callback so just make sure its valid OData
					sp.helpers.validateODataV2(data, deferred);
				}
			},
			errorCallback = function(data, errorCode, errorMessage) {
				//an error callback was passed in
				if (options.error) {
					options.error(data, errorCode, errorMessage, deferred);
				} else {
					//no error callback so just reject it
					deferred.reject(errorMessage);
				}
			};

		this.scriptReady.done(function() {
			//tack on the query string question mark if not there already
			if (hostRelativeUrl.indexOf("?") === -1) {
				hostRelativeUrl = hostRelativeUrl + "?";
			}

			var executor = new SP.RequestExecutor(self.appUrl),
				fullUrl = self.appUrl + "/_api/SP.AppContextSite(@target)" + hostRelativeUrl + "@target='" + self.hostUrl + "'";

			var executeOptions = {
				url: fullUrl,
				type: "GET",
				headers: {
					"Accept": "application/json; odata=verbose"
				},
				success: successCallback,
				error: errorCallback
			};
			//Merge passed in options
			$.extend(true, executeOptions, options);
			executor.executeAsync(executeOptions);
		});
		return deferred.promise();
	};

	sp.CrossDomainDao = CrossDomainDao;
})(SPScript);

module.exports = SPScript.CrossDomainDao;
},{"./baseDao":2,"./helpers":6,"./spscript":13}],4:[function(require,module,exports){
(function (global){

global.Zepto = require("../../lib/zepto.custom");
global.$ = global.Zepto;
global.SPScript = require("./spscript");
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../lib/zepto.custom":1,"./spscript":5}],5:[function(require,module,exports){
(function (global){
global.SPScript = {};
global.SPScript.RestDao = require("../restDao");
global.SPScript.CrossDomainDao = require("../crossDomainDao");
global.SPScript.queryString = require("../queryString");
global.SPScript.Search = require("../search");
global.SPScript.templating = require("../templating");
module.exports = global.SPScript;
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../crossDomainDao":3,"../queryString":10,"../restDao":11,"../search":12,"../templating":14}],6:[function(require,module,exports){
var SPScript = require("./spscript.js");

(function(sp) {
	var helpers = {};
	helpers.validateODataV2 = function(data) {
		var results = data;
		if (data.d && data.d.results && data.d.results.length != null) {
			results = data.d.results;
		} else if (data.d) {
			results = data.d;
		}
		return results;
	};

	helpers.validateCrossDomainODataV2 = function(response) {
		var data = $.parseJSON(response.body);
		helpers.validateODataV2(data);
	};

	//'Borrowed' from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
	helpers.arrayFromBitMask = function (nMask) {
		// nMask must be between -2147483648 and 2147483647
		if (typeof nMask === "string") {
			nMask = parseInt(nMask);
		}
		// if (nMask > 0x7fffffff || nMask < -0x80000000) { 
		// 	throw new TypeError("arrayFromMask - out of range"); 
		// }
		for (var nShifted = nMask, aFromMask = []; nShifted; aFromMask.push(Boolean(nShifted & 1)), nShifted >>>= 1);
		return aFromMask;
	};

	sp.helpers = helpers;
})(SPScript);

module.exports = SPScript.helpers;
},{"./spscript.js":13}],7:[function(require,module,exports){
var SPScript = require("./spscript");
SPScript.helpers = require("./helpers");
SPScript.permissions = require("./permissions");

(function(sp) {
	var baseUrl = null;
	var List = function(listname, dao) {
		this.listname = listname;
		baseUrl = "/web/lists/getbytitle('" + listname + "')";
		this._dao = dao;
	};

	List.prototype.getItems = function(odataQuery) {
		var query = (odataQuery != null) ? "?" + odataQuery : "";
		return this._dao
			.get(baseUrl + "/items" + query)
			.then(sp.helpers.validateODataV2);
	};

	List.prototype.getItemById = function(id, odata) {
		var url = baseUrl + "/items(" + id + ")";
		url += (odata != null) ? "?" + odata : "";
		return this._dao.get(url).then(sp.helpers.validateODataV2);
	};

	List.prototype.info = function() {
		return this._dao.get(baseUrl).then(sp.helpers.validateODataV2);
	};

	List.prototype.addItem = function(item) {
		var self = this;
		return self._dao.get(baseUrl).then(function(data) {
			item = $.extend({
				"__metadata": {
					"type": data.d.ListItemEntityTypeFullName
				}
			}, item);

			var customOptions = {
				headers: {
					"Accept": "application/json;odata=verbose",
					"X-RequestDigest": $("#__REQUESTDIGEST").val(),
				}
			};

			return self._dao.post(baseUrl + "/items", item, customOptions)
				.then(sp.helpers.validateODataV2);
		});
	};

	List.prototype.updateItem = function(itemId, updates) {
		var self = this;
		return self.getItemById(itemId).then(function(item) {
			updates = $.extend({
				"__metadata": {
					"type": item.__metadata.type
				}
			}, updates);

			var customOptions = {
				headers: {
					"Accept": "application/json;odata=verbose",
					"X-RequestDigest": $("#__REQUESTDIGEST").val(),
					"X-HTTP-Method": "MERGE",
					"If-Match": item.__metadata.etag
				}
			};

			return self._dao.post(item.__metadata.uri, updates, customOptions);
		});
	};
	
	List.prototype.deleteItem = function(itemId) {
		var self = this;
		return self.getItemById(itemId).then(function(item) {
			var customOptions = {
				headers: {
					"Accept": "application/json;odata=verbose",
					"X-RequestDigest": $("#__REQUESTDIGEST").val(),
					"X-HTTP-Method": "DELETE",
					"If-Match": item.__metadata.etag
				}
			};
			return self._dao.post(item.__metadata.uri, "", customOptions);
		});
	};

	List.prototype.findItems = function(key, value, extraOData) {
		//if its a string, wrap in single quotes
		var filterValue = typeof value === "string" ? "'" + value + "'" : value;
		var odata = "$filter=" + key + " eq " + filterValue;
		odata += (extraOData != null) ? "&" + extraOData : "";

		return this.getItems(odata);
	};

	List.prototype.findItem = function(key, value, odata) {
		return this.findItems(key, value, odata).then(function(items) {
			if (items && items.length && items.length > 0) {
				return items[0];
			}
			return null;
		});
	};

	List.prototype.permissions = function(email) {
		return sp.permissions(baseUrl, this._dao, email);
	};

	sp.List = List;
})(SPScript);

module.exports = SPScript.List;
},{"./helpers":6,"./permissions":8,"./spscript":13}],8:[function(require,module,exports){
var SPScript = require("./spscript");
SPScript.helpers = require("./helpers");

(function(sp) {
	var transforms = {
		roleAssignment: function(raw) {
			var priv = {
				member: {
					login: raw.Member.LoginName,
					name: raw.Member.Title,
					id: raw.Member.Id
				}
			};
			priv.roles = raw.RoleDefinitionBindings.results.map(function(roleDef){
				return {
					name: roleDef.Name,
					description: roleDef.Description,
					basePermissions: permissionMaskToStrings(roleDef.BasePermissions.Low, roleDef.BasePermissions.High)
				};
			});
			return priv;
		}
	};

	var permissionMaskToStrings = function(lowMask, highMask) {
		var basePermissions = [];
		spBasePermissions.forEach(function(basePermission){
			if ((basePermission.low & lowMask) > 0 || (basePermission.high & highMask) > 0) {
				basePermissions.push(basePermission.name);
			}
		});
		return basePermissions;
	};

	var permissions = function(baseUrl, dao, email) {
		if(!email) {
			var url = baseUrl + "/RoleAssignments?$expand=Member,RoleDefinitionBindings";
			return dao.get(url)
				.then(sp.helpers.validateODataV2)
				.then(function(results){
					return results.map(transforms.roleAssignment);
				});
		}
		//An email was passed so check privs on that specific user
		var checkPrivs = function(user) {
			var login = encodeURIComponent(user.LoginName);
			var url = baseUrl + "/getusereffectivepermissions(@v)?@v='" + login + "'";
			return dao.get(url).then(sp.helpers.validateODataV2);
		};
		return dao.web.getUser(email)
			.then(checkPrivs)
			.then(function(privs) {
				return permissionMaskToStrings(privs.GetUserEffectivePermissions.Low, privs.GetUserEffectivePermissions.High);
			});
	};

	// Scraped it from SP.PermissionKind
	// var basePermissions = [];
	// Object.keys(SP.PermissionKind).forEach(function(key) { 
	// 	var perm = new SP.BasePermissions();
	//     perm.set(SP.PermissionKind[key]);
	//     var permisison = {
	//     	name: key,
	//     	low: perm.$A_1,
	//     	high: perm.$9_1
	//     };
	//     basePermissions.push(permisison);
	// });
	var spBasePermissions = [  
   {  
      "name":"emptyMask",
      "low":0,
      "high":0
   },
   {  
      "name":"viewListItems",
      "low":1,
      "high":0
   },
   {  
      "name":"addListItems",
      "low":2,
      "high":0
   },
   {  
      "name":"editListItems",
      "low":4,
      "high":0
   },
   {  
      "name":"deleteListItems",
      "low":8,
      "high":0
   },
   {  
      "name":"approveItems",
      "low":16,
      "high":0
   },
   {  
      "name":"openItems",
      "low":32,
      "high":0
   },
   {  
      "name":"viewVersions",
      "low":64,
      "high":0
   },
   {  
      "name":"deleteVersions",
      "low":128,
      "high":0
   },
   {  
      "name":"cancelCheckout",
      "low":256,
      "high":0
   },
   {  
      "name":"managePersonalViews",
      "low":512,
      "high":0
   },
   {  
      "name":"manageLists",
      "low":2048,
      "high":0
   },
   {  
      "name":"viewFormPages",
      "low":4096,
      "high":0
   },
   {  
      "name":"anonymousSearchAccessList",
      "low":8192,
      "high":0
   },
   {  
      "name":"open",
      "low":65536,
      "high":0
   },
   {  
      "name":"viewPages",
      "low":131072,
      "high":0
   },
   {  
      "name":"addAndCustomizePages",
      "low":262144,
      "high":0
   },
   {  
      "name":"applyThemeAndBorder",
      "low":524288,
      "high":0
   },
   {  
      "name":"applyStyleSheets",
      "low":1048576,
      "high":0
   },
   {  
      "name":"viewUsageData",
      "low":2097152,
      "high":0
   },
   {  
      "name":"createSSCSite",
      "low":4194304,
      "high":0
   },
   {  
      "name":"manageSubwebs",
      "low":8388608,
      "high":0
   },
   {  
      "name":"createGroups",
      "low":16777216,
      "high":0
   },
   {  
      "name":"managePermissions",
      "low":33554432,
      "high":0
   },
   {  
      "name":"browseDirectories",
      "low":67108864,
      "high":0
   },
   {  
      "name":"browseUserInfo",
      "low":134217728,
      "high":0
   },
   {  
      "name":"addDelPrivateWebParts",
      "low":268435456,
      "high":0
   },
   {  
      "name":"updatePersonalWebParts",
      "low":536870912,
      "high":0
   },
   {  
      "name":"manageWeb",
      "low":1073741824,
      "high":0
   },
   {  
      "name":"anonymousSearchAccessWebLists",
      "low":-2147483648,
      "high":0
   },
   {  
      "name":"useClientIntegration",
      "low":0,
      "high":16
   },
   {  
      "name":"useRemoteAPIs",
      "low":0,
      "high":32
   },
   {  
      "name":"manageAlerts",
      "low":0,
      "high":64
   },
   {  
      "name":"createAlerts",
      "low":0,
      "high":128
   },
   {  
      "name":"editMyUserInfo",
      "low":0,
      "high":256
   },
   {  
      "name":"enumeratePermissions",
      "low":0,
      "high":1073741824
   }
];

	sp.permissions = permissions;
})(SPScript);

module.exports = SPScript.permissions;
},{"./helpers":6,"./spscript":13}],9:[function(require,module,exports){
var SPScript = require;("./spscript");
SPScript.helpers = require("./helpers");

(function(sp) {
	var Profiles = function(dao) {
		this._dao = dao;
		this.baseUrl = "/SP.UserProfiles.PeopleManager";
	};

	var transformPersonProperties = function(profile) {
		profile.UserProfileProperties.results.forEach(function(keyvalue){
			profile[keyvalue.Key] = keyvalue.Value;
		});
		return profile;
	};

	Profiles.prototype.current = function() {
		var url = this.baseUrl + "/GetMyProperties";
		return this._dao.get(url)
					.then(sp.helpers.validateODataV2)
					.then(transformPersonProperties);
	};

	Profiles.prototype.getProfile = function(user) {
		var login = encodeURIComponent(user.LoginName);
		var url = this.baseUrl + "/GetPropertiesFor(accountName=@v)?@v='" + login + "'";
		return this._dao.get(url)
			.then(sp.helpers.validateODataV2)
			.then(transformPersonProperties);
	};

	Profiles.prototype.getByEmail = function(email) {
		var self = this;
		return self._dao.web.getUser(email)
			.then(function(user) {
				return self.getProfile(user);
			});
	};

	sp.Profiles = Profiles;
})(SPScript);

module.exports = SPScript.Profiles;
},{"./helpers":6}],10:[function(require,module,exports){
SPScript = require("./spscript");

(function(sp) {
	sp.queryString = {
		_queryString: {},
		_processed: false,

		//private method (only run on the first 'GetValue' request)
		_processQueryString: function(text) {
			var qs = text || window.location.search.substring(1),
				keyValue,
				keyValues = qs.split('&');

			for (var i = 0; i < keyValues.length; i++) {
				keyValue = keyValues[i].split('=');
				//this._queryString.push(keyValue[0]);
				this._queryString[keyValue[0]] = decodeURIComponent(keyValue[1].replace(/\+/g, " "));
			}

			this._processed = true;
		},

		//Public Methods
		contains: function(key, text) {
			if (!this._processed) {
				this._processQueryString(text);
			}
			return this._queryString.hasOwnProperty(key);
		},

		getValue: function(key, text) {
			if (!this._processed) {
				this._processQueryString(text);
			}
			return this.contains(key) ? this._queryString[key] : "";
		},

		getAll: function(text) {
			if (!this._processed) {
				this._processQueryString(text);
			}
			return this._queryString;
		},

		objectToQueryString: function(obj, quoteValues) {
			var params = [];
			for (var key in obj) {
				value = obj[key];
				if (value !== null) {
					if (quoteValues) {
						params.push(encodeURIComponent(key) + "='" + encodeURIComponent(value) + "'");
					} else {
						params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
					}
				}

			}
			return params.join("&");
		}
	};
})(SPScript);

module.exports = SPScript.queryString;
},{"./spscript":13}],11:[function(require,module,exports){
var SPScript = require("./spscript");
SPScript.BaseDao = require("./baseDao");
SPScript.Search = require("./search");

(function(sp) {
	var RestDao = function(url) {
		var self = this;
		sp.BaseDao.call(this);
		this.webUrl = url;
	};

	RestDao.prototype = new sp.BaseDao();

	RestDao.prototype.executeRequest = function(url, options) {
		var self = this,
			fullUrl = (/^http/i).test(url) ? url : this.webUrl + "/_api" + url,
			executeOptions = {
				url: fullUrl,
				type: "GET",
				headers: {
					"Accept": "application/json; odata=verbose"
				}
			};

		$.extend(executeOptions, options);
		return $.ajax(executeOptions);
	};

	sp.RestDao = RestDao;
})(SPScript);

module.exports = SPScript.RestDao;
},{"./baseDao":2,"./search":12,"./spscript":13}],12:[function(require,module,exports){
SPScript = require("./spscript");
SPScript.RestDao = require("./restDao");
SPScript.queryString = require('./queryString');

(function(sp) {
	var Search = function(urlOrDao) {
		if (typeof urlOrDao === "string") {
			this.dao = new sp.RestDao(urlOrDao);
		} else {
			this.dao = urlOrDao;
		}
	};

	Search.QueryOptions = function() {
		this.sourceid = null;
		this.startrow = null;
		this.rowlimit = 30;
		this.selectedproperties = null;
		this.refiners = null;
		this.refinementfilters = null;
		this.hiddenconstraints = null;
		this.sortlist = null;
	};

	var convertRowsToObjects = function(itemRows) {
		var items = [];

		for (var i = 0; i < itemRows.length; i++) {
			var row = itemRows[i],
				item = {};
			for (var j = 0; j < row.Cells.results.length; j++) {
				item[row.Cells.results[j].Key] = row.Cells.results[j].Value;
			}

			items.push(item);
		}

		return items;
	};

	//sealed class used to format results
	var SearchResults = function(queryResponse) {
		this.elapsedTime = queryResponse.ElapsedTime;
		this.suggestion = queryResponse.SpellingSuggestion;
		this.resultsCount = queryResponse.PrimaryQueryResult.RelevantResults.RowCount;
		this.totalResults = queryResponse.PrimaryQueryResult.RelevantResults.TotalRows;
		this.totalResultsIncludingDuplicates = queryResponse.PrimaryQueryResult.RelevantResults.TotalRowsIncludingDuplicates;
		this.items = convertRowsToObjects(queryResponse.PrimaryQueryResult.RelevantResults.Table.Rows.results);
	};

	Search.prototype.query = function(queryText, queryOptions) {
		var self = this,
			optionsQueryString = queryOptions != null ? "&" + sp.queryString.objectToQueryString(queryOptions, true) : "",
			asyncRequest = new $.Deferred();

		var url = "/search/query?querytext='" + queryText + "'" + optionsQueryString;
		var getRequest = self.dao.get(url);

		getRequest.done(function(data) {
			if (data.d && data.d.query) {
				var results = new SearchResults(data.d.query);
				asyncRequest.resolve(results);
			} else {
				asyncRequest.reject(data);
			}
		});

		return asyncRequest.promise();
	};

	Search.prototype.people = function(queryText, queryOptions) {
		var options = queryOptions || {};
		options.sourceid =  'b09a7990-05ea-4af9-81ef-edfab16c4e31';
		return this.query(queryText, options);
	};

	sp.Search = Search;

})(SPScript);

module.exports = SPScript.Search;
},{"./queryString":10,"./restDao":11,"./spscript":13}],13:[function(require,module,exports){
module.exports = {};
},{}],14:[function(require,module,exports){
SPScript = require("./spscript");

(function(sp) {
	sp.templating = {

		Placeholder: function(raw) {
			this.raw = raw;
			this.fullProperty = raw.slice(2, raw.length - 2);
		},

		getPlaceHolders: function(template, regexp) {
			var regExpPattern = regexp || /\{\{[^\}]+\}\}?/g;
			return template.match(regExpPattern);
		},

		getObjectValue: function(obj, fullProperty) {
			var value = obj,
				propertyChain = fullProperty.split('.');

			for (var i = 0; i < propertyChain.length; i++) {
				var property = propertyChain[i];
				value = value[property] != null ? value[property] : "Not Found: " + fullProperty;
			}

			if(fullProperty === "_") {
				value = obj;
			}
			
			if ((typeof value === "string") && value.indexOf("/Date(") !== -1) {
				var dateValue = value.UTCJsonToDate();
				value = dateValue.toLocaleDateString();
			}

			return value;
		},

		populateTemplate: function(template, item, regexp) {
			var placeholders = this.getPlaceHolders(template, regexp) || [],
				itemHtml = template;

			for (var i = 0; i < placeholders.length; i++) {
				var placeholder = new this.Placeholder(placeholders[i]);
				placeholder.val = this.getObjectValue(item, placeholder.fullProperty);
				var pattern = placeholder.raw.replace("[", "\\[").replace("]", "\\]");
				var modifier = "g";
				itemHtml = itemHtml.replace(new RegExp(pattern, modifier), placeholder.val);
			}
			return itemHtml;
		}
	};

	sp.templating.Each = {

		regExp: /\{\[[^\]]+\]\}?/g,

		populateEachTemplates: function(itemHtml, item) {
			var $itemHtml = $(itemHtml),
				eachTemplates = $itemHtml.find("[data-each]");

			eachTemplates.each(function() {
				var arrayHtml = "",
					itemTemplate = $(this).html(),
					arrayProp = $(this).data("each"),
					array = sp.templating.getObjectValue(item, arrayProp);

				if (array != null && $.isArray(array)) {
					for (var i = 0; i < array.length; i++) {
						arrayHtml += sp.templating.populateTemplate(itemTemplate, array[i], sp.templating.Each.regExp);
					}
				}

				$itemHtml.find($(this)).html(arrayHtml);
			});

			var temp = $itemHtml.clone().wrap("<div>");
			return temp.parent().html();
		}
	};

	sp.templating.renderTemplate = function(template, item, renderEachTemplate) {
		var itemHtml = sp.templating.populateTemplate(template, item);
		if (renderEachTemplate) {
			itemHtml = sp.templating.Each.populateEachTemplates(itemHtml, item);
		}
		return itemHtml;
	};
})(SPScript);

String.prototype.UTCJsonToDate = function() {
	var utcStr = this.substring(this.indexOf("(") + 1);
	utcStr = utcStr.substring(0, utcStr.indexOf(")"));

	var returnDate = new Date(parseInt(utcStr, 10));
	var hourOffset = returnDate.getTimezoneOffset() / 60;
	returnDate.setHours(returnDate.getHours() + hourOffset);

	return returnDate;
};

module.exports = SPScript.templating;
},{"./spscript":13}],15:[function(require,module,exports){
var SPScript = require;("./spscript");
SPScript.helpers = require("./helpers");
SPScript.permissions = require("./permissions");

(function(sp) {
	var baseUrl = "/web";
	var Web = function(dao) {
		this._dao = dao;
	};

	Web.prototype.info = function() {
		return this._dao
			.get(baseUrl)
			.then(sp.helpers.validateODataV2);
	};

	Web.prototype.subsites = function() {
		return this._dao
			.get(baseUrl + "/webinfos")
			.then(sp.helpers.validateODataV2);
	};

	Web.prototype.permissions = function(email) {
		return sp.permissions(baseUrl, this._dao, email);
	};

	Web.prototype.getUser = function(email) {
		var url = baseUrl + "/SiteUsers/GetByEmail('" + email + "')";
		return this._dao.get(url).then(sp.helpers.validateODataV2);
	};

	sp.Web = Web;
})(SPScript);

module.exports = SPScript.Web;
},{"./helpers":6,"./permissions":8}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxnaXR3aXBcXFNQU2NyaXB0XFxub2RlX21vZHVsZXNcXGd1bHAtYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvbGliL3plcHRvLmN1c3RvbS5qcyIsIkM6L2dpdHdpcC9TUFNjcmlwdC9zcmMvYmFzZURhby5qcyIsIkM6L2dpdHdpcC9TUFNjcmlwdC9zcmMvY3Jvc3NEb21haW5EYW8uanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvc3JjL2VudHJpZXMvZmFrZV9jYzEyMjg2NS5qcyIsIkM6L2dpdHdpcC9TUFNjcmlwdC9zcmMvZW50cmllcy9zcHNjcmlwdC5qcyIsIkM6L2dpdHdpcC9TUFNjcmlwdC9zcmMvaGVscGVycy5qcyIsIkM6L2dpdHdpcC9TUFNjcmlwdC9zcmMvbGlzdC5qcyIsIkM6L2dpdHdpcC9TUFNjcmlwdC9zcmMvcGVybWlzc2lvbnMuanMiLCJDOi9naXR3aXAvU1BTY3JpcHQvc3JjL3Byb2ZpbGVzLmpzIiwiQzovZ2l0d2lwL1NQU2NyaXB0L3NyYy9xdWVyeVN0cmluZy5qcyIsIkM6L2dpdHdpcC9TUFNjcmlwdC9zcmMvcmVzdERhby5qcyIsIkM6L2dpdHdpcC9TUFNjcmlwdC9zcmMvc2VhcmNoLmpzIiwiQzovZ2l0d2lwL1NQU2NyaXB0L3NyYy9zcHNjcmlwdC5qcyIsIkM6L2dpdHdpcC9TUFNjcmlwdC9zcmMvdGVtcGxhdGluZy5qcyIsIkM6L2dpdHdpcC9TUFNjcmlwdC9zcmMvd2ViLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDanhEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBaZXB0byAxLjEuNiAtIHplcHRvIGV2ZW50IGFqYXggaWUgY2FsbGJhY2tzIGRlZmVycmVkIC0gemVwdG9qcy5jb20vbGljZW5zZSAqL1xyXG5cclxuXHJcblxyXG5cclxudmFyIFplcHRvID0gKGZ1bmN0aW9uKCkge1xyXG4gIHZhciB1bmRlZmluZWQsIGtleSwgJCwgY2xhc3NMaXN0LCBlbXB0eUFycmF5ID0gW10sIGNvbmNhdCA9IGVtcHR5QXJyYXkuY29uY2F0LCBmaWx0ZXIgPSBlbXB0eUFycmF5LmZpbHRlciwgc2xpY2UgPSBlbXB0eUFycmF5LnNsaWNlLFxyXG4gICAgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXHJcbiAgICBlbGVtZW50RGlzcGxheSA9IHt9LCBjbGFzc0NhY2hlID0ge30sXHJcbiAgICBjc3NOdW1iZXIgPSB7ICdjb2x1bW4tY291bnQnOiAxLCAnY29sdW1ucyc6IDEsICdmb250LXdlaWdodCc6IDEsICdsaW5lLWhlaWdodCc6IDEsJ29wYWNpdHknOiAxLCAnei1pbmRleCc6IDEsICd6b29tJzogMSB9LFxyXG4gICAgZnJhZ21lbnRSRSA9IC9eXFxzKjwoXFx3K3whKVtePl0qPi8sXHJcbiAgICBzaW5nbGVUYWdSRSA9IC9ePChcXHcrKVxccypcXC8/Pig/OjxcXC9cXDE+fCkkLyxcclxuICAgIHRhZ0V4cGFuZGVyUkUgPSAvPCg/IWFyZWF8YnJ8Y29sfGVtYmVkfGhyfGltZ3xpbnB1dHxsaW5rfG1ldGF8cGFyYW0pKChbXFx3Ol0rKVtePl0qKVxcLz4vaWcsXHJcbiAgICByb290Tm9kZVJFID0gL14oPzpib2R5fGh0bWwpJC9pLFxyXG4gICAgY2FwaXRhbFJFID0gLyhbQS1aXSkvZyxcclxuXHJcbiAgICAvLyBzcGVjaWFsIGF0dHJpYnV0ZXMgdGhhdCBzaG91bGQgYmUgZ2V0L3NldCB2aWEgbWV0aG9kIGNhbGxzXHJcbiAgICBtZXRob2RBdHRyaWJ1dGVzID0gWyd2YWwnLCAnY3NzJywgJ2h0bWwnLCAndGV4dCcsICdkYXRhJywgJ3dpZHRoJywgJ2hlaWdodCcsICdvZmZzZXQnXSxcclxuXHJcbiAgICBhZGphY2VuY3lPcGVyYXRvcnMgPSBbICdhZnRlcicsICdwcmVwZW5kJywgJ2JlZm9yZScsICdhcHBlbmQnIF0sXHJcbiAgICB0YWJsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RhYmxlJyksXHJcbiAgICB0YWJsZVJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyksXHJcbiAgICBjb250YWluZXJzID0ge1xyXG4gICAgICAndHInOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0Ym9keScpLFxyXG4gICAgICAndGJvZHknOiB0YWJsZSwgJ3RoZWFkJzogdGFibGUsICd0Zm9vdCc6IHRhYmxlLFxyXG4gICAgICAndGQnOiB0YWJsZVJvdywgJ3RoJzogdGFibGVSb3csXHJcbiAgICAgICcqJzogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgIH0sXHJcbiAgICByZWFkeVJFID0gL2NvbXBsZXRlfGxvYWRlZHxpbnRlcmFjdGl2ZS8sXHJcbiAgICBzaW1wbGVTZWxlY3RvclJFID0gL15bXFx3LV0qJC8sXHJcbiAgICBjbGFzczJ0eXBlID0ge30sXHJcbiAgICB0b1N0cmluZyA9IGNsYXNzMnR5cGUudG9TdHJpbmcsXHJcbiAgICB6ZXB0byA9IHt9LFxyXG4gICAgY2FtZWxpemUsIHVuaXEsXHJcbiAgICB0ZW1wUGFyZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXHJcbiAgICBwcm9wTWFwID0ge1xyXG4gICAgICAndGFiaW5kZXgnOiAndGFiSW5kZXgnLFxyXG4gICAgICAncmVhZG9ubHknOiAncmVhZE9ubHknLFxyXG4gICAgICAnZm9yJzogJ2h0bWxGb3InLFxyXG4gICAgICAnY2xhc3MnOiAnY2xhc3NOYW1lJyxcclxuICAgICAgJ21heGxlbmd0aCc6ICdtYXhMZW5ndGgnLFxyXG4gICAgICAnY2VsbHNwYWNpbmcnOiAnY2VsbFNwYWNpbmcnLFxyXG4gICAgICAnY2VsbHBhZGRpbmcnOiAnY2VsbFBhZGRpbmcnLFxyXG4gICAgICAncm93c3Bhbic6ICdyb3dTcGFuJyxcclxuICAgICAgJ2NvbHNwYW4nOiAnY29sU3BhbicsXHJcbiAgICAgICd1c2VtYXAnOiAndXNlTWFwJyxcclxuICAgICAgJ2ZyYW1lYm9yZGVyJzogJ2ZyYW1lQm9yZGVyJyxcclxuICAgICAgJ2NvbnRlbnRlZGl0YWJsZSc6ICdjb250ZW50RWRpdGFibGUnXHJcbiAgICB9LFxyXG4gICAgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHxcclxuICAgICAgZnVuY3Rpb24ob2JqZWN0KXsgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIEFycmF5IH1cclxuXHJcbiAgemVwdG8ubWF0Y2hlcyA9IGZ1bmN0aW9uKGVsZW1lbnQsIHNlbGVjdG9yKSB7XHJcbiAgICBpZiAoIXNlbGVjdG9yIHx8ICFlbGVtZW50IHx8IGVsZW1lbnQubm9kZVR5cGUgIT09IDEpIHJldHVybiBmYWxzZVxyXG4gICAgdmFyIG1hdGNoZXNTZWxlY3RvciA9IGVsZW1lbnQud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGVsZW1lbnQubW96TWF0Y2hlc1NlbGVjdG9yIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5vTWF0Y2hlc1NlbGVjdG9yIHx8IGVsZW1lbnQubWF0Y2hlc1NlbGVjdG9yXHJcbiAgICBpZiAobWF0Y2hlc1NlbGVjdG9yKSByZXR1cm4gbWF0Y2hlc1NlbGVjdG9yLmNhbGwoZWxlbWVudCwgc2VsZWN0b3IpXHJcbiAgICAvLyBmYWxsIGJhY2sgdG8gcGVyZm9ybWluZyBhIHNlbGVjdG9yOlxyXG4gICAgdmFyIG1hdGNoLCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGUsIHRlbXAgPSAhcGFyZW50XHJcbiAgICBpZiAodGVtcCkgKHBhcmVudCA9IHRlbXBQYXJlbnQpLmFwcGVuZENoaWxkKGVsZW1lbnQpXHJcbiAgICBtYXRjaCA9IH56ZXB0by5xc2EocGFyZW50LCBzZWxlY3RvcikuaW5kZXhPZihlbGVtZW50KVxyXG4gICAgdGVtcCAmJiB0ZW1wUGFyZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQpXHJcbiAgICByZXR1cm4gbWF0Y2hcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHR5cGUob2JqKSB7XHJcbiAgICByZXR1cm4gb2JqID09IG51bGwgPyBTdHJpbmcob2JqKSA6XHJcbiAgICAgIGNsYXNzMnR5cGVbdG9TdHJpbmcuY2FsbChvYmopXSB8fCBcIm9iamVjdFwiXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB0eXBlKHZhbHVlKSA9PSBcImZ1bmN0aW9uXCIgfVxyXG4gIGZ1bmN0aW9uIGlzV2luZG93KG9iaikgICAgIHsgcmV0dXJuIG9iaiAhPSBudWxsICYmIG9iaiA9PSBvYmoud2luZG93IH1cclxuICBmdW5jdGlvbiBpc0RvY3VtZW50KG9iaikgICB7IHJldHVybiBvYmogIT0gbnVsbCAmJiBvYmoubm9kZVR5cGUgPT0gb2JqLkRPQ1VNRU5UX05PREUgfVxyXG4gIGZ1bmN0aW9uIGlzT2JqZWN0KG9iaikgICAgIHsgcmV0dXJuIHR5cGUob2JqKSA9PSBcIm9iamVjdFwiIH1cclxuICBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xyXG4gICAgcmV0dXJuIGlzT2JqZWN0KG9iaikgJiYgIWlzV2luZG93KG9iaikgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaikgPT0gT2JqZWN0LnByb3RvdHlwZVxyXG4gIH1cclxuICBmdW5jdGlvbiBsaWtlQXJyYXkob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqLmxlbmd0aCA9PSAnbnVtYmVyJyB9XHJcblxyXG4gIGZ1bmN0aW9uIGNvbXBhY3QoYXJyYXkpIHsgcmV0dXJuIGZpbHRlci5jYWxsKGFycmF5LCBmdW5jdGlvbihpdGVtKXsgcmV0dXJuIGl0ZW0gIT0gbnVsbCB9KSB9XHJcbiAgZnVuY3Rpb24gZmxhdHRlbihhcnJheSkgeyByZXR1cm4gYXJyYXkubGVuZ3RoID4gMCA/ICQuZm4uY29uY2F0LmFwcGx5KFtdLCBhcnJheSkgOiBhcnJheSB9XHJcbiAgY2FtZWxpemUgPSBmdW5jdGlvbihzdHIpeyByZXR1cm4gc3RyLnJlcGxhY2UoLy0rKC4pPy9nLCBmdW5jdGlvbihtYXRjaCwgY2hyKXsgcmV0dXJuIGNociA/IGNoci50b1VwcGVyQ2FzZSgpIDogJycgfSkgfVxyXG4gIGZ1bmN0aW9uIGRhc2hlcml6ZShzdHIpIHtcclxuICAgIHJldHVybiBzdHIucmVwbGFjZSgvOjovZywgJy8nKVxyXG4gICAgICAgICAgIC5yZXBsYWNlKC8oW0EtWl0rKShbQS1aXVthLXpdKS9nLCAnJDFfJDInKVxyXG4gICAgICAgICAgIC5yZXBsYWNlKC8oW2EtelxcZF0pKFtBLVpdKS9nLCAnJDFfJDInKVxyXG4gICAgICAgICAgIC5yZXBsYWNlKC9fL2csICctJylcclxuICAgICAgICAgICAudG9Mb3dlckNhc2UoKVxyXG4gIH1cclxuICB1bmlxID0gZnVuY3Rpb24oYXJyYXkpeyByZXR1cm4gZmlsdGVyLmNhbGwoYXJyYXksIGZ1bmN0aW9uKGl0ZW0sIGlkeCl7IHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0pID09IGlkeCB9KSB9XHJcblxyXG4gIGZ1bmN0aW9uIGNsYXNzUkUobmFtZSkge1xyXG4gICAgcmV0dXJuIG5hbWUgaW4gY2xhc3NDYWNoZSA/XHJcbiAgICAgIGNsYXNzQ2FjaGVbbmFtZV0gOiAoY2xhc3NDYWNoZVtuYW1lXSA9IG5ldyBSZWdFeHAoJyhefFxcXFxzKScgKyBuYW1lICsgJyhcXFxcc3wkKScpKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbWF5YmVBZGRQeChuYW1lLCB2YWx1ZSkge1xyXG4gICAgcmV0dXJuICh0eXBlb2YgdmFsdWUgPT0gXCJudW1iZXJcIiAmJiAhY3NzTnVtYmVyW2Rhc2hlcml6ZShuYW1lKV0pID8gdmFsdWUgKyBcInB4XCIgOiB2YWx1ZVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZGVmYXVsdERpc3BsYXkobm9kZU5hbWUpIHtcclxuICAgIHZhciBlbGVtZW50LCBkaXNwbGF5XHJcbiAgICBpZiAoIWVsZW1lbnREaXNwbGF5W25vZGVOYW1lXSkge1xyXG4gICAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSlcclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbGVtZW50KVxyXG4gICAgICBkaXNwbGF5ID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCAnJykuZ2V0UHJvcGVydHlWYWx1ZShcImRpc3BsYXlcIilcclxuICAgICAgZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnQpXHJcbiAgICAgIGRpc3BsYXkgPT0gXCJub25lXCIgJiYgKGRpc3BsYXkgPSBcImJsb2NrXCIpXHJcbiAgICAgIGVsZW1lbnREaXNwbGF5W25vZGVOYW1lXSA9IGRpc3BsYXlcclxuICAgIH1cclxuICAgIHJldHVybiBlbGVtZW50RGlzcGxheVtub2RlTmFtZV1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNoaWxkcmVuKGVsZW1lbnQpIHtcclxuICAgIHJldHVybiAnY2hpbGRyZW4nIGluIGVsZW1lbnQgP1xyXG4gICAgICBzbGljZS5jYWxsKGVsZW1lbnQuY2hpbGRyZW4pIDpcclxuICAgICAgJC5tYXAoZWxlbWVudC5jaGlsZE5vZGVzLCBmdW5jdGlvbihub2RlKXsgaWYgKG5vZGUubm9kZVR5cGUgPT0gMSkgcmV0dXJuIG5vZGUgfSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIFooZG9tLCBzZWxlY3Rvcikge1xyXG4gICAgdmFyIGksIGxlbiA9IGRvbSA/IGRvbS5sZW5ndGggOiAwXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHRoaXNbaV0gPSBkb21baV1cclxuICAgIHRoaXMubGVuZ3RoID0gbGVuXHJcbiAgICB0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3IgfHwgJydcclxuICB9XHJcblxyXG4gIC8vIGAkLnplcHRvLmZyYWdtZW50YCB0YWtlcyBhIGh0bWwgc3RyaW5nIGFuZCBhbiBvcHRpb25hbCB0YWcgbmFtZVxyXG4gIC8vIHRvIGdlbmVyYXRlIERPTSBub2RlcyBub2RlcyBmcm9tIHRoZSBnaXZlbiBodG1sIHN0cmluZy5cclxuICAvLyBUaGUgZ2VuZXJhdGVkIERPTSBub2RlcyBhcmUgcmV0dXJuZWQgYXMgYW4gYXJyYXkuXHJcbiAgLy8gVGhpcyBmdW5jdGlvbiBjYW4gYmUgb3ZlcnJpZGVuIGluIHBsdWdpbnMgZm9yIGV4YW1wbGUgdG8gbWFrZVxyXG4gIC8vIGl0IGNvbXBhdGlibGUgd2l0aCBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgdGhlIERPTSBmdWxseS5cclxuICB6ZXB0by5mcmFnbWVudCA9IGZ1bmN0aW9uKGh0bWwsIG5hbWUsIHByb3BlcnRpZXMpIHtcclxuICAgIHZhciBkb20sIG5vZGVzLCBjb250YWluZXJcclxuXHJcbiAgICAvLyBBIHNwZWNpYWwgY2FzZSBvcHRpbWl6YXRpb24gZm9yIGEgc2luZ2xlIHRhZ1xyXG4gICAgaWYgKHNpbmdsZVRhZ1JFLnRlc3QoaHRtbCkpIGRvbSA9ICQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChSZWdFeHAuJDEpKVxyXG5cclxuICAgIGlmICghZG9tKSB7XHJcbiAgICAgIGlmIChodG1sLnJlcGxhY2UpIGh0bWwgPSBodG1sLnJlcGxhY2UodGFnRXhwYW5kZXJSRSwgXCI8JDE+PC8kMj5cIilcclxuICAgICAgaWYgKG5hbWUgPT09IHVuZGVmaW5lZCkgbmFtZSA9IGZyYWdtZW50UkUudGVzdChodG1sKSAmJiBSZWdFeHAuJDFcclxuICAgICAgaWYgKCEobmFtZSBpbiBjb250YWluZXJzKSkgbmFtZSA9ICcqJ1xyXG5cclxuICAgICAgY29udGFpbmVyID0gY29udGFpbmVyc1tuYW1lXVxyXG4gICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJycgKyBodG1sXHJcbiAgICAgIGRvbSA9ICQuZWFjaChzbGljZS5jYWxsKGNvbnRhaW5lci5jaGlsZE5vZGVzKSwgZnVuY3Rpb24oKXtcclxuICAgICAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcylcclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNQbGFpbk9iamVjdChwcm9wZXJ0aWVzKSkge1xyXG4gICAgICBub2RlcyA9ICQoZG9tKVxyXG4gICAgICAkLmVhY2gocHJvcGVydGllcywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgIGlmIChtZXRob2RBdHRyaWJ1dGVzLmluZGV4T2Yoa2V5KSA+IC0xKSBub2Rlc1trZXldKHZhbHVlKVxyXG4gICAgICAgIGVsc2Ugbm9kZXMuYXR0cihrZXksIHZhbHVlKVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBkb21cclxuICB9XHJcblxyXG4gIC8vIGAkLnplcHRvLlpgIHN3YXBzIG91dCB0aGUgcHJvdG90eXBlIG9mIHRoZSBnaXZlbiBgZG9tYCBhcnJheVxyXG4gIC8vIG9mIG5vZGVzIHdpdGggYCQuZm5gIGFuZCB0aHVzIHN1cHBseWluZyBhbGwgdGhlIFplcHRvIGZ1bmN0aW9uc1xyXG4gIC8vIHRvIHRoZSBhcnJheS4gVGhpcyBtZXRob2QgY2FuIGJlIG92ZXJyaWRlbiBpbiBwbHVnaW5zLlxyXG4gIHplcHRvLlogPSBmdW5jdGlvbihkb20sIHNlbGVjdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IFooZG9tLCBzZWxlY3RvcilcclxuICB9XHJcblxyXG4gIC8vIGAkLnplcHRvLmlzWmAgc2hvdWxkIHJldHVybiBgdHJ1ZWAgaWYgdGhlIGdpdmVuIG9iamVjdCBpcyBhIFplcHRvXHJcbiAgLy8gY29sbGVjdGlvbi4gVGhpcyBtZXRob2QgY2FuIGJlIG92ZXJyaWRlbiBpbiBwbHVnaW5zLlxyXG4gIHplcHRvLmlzWiA9IGZ1bmN0aW9uKG9iamVjdCkge1xyXG4gICAgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIHplcHRvLlpcclxuICB9XHJcblxyXG4gIC8vIGAkLnplcHRvLmluaXRgIGlzIFplcHRvJ3MgY291bnRlcnBhcnQgdG8galF1ZXJ5J3MgYCQuZm4uaW5pdGAgYW5kXHJcbiAgLy8gdGFrZXMgYSBDU1Mgc2VsZWN0b3IgYW5kIGFuIG9wdGlvbmFsIGNvbnRleHQgKGFuZCBoYW5kbGVzIHZhcmlvdXNcclxuICAvLyBzcGVjaWFsIGNhc2VzKS5cclxuICAvLyBUaGlzIG1ldGhvZCBjYW4gYmUgb3ZlcnJpZGVuIGluIHBsdWdpbnMuXHJcbiAgemVwdG8uaW5pdCA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBjb250ZXh0KSB7XHJcbiAgICB2YXIgZG9tXHJcbiAgICAvLyBJZiBub3RoaW5nIGdpdmVuLCByZXR1cm4gYW4gZW1wdHkgWmVwdG8gY29sbGVjdGlvblxyXG4gICAgaWYgKCFzZWxlY3RvcikgcmV0dXJuIHplcHRvLlooKVxyXG4gICAgLy8gT3B0aW1pemUgZm9yIHN0cmluZyBzZWxlY3RvcnNcclxuICAgIGVsc2UgaWYgKHR5cGVvZiBzZWxlY3RvciA9PSAnc3RyaW5nJykge1xyXG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yLnRyaW0oKVxyXG4gICAgICAvLyBJZiBpdCdzIGEgaHRtbCBmcmFnbWVudCwgY3JlYXRlIG5vZGVzIGZyb20gaXRcclxuICAgICAgLy8gTm90ZTogSW4gYm90aCBDaHJvbWUgMjEgYW5kIEZpcmVmb3ggMTUsIERPTSBlcnJvciAxMlxyXG4gICAgICAvLyBpcyB0aHJvd24gaWYgdGhlIGZyYWdtZW50IGRvZXNuJ3QgYmVnaW4gd2l0aCA8XHJcbiAgICAgIGlmIChzZWxlY3RvclswXSA9PSAnPCcgJiYgZnJhZ21lbnRSRS50ZXN0KHNlbGVjdG9yKSlcclxuICAgICAgICBkb20gPSB6ZXB0by5mcmFnbWVudChzZWxlY3RvciwgUmVnRXhwLiQxLCBjb250ZXh0KSwgc2VsZWN0b3IgPSBudWxsXHJcbiAgICAgIC8vIElmIHRoZXJlJ3MgYSBjb250ZXh0LCBjcmVhdGUgYSBjb2xsZWN0aW9uIG9uIHRoYXQgY29udGV4dCBmaXJzdCwgYW5kIHNlbGVjdFxyXG4gICAgICAvLyBub2RlcyBmcm9tIHRoZXJlXHJcbiAgICAgIGVsc2UgaWYgKGNvbnRleHQgIT09IHVuZGVmaW5lZCkgcmV0dXJuICQoY29udGV4dCkuZmluZChzZWxlY3RvcilcclxuICAgICAgLy8gSWYgaXQncyBhIENTUyBzZWxlY3RvciwgdXNlIGl0IHRvIHNlbGVjdCBub2Rlcy5cclxuICAgICAgZWxzZSBkb20gPSB6ZXB0by5xc2EoZG9jdW1lbnQsIHNlbGVjdG9yKVxyXG4gICAgfVxyXG4gICAgLy8gSWYgYSBmdW5jdGlvbiBpcyBnaXZlbiwgY2FsbCBpdCB3aGVuIHRoZSBET00gaXMgcmVhZHlcclxuICAgIGVsc2UgaWYgKGlzRnVuY3Rpb24oc2VsZWN0b3IpKSByZXR1cm4gJChkb2N1bWVudCkucmVhZHkoc2VsZWN0b3IpXHJcbiAgICAvLyBJZiBhIFplcHRvIGNvbGxlY3Rpb24gaXMgZ2l2ZW4sIGp1c3QgcmV0dXJuIGl0XHJcbiAgICBlbHNlIGlmICh6ZXB0by5pc1ooc2VsZWN0b3IpKSByZXR1cm4gc2VsZWN0b3JcclxuICAgIGVsc2Uge1xyXG4gICAgICAvLyBub3JtYWxpemUgYXJyYXkgaWYgYW4gYXJyYXkgb2Ygbm9kZXMgaXMgZ2l2ZW5cclxuICAgICAgaWYgKGlzQXJyYXkoc2VsZWN0b3IpKSBkb20gPSBjb21wYWN0KHNlbGVjdG9yKVxyXG4gICAgICAvLyBXcmFwIERPTSBub2Rlcy5cclxuICAgICAgZWxzZSBpZiAoaXNPYmplY3Qoc2VsZWN0b3IpKVxyXG4gICAgICAgIGRvbSA9IFtzZWxlY3Rvcl0sIHNlbGVjdG9yID0gbnVsbFxyXG4gICAgICAvLyBJZiBpdCdzIGEgaHRtbCBmcmFnbWVudCwgY3JlYXRlIG5vZGVzIGZyb20gaXRcclxuICAgICAgZWxzZSBpZiAoZnJhZ21lbnRSRS50ZXN0KHNlbGVjdG9yKSlcclxuICAgICAgICBkb20gPSB6ZXB0by5mcmFnbWVudChzZWxlY3Rvci50cmltKCksIFJlZ0V4cC4kMSwgY29udGV4dCksIHNlbGVjdG9yID0gbnVsbFxyXG4gICAgICAvLyBJZiB0aGVyZSdzIGEgY29udGV4dCwgY3JlYXRlIGEgY29sbGVjdGlvbiBvbiB0aGF0IGNvbnRleHQgZmlyc3QsIGFuZCBzZWxlY3RcclxuICAgICAgLy8gbm9kZXMgZnJvbSB0aGVyZVxyXG4gICAgICBlbHNlIGlmIChjb250ZXh0ICE9PSB1bmRlZmluZWQpIHJldHVybiAkKGNvbnRleHQpLmZpbmQoc2VsZWN0b3IpXHJcbiAgICAgIC8vIEFuZCBsYXN0IGJ1dCBubyBsZWFzdCwgaWYgaXQncyBhIENTUyBzZWxlY3RvciwgdXNlIGl0IHRvIHNlbGVjdCBub2Rlcy5cclxuICAgICAgZWxzZSBkb20gPSB6ZXB0by5xc2EoZG9jdW1lbnQsIHNlbGVjdG9yKVxyXG4gICAgfVxyXG4gICAgLy8gY3JlYXRlIGEgbmV3IFplcHRvIGNvbGxlY3Rpb24gZnJvbSB0aGUgbm9kZXMgZm91bmRcclxuICAgIHJldHVybiB6ZXB0by5aKGRvbSwgc2VsZWN0b3IpXHJcbiAgfVxyXG5cclxuICAvLyBgJGAgd2lsbCBiZSB0aGUgYmFzZSBgWmVwdG9gIG9iamVjdC4gV2hlbiBjYWxsaW5nIHRoaXNcclxuICAvLyBmdW5jdGlvbiBqdXN0IGNhbGwgYCQuemVwdG8uaW5pdCwgd2hpY2ggbWFrZXMgdGhlIGltcGxlbWVudGF0aW9uXHJcbiAgLy8gZGV0YWlscyBvZiBzZWxlY3Rpbmcgbm9kZXMgYW5kIGNyZWF0aW5nIFplcHRvIGNvbGxlY3Rpb25zXHJcbiAgLy8gcGF0Y2hhYmxlIGluIHBsdWdpbnMuXHJcbiAgJCA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBjb250ZXh0KXtcclxuICAgIHJldHVybiB6ZXB0by5pbml0KHNlbGVjdG9yLCBjb250ZXh0KVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZXh0ZW5kKHRhcmdldCwgc291cmNlLCBkZWVwKSB7XHJcbiAgICBmb3IgKGtleSBpbiBzb3VyY2UpXHJcbiAgICAgIGlmIChkZWVwICYmIChpc1BsYWluT2JqZWN0KHNvdXJjZVtrZXldKSB8fCBpc0FycmF5KHNvdXJjZVtrZXldKSkpIHtcclxuICAgICAgICBpZiAoaXNQbGFpbk9iamVjdChzb3VyY2Vba2V5XSkgJiYgIWlzUGxhaW5PYmplY3QodGFyZ2V0W2tleV0pKVxyXG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSB7fVxyXG4gICAgICAgIGlmIChpc0FycmF5KHNvdXJjZVtrZXldKSAmJiAhaXNBcnJheSh0YXJnZXRba2V5XSkpXHJcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IFtdXHJcbiAgICAgICAgZXh0ZW5kKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSwgZGVlcClcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChzb3VyY2Vba2V5XSAhPT0gdW5kZWZpbmVkKSB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXHJcbiAgfVxyXG5cclxuICAvLyBDb3B5IGFsbCBidXQgdW5kZWZpbmVkIHByb3BlcnRpZXMgZnJvbSBvbmUgb3IgbW9yZVxyXG4gIC8vIG9iamVjdHMgdG8gdGhlIGB0YXJnZXRgIG9iamVjdC5cclxuICAkLmV4dGVuZCA9IGZ1bmN0aW9uKHRhcmdldCl7XHJcbiAgICB2YXIgZGVlcCwgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxyXG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgIGRlZXAgPSB0YXJnZXRcclxuICAgICAgdGFyZ2V0ID0gYXJncy5zaGlmdCgpXHJcbiAgICB9XHJcbiAgICBhcmdzLmZvckVhY2goZnVuY3Rpb24oYXJnKXsgZXh0ZW5kKHRhcmdldCwgYXJnLCBkZWVwKSB9KVxyXG4gICAgcmV0dXJuIHRhcmdldFxyXG4gIH1cclxuXHJcbiAgLy8gYCQuemVwdG8ucXNhYCBpcyBaZXB0bydzIENTUyBzZWxlY3RvciBpbXBsZW1lbnRhdGlvbiB3aGljaFxyXG4gIC8vIHVzZXMgYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGxgIGFuZCBvcHRpbWl6ZXMgZm9yIHNvbWUgc3BlY2lhbCBjYXNlcywgbGlrZSBgI2lkYC5cclxuICAvLyBUaGlzIG1ldGhvZCBjYW4gYmUgb3ZlcnJpZGVuIGluIHBsdWdpbnMuXHJcbiAgemVwdG8ucXNhID0gZnVuY3Rpb24oZWxlbWVudCwgc2VsZWN0b3Ipe1xyXG4gICAgdmFyIGZvdW5kLFxyXG4gICAgICAgIG1heWJlSUQgPSBzZWxlY3RvclswXSA9PSAnIycsXHJcbiAgICAgICAgbWF5YmVDbGFzcyA9ICFtYXliZUlEICYmIHNlbGVjdG9yWzBdID09ICcuJyxcclxuICAgICAgICBuYW1lT25seSA9IG1heWJlSUQgfHwgbWF5YmVDbGFzcyA/IHNlbGVjdG9yLnNsaWNlKDEpIDogc2VsZWN0b3IsIC8vIEVuc3VyZSB0aGF0IGEgMSBjaGFyIHRhZyBuYW1lIHN0aWxsIGdldHMgY2hlY2tlZFxyXG4gICAgICAgIGlzU2ltcGxlID0gc2ltcGxlU2VsZWN0b3JSRS50ZXN0KG5hbWVPbmx5KVxyXG4gICAgcmV0dXJuIChlbGVtZW50LmdldEVsZW1lbnRCeUlkICYmIGlzU2ltcGxlICYmIG1heWJlSUQpID8gLy8gU2FmYXJpIERvY3VtZW50RnJhZ21lbnQgZG9lc24ndCBoYXZlIGdldEVsZW1lbnRCeUlkXHJcbiAgICAgICggKGZvdW5kID0gZWxlbWVudC5nZXRFbGVtZW50QnlJZChuYW1lT25seSkpID8gW2ZvdW5kXSA6IFtdICkgOlxyXG4gICAgICAoZWxlbWVudC5ub2RlVHlwZSAhPT0gMSAmJiBlbGVtZW50Lm5vZGVUeXBlICE9PSA5ICYmIGVsZW1lbnQubm9kZVR5cGUgIT09IDExKSA/IFtdIDpcclxuICAgICAgc2xpY2UuY2FsbChcclxuICAgICAgICBpc1NpbXBsZSAmJiAhbWF5YmVJRCAmJiBlbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgPyAvLyBEb2N1bWVudEZyYWdtZW50IGRvZXNuJ3QgaGF2ZSBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lL1RhZ05hbWVcclxuICAgICAgICAgIG1heWJlQ2xhc3MgPyBlbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUobmFtZU9ubHkpIDogLy8gSWYgaXQncyBzaW1wbGUsIGl0IGNvdWxkIGJlIGEgY2xhc3NcclxuICAgICAgICAgIGVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoc2VsZWN0b3IpIDogLy8gT3IgYSB0YWdcclxuICAgICAgICAgIGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikgLy8gT3IgaXQncyBub3Qgc2ltcGxlLCBhbmQgd2UgbmVlZCB0byBxdWVyeSBhbGxcclxuICAgICAgKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZmlsdGVyZWQobm9kZXMsIHNlbGVjdG9yKSB7XHJcbiAgICByZXR1cm4gc2VsZWN0b3IgPT0gbnVsbCA/ICQobm9kZXMpIDogJChub2RlcykuZmlsdGVyKHNlbGVjdG9yKVxyXG4gIH1cclxuXHJcbiAgJC5jb250YWlucyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jb250YWlucyA/XHJcbiAgICBmdW5jdGlvbihwYXJlbnQsIG5vZGUpIHtcclxuICAgICAgcmV0dXJuIHBhcmVudCAhPT0gbm9kZSAmJiBwYXJlbnQuY29udGFpbnMobm9kZSlcclxuICAgIH0gOlxyXG4gICAgZnVuY3Rpb24ocGFyZW50LCBub2RlKSB7XHJcbiAgICAgIHdoaWxlIChub2RlICYmIChub2RlID0gbm9kZS5wYXJlbnROb2RlKSlcclxuICAgICAgICBpZiAobm9kZSA9PT0gcGFyZW50KSByZXR1cm4gdHJ1ZVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuXHJcbiAgZnVuY3Rpb24gZnVuY0FyZyhjb250ZXh0LCBhcmcsIGlkeCwgcGF5bG9hZCkge1xyXG4gICAgcmV0dXJuIGlzRnVuY3Rpb24oYXJnKSA/IGFyZy5jYWxsKGNvbnRleHQsIGlkeCwgcGF5bG9hZCkgOiBhcmdcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNldEF0dHJpYnV0ZShub2RlLCBuYW1lLCB2YWx1ZSkge1xyXG4gICAgdmFsdWUgPT0gbnVsbCA/IG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpIDogbm9kZS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpXHJcbiAgfVxyXG5cclxuICAvLyBhY2Nlc3MgY2xhc3NOYW1lIHByb3BlcnR5IHdoaWxlIHJlc3BlY3RpbmcgU1ZHQW5pbWF0ZWRTdHJpbmdcclxuICBmdW5jdGlvbiBjbGFzc05hbWUobm9kZSwgdmFsdWUpe1xyXG4gICAgdmFyIGtsYXNzID0gbm9kZS5jbGFzc05hbWUgfHwgJycsXHJcbiAgICAgICAgc3ZnICAgPSBrbGFzcyAmJiBrbGFzcy5iYXNlVmFsICE9PSB1bmRlZmluZWRcclxuXHJcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHN2ZyA/IGtsYXNzLmJhc2VWYWwgOiBrbGFzc1xyXG4gICAgc3ZnID8gKGtsYXNzLmJhc2VWYWwgPSB2YWx1ZSkgOiAobm9kZS5jbGFzc05hbWUgPSB2YWx1ZSlcclxuICB9XHJcblxyXG4gIC8vIFwidHJ1ZVwiICA9PiB0cnVlXHJcbiAgLy8gXCJmYWxzZVwiID0+IGZhbHNlXHJcbiAgLy8gXCJudWxsXCIgID0+IG51bGxcclxuICAvLyBcIjQyXCIgICAgPT4gNDJcclxuICAvLyBcIjQyLjVcIiAgPT4gNDIuNVxyXG4gIC8vIFwiMDhcIiAgICA9PiBcIjA4XCJcclxuICAvLyBKU09OICAgID0+IHBhcnNlIGlmIHZhbGlkXHJcbiAgLy8gU3RyaW5nICA9PiBzZWxmXHJcbiAgZnVuY3Rpb24gZGVzZXJpYWxpemVWYWx1ZSh2YWx1ZSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgcmV0dXJuIHZhbHVlID9cclxuICAgICAgICB2YWx1ZSA9PSBcInRydWVcIiB8fFxyXG4gICAgICAgICggdmFsdWUgPT0gXCJmYWxzZVwiID8gZmFsc2UgOlxyXG4gICAgICAgICAgdmFsdWUgPT0gXCJudWxsXCIgPyBudWxsIDpcclxuICAgICAgICAgICt2YWx1ZSArIFwiXCIgPT0gdmFsdWUgPyArdmFsdWUgOlxyXG4gICAgICAgICAgL15bXFxbXFx7XS8udGVzdCh2YWx1ZSkgPyAkLnBhcnNlSlNPTih2YWx1ZSkgOlxyXG4gICAgICAgICAgdmFsdWUgKVxyXG4gICAgICAgIDogdmFsdWVcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICByZXR1cm4gdmFsdWVcclxuICAgIH1cclxuICB9XHJcblxyXG4gICQudHlwZSA9IHR5cGVcclxuICAkLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uXHJcbiAgJC5pc1dpbmRvdyA9IGlzV2luZG93XHJcbiAgJC5pc0FycmF5ID0gaXNBcnJheVxyXG4gICQuaXNQbGFpbk9iamVjdCA9IGlzUGxhaW5PYmplY3RcclxuXHJcbiAgJC5pc0VtcHR5T2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgICB2YXIgbmFtZVxyXG4gICAgZm9yIChuYW1lIGluIG9iaikgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG4gIH1cclxuXHJcbiAgJC5pbkFycmF5ID0gZnVuY3Rpb24oZWxlbSwgYXJyYXksIGkpe1xyXG4gICAgcmV0dXJuIGVtcHR5QXJyYXkuaW5kZXhPZi5jYWxsKGFycmF5LCBlbGVtLCBpKVxyXG4gIH1cclxuXHJcbiAgJC5jYW1lbENhc2UgPSBjYW1lbGl6ZVxyXG4gICQudHJpbSA9IGZ1bmN0aW9uKHN0cikge1xyXG4gICAgcmV0dXJuIHN0ciA9PSBudWxsID8gXCJcIiA6IFN0cmluZy5wcm90b3R5cGUudHJpbS5jYWxsKHN0cilcclxuICB9XHJcblxyXG4gIC8vIHBsdWdpbiBjb21wYXRpYmlsaXR5XHJcbiAgJC51dWlkID0gMFxyXG4gICQuc3VwcG9ydCA9IHsgfVxyXG4gICQuZXhwciA9IHsgfVxyXG4gICQubm9vcCA9IGZ1bmN0aW9uKCkge31cclxuXHJcbiAgJC5tYXAgPSBmdW5jdGlvbihlbGVtZW50cywgY2FsbGJhY2spe1xyXG4gICAgdmFyIHZhbHVlLCB2YWx1ZXMgPSBbXSwgaSwga2V5XHJcbiAgICBpZiAobGlrZUFycmF5KGVsZW1lbnRzKSlcclxuICAgICAgZm9yIChpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFsdWUgPSBjYWxsYmFjayhlbGVtZW50c1tpXSwgaSlcclxuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkgdmFsdWVzLnB1c2godmFsdWUpXHJcbiAgICAgIH1cclxuICAgIGVsc2VcclxuICAgICAgZm9yIChrZXkgaW4gZWxlbWVudHMpIHtcclxuICAgICAgICB2YWx1ZSA9IGNhbGxiYWNrKGVsZW1lbnRzW2tleV0sIGtleSlcclxuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkgdmFsdWVzLnB1c2godmFsdWUpXHJcbiAgICAgIH1cclxuICAgIHJldHVybiBmbGF0dGVuKHZhbHVlcylcclxuICB9XHJcblxyXG4gICQuZWFjaCA9IGZ1bmN0aW9uKGVsZW1lbnRzLCBjYWxsYmFjayl7XHJcbiAgICB2YXIgaSwga2V5XHJcbiAgICBpZiAobGlrZUFycmF5KGVsZW1lbnRzKSkge1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgaWYgKGNhbGxiYWNrLmNhbGwoZWxlbWVudHNbaV0sIGksIGVsZW1lbnRzW2ldKSA9PT0gZmFsc2UpIHJldHVybiBlbGVtZW50c1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yIChrZXkgaW4gZWxlbWVudHMpXHJcbiAgICAgICAgaWYgKGNhbGxiYWNrLmNhbGwoZWxlbWVudHNba2V5XSwga2V5LCBlbGVtZW50c1trZXldKSA9PT0gZmFsc2UpIHJldHVybiBlbGVtZW50c1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlbGVtZW50c1xyXG4gIH1cclxuXHJcbiAgJC5ncmVwID0gZnVuY3Rpb24oZWxlbWVudHMsIGNhbGxiYWNrKXtcclxuICAgIHJldHVybiBmaWx0ZXIuY2FsbChlbGVtZW50cywgY2FsbGJhY2spXHJcbiAgfVxyXG5cclxuICBpZiAod2luZG93LkpTT04pICQucGFyc2VKU09OID0gSlNPTi5wYXJzZVxyXG5cclxuICAvLyBQb3B1bGF0ZSB0aGUgY2xhc3MydHlwZSBtYXBcclxuICAkLmVhY2goXCJCb29sZWFuIE51bWJlciBTdHJpbmcgRnVuY3Rpb24gQXJyYXkgRGF0ZSBSZWdFeHAgT2JqZWN0IEVycm9yXCIuc3BsaXQoXCIgXCIpLCBmdW5jdGlvbihpLCBuYW1lKSB7XHJcbiAgICBjbGFzczJ0eXBlWyBcIltvYmplY3QgXCIgKyBuYW1lICsgXCJdXCIgXSA9IG5hbWUudG9Mb3dlckNhc2UoKVxyXG4gIH0pXHJcblxyXG4gIC8vIERlZmluZSBtZXRob2RzIHRoYXQgd2lsbCBiZSBhdmFpbGFibGUgb24gYWxsXHJcbiAgLy8gWmVwdG8gY29sbGVjdGlvbnNcclxuICAkLmZuID0ge1xyXG4gICAgY29uc3RydWN0b3I6IHplcHRvLlosXHJcbiAgICBsZW5ndGg6IDAsXHJcblxyXG4gICAgLy8gQmVjYXVzZSBhIGNvbGxlY3Rpb24gYWN0cyBsaWtlIGFuIGFycmF5XHJcbiAgICAvLyBjb3B5IG92ZXIgdGhlc2UgdXNlZnVsIGFycmF5IGZ1bmN0aW9ucy5cclxuICAgIGZvckVhY2g6IGVtcHR5QXJyYXkuZm9yRWFjaCxcclxuICAgIHJlZHVjZTogZW1wdHlBcnJheS5yZWR1Y2UsXHJcbiAgICBwdXNoOiBlbXB0eUFycmF5LnB1c2gsXHJcbiAgICBzb3J0OiBlbXB0eUFycmF5LnNvcnQsXHJcbiAgICBzcGxpY2U6IGVtcHR5QXJyYXkuc3BsaWNlLFxyXG4gICAgaW5kZXhPZjogZW1wdHlBcnJheS5pbmRleE9mLFxyXG4gICAgY29uY2F0OiBmdW5jdGlvbigpe1xyXG4gICAgICB2YXIgaSwgdmFsdWUsIGFyZ3MgPSBbXVxyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFsdWUgPSBhcmd1bWVudHNbaV1cclxuICAgICAgICBhcmdzW2ldID0gemVwdG8uaXNaKHZhbHVlKSA/IHZhbHVlLnRvQXJyYXkoKSA6IHZhbHVlXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNvbmNhdC5hcHBseSh6ZXB0by5pc1oodGhpcykgPyB0aGlzLnRvQXJyYXkoKSA6IHRoaXMsIGFyZ3MpXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGBtYXBgIGFuZCBgc2xpY2VgIGluIHRoZSBqUXVlcnkgQVBJIHdvcmsgZGlmZmVyZW50bHlcclxuICAgIC8vIGZyb20gdGhlaXIgYXJyYXkgY291bnRlcnBhcnRzXHJcbiAgICBtYXA6IGZ1bmN0aW9uKGZuKXtcclxuICAgICAgcmV0dXJuICQoJC5tYXAodGhpcywgZnVuY3Rpb24oZWwsIGkpeyByZXR1cm4gZm4uY2FsbChlbCwgaSwgZWwpIH0pKVxyXG4gICAgfSxcclxuICAgIHNsaWNlOiBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4gJChzbGljZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKVxyXG4gICAgfSxcclxuXHJcbiAgICByZWFkeTogZnVuY3Rpb24oY2FsbGJhY2spe1xyXG4gICAgICAvLyBuZWVkIHRvIGNoZWNrIGlmIGRvY3VtZW50LmJvZHkgZXhpc3RzIGZvciBJRSBhcyB0aGF0IGJyb3dzZXIgcmVwb3J0c1xyXG4gICAgICAvLyBkb2N1bWVudCByZWFkeSB3aGVuIGl0IGhhc24ndCB5ZXQgY3JlYXRlZCB0aGUgYm9keSBlbGVtZW50XHJcbiAgICAgIGlmIChyZWFkeVJFLnRlc3QoZG9jdW1lbnQucmVhZHlTdGF0ZSkgJiYgZG9jdW1lbnQuYm9keSkgY2FsbGJhY2soJClcclxuICAgICAgZWxzZSBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKXsgY2FsbGJhY2soJCkgfSwgZmFsc2UpXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9LFxyXG4gICAgZ2V0OiBmdW5jdGlvbihpZHgpe1xyXG4gICAgICByZXR1cm4gaWR4ID09PSB1bmRlZmluZWQgPyBzbGljZS5jYWxsKHRoaXMpIDogdGhpc1tpZHggPj0gMCA/IGlkeCA6IGlkeCArIHRoaXMubGVuZ3RoXVxyXG4gICAgfSxcclxuICAgIHRvQXJyYXk6IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzLmdldCgpIH0sXHJcbiAgICBzaXplOiBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4gdGhpcy5sZW5ndGhcclxuICAgIH0sXHJcbiAgICByZW1vdmU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnROb2RlICE9IG51bGwpXHJcbiAgICAgICAgICB0aGlzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcylcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBlYWNoOiBmdW5jdGlvbihjYWxsYmFjayl7XHJcbiAgICAgIGVtcHR5QXJyYXkuZXZlcnkuY2FsbCh0aGlzLCBmdW5jdGlvbihlbCwgaWR4KXtcclxuICAgICAgICByZXR1cm4gY2FsbGJhY2suY2FsbChlbCwgaWR4LCBlbCkgIT09IGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9LFxyXG4gICAgZmlsdGVyOiBmdW5jdGlvbihzZWxlY3Rvcil7XHJcbiAgICAgIGlmIChpc0Z1bmN0aW9uKHNlbGVjdG9yKSkgcmV0dXJuIHRoaXMubm90KHRoaXMubm90KHNlbGVjdG9yKSlcclxuICAgICAgcmV0dXJuICQoZmlsdGVyLmNhbGwodGhpcywgZnVuY3Rpb24oZWxlbWVudCl7XHJcbiAgICAgICAgcmV0dXJuIHplcHRvLm1hdGNoZXMoZWxlbWVudCwgc2VsZWN0b3IpXHJcbiAgICAgIH0pKVxyXG4gICAgfSxcclxuICAgIGFkZDogZnVuY3Rpb24oc2VsZWN0b3IsY29udGV4dCl7XHJcbiAgICAgIHJldHVybiAkKHVuaXEodGhpcy5jb25jYXQoJChzZWxlY3Rvcixjb250ZXh0KSkpKVxyXG4gICAgfSxcclxuICAgIGlzOiBmdW5jdGlvbihzZWxlY3Rvcil7XHJcbiAgICAgIHJldHVybiB0aGlzLmxlbmd0aCA+IDAgJiYgemVwdG8ubWF0Y2hlcyh0aGlzWzBdLCBzZWxlY3RvcilcclxuICAgIH0sXHJcbiAgICBub3Q6IGZ1bmN0aW9uKHNlbGVjdG9yKXtcclxuICAgICAgdmFyIG5vZGVzPVtdXHJcbiAgICAgIGlmIChpc0Z1bmN0aW9uKHNlbGVjdG9yKSAmJiBzZWxlY3Rvci5jYWxsICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKGlkeCl7XHJcbiAgICAgICAgICBpZiAoIXNlbGVjdG9yLmNhbGwodGhpcyxpZHgpKSBub2Rlcy5wdXNoKHRoaXMpXHJcbiAgICAgICAgfSlcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGV4Y2x1ZGVzID0gdHlwZW9mIHNlbGVjdG9yID09ICdzdHJpbmcnID8gdGhpcy5maWx0ZXIoc2VsZWN0b3IpIDpcclxuICAgICAgICAgIChsaWtlQXJyYXkoc2VsZWN0b3IpICYmIGlzRnVuY3Rpb24oc2VsZWN0b3IuaXRlbSkpID8gc2xpY2UuY2FsbChzZWxlY3RvcikgOiAkKHNlbGVjdG9yKVxyXG4gICAgICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbihlbCl7XHJcbiAgICAgICAgICBpZiAoZXhjbHVkZXMuaW5kZXhPZihlbCkgPCAwKSBub2Rlcy5wdXNoKGVsKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuICQobm9kZXMpXHJcbiAgICB9LFxyXG4gICAgaGFzOiBmdW5jdGlvbihzZWxlY3Rvcil7XHJcbiAgICAgIHJldHVybiB0aGlzLmZpbHRlcihmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiBpc09iamVjdChzZWxlY3RvcikgP1xyXG4gICAgICAgICAgJC5jb250YWlucyh0aGlzLCBzZWxlY3RvcikgOlxyXG4gICAgICAgICAgJCh0aGlzKS5maW5kKHNlbGVjdG9yKS5zaXplKClcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBlcTogZnVuY3Rpb24oaWR4KXtcclxuICAgICAgcmV0dXJuIGlkeCA9PT0gLTEgPyB0aGlzLnNsaWNlKGlkeCkgOiB0aGlzLnNsaWNlKGlkeCwgKyBpZHggKyAxKVxyXG4gICAgfSxcclxuICAgIGZpcnN0OiBmdW5jdGlvbigpe1xyXG4gICAgICB2YXIgZWwgPSB0aGlzWzBdXHJcbiAgICAgIHJldHVybiBlbCAmJiAhaXNPYmplY3QoZWwpID8gZWwgOiAkKGVsKVxyXG4gICAgfSxcclxuICAgIGxhc3Q6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHZhciBlbCA9IHRoaXNbdGhpcy5sZW5ndGggLSAxXVxyXG4gICAgICByZXR1cm4gZWwgJiYgIWlzT2JqZWN0KGVsKSA/IGVsIDogJChlbClcclxuICAgIH0sXHJcbiAgICBmaW5kOiBmdW5jdGlvbihzZWxlY3Rvcil7XHJcbiAgICAgIHZhciByZXN1bHQsICR0aGlzID0gdGhpc1xyXG4gICAgICBpZiAoIXNlbGVjdG9yKSByZXN1bHQgPSAkKClcclxuICAgICAgZWxzZSBpZiAodHlwZW9mIHNlbGVjdG9yID09ICdvYmplY3QnKVxyXG4gICAgICAgIHJlc3VsdCA9ICQoc2VsZWN0b3IpLmZpbHRlcihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgdmFyIG5vZGUgPSB0aGlzXHJcbiAgICAgICAgICByZXR1cm4gZW1wdHlBcnJheS5zb21lLmNhbGwoJHRoaXMsIGZ1bmN0aW9uKHBhcmVudCl7XHJcbiAgICAgICAgICAgIHJldHVybiAkLmNvbnRhaW5zKHBhcmVudCwgbm9kZSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgICAgZWxzZSBpZiAodGhpcy5sZW5ndGggPT0gMSkgcmVzdWx0ID0gJCh6ZXB0by5xc2EodGhpc1swXSwgc2VsZWN0b3IpKVxyXG4gICAgICBlbHNlIHJlc3VsdCA9IHRoaXMubWFwKGZ1bmN0aW9uKCl7IHJldHVybiB6ZXB0by5xc2EodGhpcywgc2VsZWN0b3IpIH0pXHJcbiAgICAgIHJldHVybiByZXN1bHRcclxuICAgIH0sXHJcbiAgICBjbG9zZXN0OiBmdW5jdGlvbihzZWxlY3RvciwgY29udGV4dCl7XHJcbiAgICAgIHZhciBub2RlID0gdGhpc1swXSwgY29sbGVjdGlvbiA9IGZhbHNlXHJcbiAgICAgIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT0gJ29iamVjdCcpIGNvbGxlY3Rpb24gPSAkKHNlbGVjdG9yKVxyXG4gICAgICB3aGlsZSAobm9kZSAmJiAhKGNvbGxlY3Rpb24gPyBjb2xsZWN0aW9uLmluZGV4T2Yobm9kZSkgPj0gMCA6IHplcHRvLm1hdGNoZXMobm9kZSwgc2VsZWN0b3IpKSlcclxuICAgICAgICBub2RlID0gbm9kZSAhPT0gY29udGV4dCAmJiAhaXNEb2N1bWVudChub2RlKSAmJiBub2RlLnBhcmVudE5vZGVcclxuICAgICAgcmV0dXJuICQobm9kZSlcclxuICAgIH0sXHJcbiAgICBwYXJlbnRzOiBmdW5jdGlvbihzZWxlY3Rvcil7XHJcbiAgICAgIHZhciBhbmNlc3RvcnMgPSBbXSwgbm9kZXMgPSB0aGlzXHJcbiAgICAgIHdoaWxlIChub2Rlcy5sZW5ndGggPiAwKVxyXG4gICAgICAgIG5vZGVzID0gJC5tYXAobm9kZXMsIGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICAgICAgaWYgKChub2RlID0gbm9kZS5wYXJlbnROb2RlKSAmJiAhaXNEb2N1bWVudChub2RlKSAmJiBhbmNlc3RvcnMuaW5kZXhPZihub2RlKSA8IDApIHtcclxuICAgICAgICAgICAgYW5jZXN0b3JzLnB1c2gobm9kZSlcclxuICAgICAgICAgICAgcmV0dXJuIG5vZGVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICByZXR1cm4gZmlsdGVyZWQoYW5jZXN0b3JzLCBzZWxlY3RvcilcclxuICAgIH0sXHJcbiAgICBwYXJlbnQ6IGZ1bmN0aW9uKHNlbGVjdG9yKXtcclxuICAgICAgcmV0dXJuIGZpbHRlcmVkKHVuaXEodGhpcy5wbHVjaygncGFyZW50Tm9kZScpKSwgc2VsZWN0b3IpXHJcbiAgICB9LFxyXG4gICAgY2hpbGRyZW46IGZ1bmN0aW9uKHNlbGVjdG9yKXtcclxuICAgICAgcmV0dXJuIGZpbHRlcmVkKHRoaXMubWFwKGZ1bmN0aW9uKCl7IHJldHVybiBjaGlsZHJlbih0aGlzKSB9KSwgc2VsZWN0b3IpXHJcbiAgICB9LFxyXG4gICAgY29udGVudHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmNvbnRlbnREb2N1bWVudCB8fCBzbGljZS5jYWxsKHRoaXMuY2hpbGROb2RlcykgfSlcclxuICAgIH0sXHJcbiAgICBzaWJsaW5nczogZnVuY3Rpb24oc2VsZWN0b3Ipe1xyXG4gICAgICByZXR1cm4gZmlsdGVyZWQodGhpcy5tYXAoZnVuY3Rpb24oaSwgZWwpe1xyXG4gICAgICAgIHJldHVybiBmaWx0ZXIuY2FsbChjaGlsZHJlbihlbC5wYXJlbnROb2RlKSwgZnVuY3Rpb24oY2hpbGQpeyByZXR1cm4gY2hpbGQhPT1lbCB9KVxyXG4gICAgICB9KSwgc2VsZWN0b3IpXHJcbiAgICB9LFxyXG4gICAgZW1wdHk6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXsgdGhpcy5pbm5lckhUTUwgPSAnJyB9KVxyXG4gICAgfSxcclxuICAgIC8vIGBwbHVja2AgaXMgYm9ycm93ZWQgZnJvbSBQcm90b3R5cGUuanNcclxuICAgIHBsdWNrOiBmdW5jdGlvbihwcm9wZXJ0eSl7XHJcbiAgICAgIHJldHVybiAkLm1hcCh0aGlzLCBmdW5jdGlvbihlbCl7IHJldHVybiBlbFtwcm9wZXJ0eV0gfSlcclxuICAgIH0sXHJcbiAgICBzaG93OiBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5zdHlsZS5kaXNwbGF5ID09IFwibm9uZVwiICYmICh0aGlzLnN0eWxlLmRpc3BsYXkgPSAnJylcclxuICAgICAgICBpZiAoZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLCAnJykuZ2V0UHJvcGVydHlWYWx1ZShcImRpc3BsYXlcIikgPT0gXCJub25lXCIpXHJcbiAgICAgICAgICB0aGlzLnN0eWxlLmRpc3BsYXkgPSBkZWZhdWx0RGlzcGxheSh0aGlzLm5vZGVOYW1lKVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIHJlcGxhY2VXaXRoOiBmdW5jdGlvbihuZXdDb250ZW50KXtcclxuICAgICAgcmV0dXJuIHRoaXMuYmVmb3JlKG5ld0NvbnRlbnQpLnJlbW92ZSgpXHJcbiAgICB9LFxyXG4gICAgd3JhcDogZnVuY3Rpb24oc3RydWN0dXJlKXtcclxuICAgICAgdmFyIGZ1bmMgPSBpc0Z1bmN0aW9uKHN0cnVjdHVyZSlcclxuICAgICAgaWYgKHRoaXNbMF0gJiYgIWZ1bmMpXHJcbiAgICAgICAgdmFyIGRvbSAgID0gJChzdHJ1Y3R1cmUpLmdldCgwKSxcclxuICAgICAgICAgICAgY2xvbmUgPSBkb20ucGFyZW50Tm9kZSB8fCB0aGlzLmxlbmd0aCA+IDFcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaW5kZXgpe1xyXG4gICAgICAgICQodGhpcykud3JhcEFsbChcclxuICAgICAgICAgIGZ1bmMgPyBzdHJ1Y3R1cmUuY2FsbCh0aGlzLCBpbmRleCkgOlxyXG4gICAgICAgICAgICBjbG9uZSA/IGRvbS5jbG9uZU5vZGUodHJ1ZSkgOiBkb21cclxuICAgICAgICApXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgd3JhcEFsbDogZnVuY3Rpb24oc3RydWN0dXJlKXtcclxuICAgICAgaWYgKHRoaXNbMF0pIHtcclxuICAgICAgICAkKHRoaXNbMF0pLmJlZm9yZShzdHJ1Y3R1cmUgPSAkKHN0cnVjdHVyZSkpXHJcbiAgICAgICAgdmFyIGNoaWxkcmVuXHJcbiAgICAgICAgLy8gZHJpbGwgZG93biB0byB0aGUgaW5tb3N0IGVsZW1lbnRcclxuICAgICAgICB3aGlsZSAoKGNoaWxkcmVuID0gc3RydWN0dXJlLmNoaWxkcmVuKCkpLmxlbmd0aCkgc3RydWN0dXJlID0gY2hpbGRyZW4uZmlyc3QoKVxyXG4gICAgICAgICQoc3RydWN0dXJlKS5hcHBlbmQodGhpcylcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdGhpc1xyXG4gICAgfSxcclxuICAgIHdyYXBJbm5lcjogZnVuY3Rpb24oc3RydWN0dXJlKXtcclxuICAgICAgdmFyIGZ1bmMgPSBpc0Z1bmN0aW9uKHN0cnVjdHVyZSlcclxuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpbmRleCl7XHJcbiAgICAgICAgdmFyIHNlbGYgPSAkKHRoaXMpLCBjb250ZW50cyA9IHNlbGYuY29udGVudHMoKSxcclxuICAgICAgICAgICAgZG9tICA9IGZ1bmMgPyBzdHJ1Y3R1cmUuY2FsbCh0aGlzLCBpbmRleCkgOiBzdHJ1Y3R1cmVcclxuICAgICAgICBjb250ZW50cy5sZW5ndGggPyBjb250ZW50cy53cmFwQWxsKGRvbSkgOiBzZWxmLmFwcGVuZChkb20pXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgdW53cmFwOiBmdW5jdGlvbigpe1xyXG4gICAgICB0aGlzLnBhcmVudCgpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAkKHRoaXMpLnJlcGxhY2VXaXRoKCQodGhpcykuY2hpbGRyZW4oKSlcclxuICAgICAgfSlcclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH0sXHJcbiAgICBjbG9uZTogZnVuY3Rpb24oKXtcclxuICAgICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzLmNsb25lTm9kZSh0cnVlKSB9KVxyXG4gICAgfSxcclxuICAgIGhpZGU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiB0aGlzLmNzcyhcImRpc3BsYXlcIiwgXCJub25lXCIpXHJcbiAgICB9LFxyXG4gICAgdG9nZ2xlOiBmdW5jdGlvbihzZXR0aW5nKXtcclxuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBlbCA9ICQodGhpcylcclxuICAgICAgICA7KHNldHRpbmcgPT09IHVuZGVmaW5lZCA/IGVsLmNzcyhcImRpc3BsYXlcIikgPT0gXCJub25lXCIgOiBzZXR0aW5nKSA/IGVsLnNob3coKSA6IGVsLmhpZGUoKVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIHByZXY6IGZ1bmN0aW9uKHNlbGVjdG9yKXsgcmV0dXJuICQodGhpcy5wbHVjaygncHJldmlvdXNFbGVtZW50U2libGluZycpKS5maWx0ZXIoc2VsZWN0b3IgfHwgJyonKSB9LFxyXG4gICAgbmV4dDogZnVuY3Rpb24oc2VsZWN0b3IpeyByZXR1cm4gJCh0aGlzLnBsdWNrKCduZXh0RWxlbWVudFNpYmxpbmcnKSkuZmlsdGVyKHNlbGVjdG9yIHx8ICcqJykgfSxcclxuICAgIGh0bWw6IGZ1bmN0aW9uKGh0bWwpe1xyXG4gICAgICByZXR1cm4gMCBpbiBhcmd1bWVudHMgP1xyXG4gICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbihpZHgpe1xyXG4gICAgICAgICAgdmFyIG9yaWdpbkh0bWwgPSB0aGlzLmlubmVySFRNTFxyXG4gICAgICAgICAgJCh0aGlzKS5lbXB0eSgpLmFwcGVuZCggZnVuY0FyZyh0aGlzLCBodG1sLCBpZHgsIG9yaWdpbkh0bWwpIClcclxuICAgICAgICB9KSA6XHJcbiAgICAgICAgKDAgaW4gdGhpcyA/IHRoaXNbMF0uaW5uZXJIVE1MIDogbnVsbClcclxuICAgIH0sXHJcbiAgICB0ZXh0OiBmdW5jdGlvbih0ZXh0KXtcclxuICAgICAgcmV0dXJuIDAgaW4gYXJndW1lbnRzID9cclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oaWR4KXtcclxuICAgICAgICAgIHZhciBuZXdUZXh0ID0gZnVuY0FyZyh0aGlzLCB0ZXh0LCBpZHgsIHRoaXMudGV4dENvbnRlbnQpXHJcbiAgICAgICAgICB0aGlzLnRleHRDb250ZW50ID0gbmV3VGV4dCA9PSBudWxsID8gJycgOiAnJytuZXdUZXh0XHJcbiAgICAgICAgfSkgOlxyXG4gICAgICAgICgwIGluIHRoaXMgPyB0aGlzWzBdLnRleHRDb250ZW50IDogbnVsbClcclxuICAgIH0sXHJcbiAgICBhdHRyOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSl7XHJcbiAgICAgIHZhciByZXN1bHRcclxuICAgICAgcmV0dXJuICh0eXBlb2YgbmFtZSA9PSAnc3RyaW5nJyAmJiAhKDEgaW4gYXJndW1lbnRzKSkgP1xyXG4gICAgICAgICghdGhpcy5sZW5ndGggfHwgdGhpc1swXS5ub2RlVHlwZSAhPT0gMSA/IHVuZGVmaW5lZCA6XHJcbiAgICAgICAgICAoIShyZXN1bHQgPSB0aGlzWzBdLmdldEF0dHJpYnV0ZShuYW1lKSkgJiYgbmFtZSBpbiB0aGlzWzBdKSA/IHRoaXNbMF1bbmFtZV0gOiByZXN1bHRcclxuICAgICAgICApIDpcclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oaWR4KXtcclxuICAgICAgICAgIGlmICh0aGlzLm5vZGVUeXBlICE9PSAxKSByZXR1cm5cclxuICAgICAgICAgIGlmIChpc09iamVjdChuYW1lKSkgZm9yIChrZXkgaW4gbmFtZSkgc2V0QXR0cmlidXRlKHRoaXMsIGtleSwgbmFtZVtrZXldKVxyXG4gICAgICAgICAgZWxzZSBzZXRBdHRyaWJ1dGUodGhpcywgbmFtZSwgZnVuY0FyZyh0aGlzLCB2YWx1ZSwgaWR4LCB0aGlzLmdldEF0dHJpYnV0ZShuYW1lKSkpXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICByZW1vdmVBdHRyOiBmdW5jdGlvbihuYW1lKXtcclxuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpeyB0aGlzLm5vZGVUeXBlID09PSAxICYmIG5hbWUuc3BsaXQoJyAnKS5mb3JFYWNoKGZ1bmN0aW9uKGF0dHJpYnV0ZSl7XHJcbiAgICAgICAgc2V0QXR0cmlidXRlKHRoaXMsIGF0dHJpYnV0ZSlcclxuICAgICAgfSwgdGhpcyl9KVxyXG4gICAgfSxcclxuICAgIHByb3A6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKXtcclxuICAgICAgbmFtZSA9IHByb3BNYXBbbmFtZV0gfHwgbmFtZVxyXG4gICAgICByZXR1cm4gKDEgaW4gYXJndW1lbnRzKSA/XHJcbiAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKGlkeCl7XHJcbiAgICAgICAgICB0aGlzW25hbWVdID0gZnVuY0FyZyh0aGlzLCB2YWx1ZSwgaWR4LCB0aGlzW25hbWVdKVxyXG4gICAgICAgIH0pIDpcclxuICAgICAgICAodGhpc1swXSAmJiB0aGlzWzBdW25hbWVdKVxyXG4gICAgfSxcclxuICAgIGRhdGE6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKXtcclxuICAgICAgdmFyIGF0dHJOYW1lID0gJ2RhdGEtJyArIG5hbWUucmVwbGFjZShjYXBpdGFsUkUsICctJDEnKS50b0xvd2VyQ2FzZSgpXHJcblxyXG4gICAgICB2YXIgZGF0YSA9ICgxIGluIGFyZ3VtZW50cykgP1xyXG4gICAgICAgIHRoaXMuYXR0cihhdHRyTmFtZSwgdmFsdWUpIDpcclxuICAgICAgICB0aGlzLmF0dHIoYXR0ck5hbWUpXHJcblxyXG4gICAgICByZXR1cm4gZGF0YSAhPT0gbnVsbCA/IGRlc2VyaWFsaXplVmFsdWUoZGF0YSkgOiB1bmRlZmluZWRcclxuICAgIH0sXHJcbiAgICB2YWw6IGZ1bmN0aW9uKHZhbHVlKXtcclxuICAgICAgcmV0dXJuIDAgaW4gYXJndW1lbnRzID9cclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oaWR4KXtcclxuICAgICAgICAgIHRoaXMudmFsdWUgPSBmdW5jQXJnKHRoaXMsIHZhbHVlLCBpZHgsIHRoaXMudmFsdWUpXHJcbiAgICAgICAgfSkgOlxyXG4gICAgICAgICh0aGlzWzBdICYmICh0aGlzWzBdLm11bHRpcGxlID9cclxuICAgICAgICAgICAkKHRoaXNbMF0pLmZpbmQoJ29wdGlvbicpLmZpbHRlcihmdW5jdGlvbigpeyByZXR1cm4gdGhpcy5zZWxlY3RlZCB9KS5wbHVjaygndmFsdWUnKSA6XHJcbiAgICAgICAgICAgdGhpc1swXS52YWx1ZSlcclxuICAgICAgICApXHJcbiAgICB9LFxyXG4gICAgb2Zmc2V0OiBmdW5jdGlvbihjb29yZGluYXRlcyl7XHJcbiAgICAgIGlmIChjb29yZGluYXRlcykgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpbmRleCl7XHJcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgY29vcmRzID0gZnVuY0FyZyh0aGlzLCBjb29yZGluYXRlcywgaW5kZXgsICR0aGlzLm9mZnNldCgpKSxcclxuICAgICAgICAgICAgcGFyZW50T2Zmc2V0ID0gJHRoaXMub2Zmc2V0UGFyZW50KCkub2Zmc2V0KCksXHJcbiAgICAgICAgICAgIHByb3BzID0ge1xyXG4gICAgICAgICAgICAgIHRvcDogIGNvb3Jkcy50b3AgIC0gcGFyZW50T2Zmc2V0LnRvcCxcclxuICAgICAgICAgICAgICBsZWZ0OiBjb29yZHMubGVmdCAtIHBhcmVudE9mZnNldC5sZWZ0XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCR0aGlzLmNzcygncG9zaXRpb24nKSA9PSAnc3RhdGljJykgcHJvcHNbJ3Bvc2l0aW9uJ10gPSAncmVsYXRpdmUnXHJcbiAgICAgICAgJHRoaXMuY3NzKHByb3BzKVxyXG4gICAgICB9KVxyXG4gICAgICBpZiAoIXRoaXMubGVuZ3RoKSByZXR1cm4gbnVsbFxyXG4gICAgICBpZiAoISQuY29udGFpbnMoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCB0aGlzWzBdKSlcclxuICAgICAgICByZXR1cm4ge3RvcDogMCwgbGVmdDogMH1cclxuICAgICAgdmFyIG9iaiA9IHRoaXNbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBsZWZ0OiBvYmoubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCxcclxuICAgICAgICB0b3A6IG9iai50b3AgKyB3aW5kb3cucGFnZVlPZmZzZXQsXHJcbiAgICAgICAgd2lkdGg6IE1hdGgucm91bmQob2JqLndpZHRoKSxcclxuICAgICAgICBoZWlnaHQ6IE1hdGgucm91bmQob2JqLmhlaWdodClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNzczogZnVuY3Rpb24ocHJvcGVydHksIHZhbHVlKXtcclxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgdmFyIGNvbXB1dGVkU3R5bGUsIGVsZW1lbnQgPSB0aGlzWzBdXHJcbiAgICAgICAgaWYoIWVsZW1lbnQpIHJldHVyblxyXG4gICAgICAgIGNvbXB1dGVkU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsICcnKVxyXG4gICAgICAgIGlmICh0eXBlb2YgcHJvcGVydHkgPT0gJ3N0cmluZycpXHJcbiAgICAgICAgICByZXR1cm4gZWxlbWVudC5zdHlsZVtjYW1lbGl6ZShwcm9wZXJ0eSldIHx8IGNvbXB1dGVkU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eSlcclxuICAgICAgICBlbHNlIGlmIChpc0FycmF5KHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgdmFyIHByb3BzID0ge31cclxuICAgICAgICAgICQuZWFjaChwcm9wZXJ0eSwgZnVuY3Rpb24oXywgcHJvcCl7XHJcbiAgICAgICAgICAgIHByb3BzW3Byb3BdID0gKGVsZW1lbnQuc3R5bGVbY2FtZWxpemUocHJvcCldIHx8IGNvbXB1dGVkU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShwcm9wKSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICByZXR1cm4gcHJvcHNcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBjc3MgPSAnJ1xyXG4gICAgICBpZiAodHlwZShwcm9wZXJ0eSkgPT0gJ3N0cmluZycpIHtcclxuICAgICAgICBpZiAoIXZhbHVlICYmIHZhbHVlICE9PSAwKVxyXG4gICAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKCl7IHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkoZGFzaGVyaXplKHByb3BlcnR5KSkgfSlcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBjc3MgPSBkYXNoZXJpemUocHJvcGVydHkpICsgXCI6XCIgKyBtYXliZUFkZFB4KHByb3BlcnR5LCB2YWx1ZSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmb3IgKGtleSBpbiBwcm9wZXJ0eSlcclxuICAgICAgICAgIGlmICghcHJvcGVydHlba2V5XSAmJiBwcm9wZXJ0eVtrZXldICE9PSAwKVxyXG4gICAgICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oKXsgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShkYXNoZXJpemUoa2V5KSkgfSlcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgY3NzICs9IGRhc2hlcml6ZShrZXkpICsgJzonICsgbWF5YmVBZGRQeChrZXksIHByb3BlcnR5W2tleV0pICsgJzsnXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXsgdGhpcy5zdHlsZS5jc3NUZXh0ICs9ICc7JyArIGNzcyB9KVxyXG4gICAgfSxcclxuICAgIGluZGV4OiBmdW5jdGlvbihlbGVtZW50KXtcclxuICAgICAgcmV0dXJuIGVsZW1lbnQgPyB0aGlzLmluZGV4T2YoJChlbGVtZW50KVswXSkgOiB0aGlzLnBhcmVudCgpLmNoaWxkcmVuKCkuaW5kZXhPZih0aGlzWzBdKVxyXG4gICAgfSxcclxuICAgIGhhc0NsYXNzOiBmdW5jdGlvbihuYW1lKXtcclxuICAgICAgaWYgKCFuYW1lKSByZXR1cm4gZmFsc2VcclxuICAgICAgcmV0dXJuIGVtcHR5QXJyYXkuc29tZS5jYWxsKHRoaXMsIGZ1bmN0aW9uKGVsKXtcclxuICAgICAgICByZXR1cm4gdGhpcy50ZXN0KGNsYXNzTmFtZShlbCkpXHJcbiAgICAgIH0sIGNsYXNzUkUobmFtZSkpXHJcbiAgICB9LFxyXG4gICAgYWRkQ2xhc3M6IGZ1bmN0aW9uKG5hbWUpe1xyXG4gICAgICBpZiAoIW5hbWUpIHJldHVybiB0aGlzXHJcbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaWR4KXtcclxuICAgICAgICBpZiAoISgnY2xhc3NOYW1lJyBpbiB0aGlzKSkgcmV0dXJuXHJcbiAgICAgICAgY2xhc3NMaXN0ID0gW11cclxuICAgICAgICB2YXIgY2xzID0gY2xhc3NOYW1lKHRoaXMpLCBuZXdOYW1lID0gZnVuY0FyZyh0aGlzLCBuYW1lLCBpZHgsIGNscylcclxuICAgICAgICBuZXdOYW1lLnNwbGl0KC9cXHMrL2cpLmZvckVhY2goZnVuY3Rpb24oa2xhc3Mpe1xyXG4gICAgICAgICAgaWYgKCEkKHRoaXMpLmhhc0NsYXNzKGtsYXNzKSkgY2xhc3NMaXN0LnB1c2goa2xhc3MpXHJcbiAgICAgICAgfSwgdGhpcylcclxuICAgICAgICBjbGFzc0xpc3QubGVuZ3RoICYmIGNsYXNzTmFtZSh0aGlzLCBjbHMgKyAoY2xzID8gXCIgXCIgOiBcIlwiKSArIGNsYXNzTGlzdC5qb2luKFwiIFwiKSlcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICByZW1vdmVDbGFzczogZnVuY3Rpb24obmFtZSl7XHJcbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaWR4KXtcclxuICAgICAgICBpZiAoISgnY2xhc3NOYW1lJyBpbiB0aGlzKSkgcmV0dXJuXHJcbiAgICAgICAgaWYgKG5hbWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGNsYXNzTmFtZSh0aGlzLCAnJylcclxuICAgICAgICBjbGFzc0xpc3QgPSBjbGFzc05hbWUodGhpcylcclxuICAgICAgICBmdW5jQXJnKHRoaXMsIG5hbWUsIGlkeCwgY2xhc3NMaXN0KS5zcGxpdCgvXFxzKy9nKS5mb3JFYWNoKGZ1bmN0aW9uKGtsYXNzKXtcclxuICAgICAgICAgIGNsYXNzTGlzdCA9IGNsYXNzTGlzdC5yZXBsYWNlKGNsYXNzUkUoa2xhc3MpLCBcIiBcIilcclxuICAgICAgICB9KVxyXG4gICAgICAgIGNsYXNzTmFtZSh0aGlzLCBjbGFzc0xpc3QudHJpbSgpKVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIHRvZ2dsZUNsYXNzOiBmdW5jdGlvbihuYW1lLCB3aGVuKXtcclxuICAgICAgaWYgKCFuYW1lKSByZXR1cm4gdGhpc1xyXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGlkeCl7XHJcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSwgbmFtZXMgPSBmdW5jQXJnKHRoaXMsIG5hbWUsIGlkeCwgY2xhc3NOYW1lKHRoaXMpKVxyXG4gICAgICAgIG5hbWVzLnNwbGl0KC9cXHMrL2cpLmZvckVhY2goZnVuY3Rpb24oa2xhc3Mpe1xyXG4gICAgICAgICAgKHdoZW4gPT09IHVuZGVmaW5lZCA/ICEkdGhpcy5oYXNDbGFzcyhrbGFzcykgOiB3aGVuKSA/XHJcbiAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKGtsYXNzKSA6ICR0aGlzLnJlbW92ZUNsYXNzKGtsYXNzKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgc2Nyb2xsVG9wOiBmdW5jdGlvbih2YWx1ZSl7XHJcbiAgICAgIGlmICghdGhpcy5sZW5ndGgpIHJldHVyblxyXG4gICAgICB2YXIgaGFzU2Nyb2xsVG9wID0gJ3Njcm9sbFRvcCcgaW4gdGhpc1swXVxyXG4gICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGhhc1Njcm9sbFRvcCA/IHRoaXNbMF0uc2Nyb2xsVG9wIDogdGhpc1swXS5wYWdlWU9mZnNldFxyXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGhhc1Njcm9sbFRvcCA/XHJcbiAgICAgICAgZnVuY3Rpb24oKXsgdGhpcy5zY3JvbGxUb3AgPSB2YWx1ZSB9IDpcclxuICAgICAgICBmdW5jdGlvbigpeyB0aGlzLnNjcm9sbFRvKHRoaXMuc2Nyb2xsWCwgdmFsdWUpIH0pXHJcbiAgICB9LFxyXG4gICAgc2Nyb2xsTGVmdDogZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgICBpZiAoIXRoaXMubGVuZ3RoKSByZXR1cm5cclxuICAgICAgdmFyIGhhc1Njcm9sbExlZnQgPSAnc2Nyb2xsTGVmdCcgaW4gdGhpc1swXVxyXG4gICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGhhc1Njcm9sbExlZnQgPyB0aGlzWzBdLnNjcm9sbExlZnQgOiB0aGlzWzBdLnBhZ2VYT2Zmc2V0XHJcbiAgICAgIHJldHVybiB0aGlzLmVhY2goaGFzU2Nyb2xsTGVmdCA/XHJcbiAgICAgICAgZnVuY3Rpb24oKXsgdGhpcy5zY3JvbGxMZWZ0ID0gdmFsdWUgfSA6XHJcbiAgICAgICAgZnVuY3Rpb24oKXsgdGhpcy5zY3JvbGxUbyh2YWx1ZSwgdGhpcy5zY3JvbGxZKSB9KVxyXG4gICAgfSxcclxuICAgIHBvc2l0aW9uOiBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKCF0aGlzLmxlbmd0aCkgcmV0dXJuXHJcblxyXG4gICAgICB2YXIgZWxlbSA9IHRoaXNbMF0sXHJcbiAgICAgICAgLy8gR2V0ICpyZWFsKiBvZmZzZXRQYXJlbnRcclxuICAgICAgICBvZmZzZXRQYXJlbnQgPSB0aGlzLm9mZnNldFBhcmVudCgpLFxyXG4gICAgICAgIC8vIEdldCBjb3JyZWN0IG9mZnNldHNcclxuICAgICAgICBvZmZzZXQgICAgICAgPSB0aGlzLm9mZnNldCgpLFxyXG4gICAgICAgIHBhcmVudE9mZnNldCA9IHJvb3ROb2RlUkUudGVzdChvZmZzZXRQYXJlbnRbMF0ubm9kZU5hbWUpID8geyB0b3A6IDAsIGxlZnQ6IDAgfSA6IG9mZnNldFBhcmVudC5vZmZzZXQoKVxyXG5cclxuICAgICAgLy8gU3VidHJhY3QgZWxlbWVudCBtYXJnaW5zXHJcbiAgICAgIC8vIG5vdGU6IHdoZW4gYW4gZWxlbWVudCBoYXMgbWFyZ2luOiBhdXRvIHRoZSBvZmZzZXRMZWZ0IGFuZCBtYXJnaW5MZWZ0XHJcbiAgICAgIC8vIGFyZSB0aGUgc2FtZSBpbiBTYWZhcmkgY2F1c2luZyBvZmZzZXQubGVmdCB0byBpbmNvcnJlY3RseSBiZSAwXHJcbiAgICAgIG9mZnNldC50b3AgIC09IHBhcnNlRmxvYXQoICQoZWxlbSkuY3NzKCdtYXJnaW4tdG9wJykgKSB8fCAwXHJcbiAgICAgIG9mZnNldC5sZWZ0IC09IHBhcnNlRmxvYXQoICQoZWxlbSkuY3NzKCdtYXJnaW4tbGVmdCcpICkgfHwgMFxyXG5cclxuICAgICAgLy8gQWRkIG9mZnNldFBhcmVudCBib3JkZXJzXHJcbiAgICAgIHBhcmVudE9mZnNldC50b3AgICs9IHBhcnNlRmxvYXQoICQob2Zmc2V0UGFyZW50WzBdKS5jc3MoJ2JvcmRlci10b3Atd2lkdGgnKSApIHx8IDBcclxuICAgICAgcGFyZW50T2Zmc2V0LmxlZnQgKz0gcGFyc2VGbG9hdCggJChvZmZzZXRQYXJlbnRbMF0pLmNzcygnYm9yZGVyLWxlZnQtd2lkdGgnKSApIHx8IDBcclxuXHJcbiAgICAgIC8vIFN1YnRyYWN0IHRoZSB0d28gb2Zmc2V0c1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHRvcDogIG9mZnNldC50b3AgIC0gcGFyZW50T2Zmc2V0LnRvcCxcclxuICAgICAgICBsZWZ0OiBvZmZzZXQubGVmdCAtIHBhcmVudE9mZnNldC5sZWZ0XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvZmZzZXRQYXJlbnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5vZmZzZXRQYXJlbnQgfHwgZG9jdW1lbnQuYm9keVxyXG4gICAgICAgIHdoaWxlIChwYXJlbnQgJiYgIXJvb3ROb2RlUkUudGVzdChwYXJlbnQubm9kZU5hbWUpICYmICQocGFyZW50KS5jc3MoXCJwb3NpdGlvblwiKSA9PSBcInN0YXRpY1wiKVxyXG4gICAgICAgICAgcGFyZW50ID0gcGFyZW50Lm9mZnNldFBhcmVudFxyXG4gICAgICAgIHJldHVybiBwYXJlbnRcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGZvciBub3dcclxuICAkLmZuLmRldGFjaCA9ICQuZm4ucmVtb3ZlXHJcblxyXG4gIC8vIEdlbmVyYXRlIHRoZSBgd2lkdGhgIGFuZCBgaGVpZ2h0YCBmdW5jdGlvbnNcclxuICA7Wyd3aWR0aCcsICdoZWlnaHQnXS5mb3JFYWNoKGZ1bmN0aW9uKGRpbWVuc2lvbil7XHJcbiAgICB2YXIgZGltZW5zaW9uUHJvcGVydHkgPVxyXG4gICAgICBkaW1lbnNpb24ucmVwbGFjZSgvLi8sIGZ1bmN0aW9uKG0peyByZXR1cm4gbVswXS50b1VwcGVyQ2FzZSgpIH0pXHJcblxyXG4gICAgJC5mbltkaW1lbnNpb25dID0gZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgICB2YXIgb2Zmc2V0LCBlbCA9IHRoaXNbMF1cclxuICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBpc1dpbmRvdyhlbCkgPyBlbFsnaW5uZXInICsgZGltZW5zaW9uUHJvcGVydHldIDpcclxuICAgICAgICBpc0RvY3VtZW50KGVsKSA/IGVsLmRvY3VtZW50RWxlbWVudFsnc2Nyb2xsJyArIGRpbWVuc2lvblByb3BlcnR5XSA6XHJcbiAgICAgICAgKG9mZnNldCA9IHRoaXMub2Zmc2V0KCkpICYmIG9mZnNldFtkaW1lbnNpb25dXHJcbiAgICAgIGVsc2UgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpZHgpe1xyXG4gICAgICAgIGVsID0gJCh0aGlzKVxyXG4gICAgICAgIGVsLmNzcyhkaW1lbnNpb24sIGZ1bmNBcmcodGhpcywgdmFsdWUsIGlkeCwgZWxbZGltZW5zaW9uXSgpKSlcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9KVxyXG5cclxuICBmdW5jdGlvbiB0cmF2ZXJzZU5vZGUobm9kZSwgZnVuKSB7XHJcbiAgICBmdW4obm9kZSlcclxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBub2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspXHJcbiAgICAgIHRyYXZlcnNlTm9kZShub2RlLmNoaWxkTm9kZXNbaV0sIGZ1bilcclxuICB9XHJcblxyXG4gIC8vIEdlbmVyYXRlIHRoZSBgYWZ0ZXJgLCBgcHJlcGVuZGAsIGBiZWZvcmVgLCBgYXBwZW5kYCxcclxuICAvLyBgaW5zZXJ0QWZ0ZXJgLCBgaW5zZXJ0QmVmb3JlYCwgYGFwcGVuZFRvYCwgYW5kIGBwcmVwZW5kVG9gIG1ldGhvZHMuXHJcbiAgYWRqYWNlbmN5T3BlcmF0b3JzLmZvckVhY2goZnVuY3Rpb24ob3BlcmF0b3IsIG9wZXJhdG9ySW5kZXgpIHtcclxuICAgIHZhciBpbnNpZGUgPSBvcGVyYXRvckluZGV4ICUgMiAvLz0+IHByZXBlbmQsIGFwcGVuZFxyXG5cclxuICAgICQuZm5bb3BlcmF0b3JdID0gZnVuY3Rpb24oKXtcclxuICAgICAgLy8gYXJndW1lbnRzIGNhbiBiZSBub2RlcywgYXJyYXlzIG9mIG5vZGVzLCBaZXB0byBvYmplY3RzIGFuZCBIVE1MIHN0cmluZ3NcclxuICAgICAgdmFyIGFyZ1R5cGUsIG5vZGVzID0gJC5tYXAoYXJndW1lbnRzLCBmdW5jdGlvbihhcmcpIHtcclxuICAgICAgICAgICAgYXJnVHlwZSA9IHR5cGUoYXJnKVxyXG4gICAgICAgICAgICByZXR1cm4gYXJnVHlwZSA9PSBcIm9iamVjdFwiIHx8IGFyZ1R5cGUgPT0gXCJhcnJheVwiIHx8IGFyZyA9PSBudWxsID9cclxuICAgICAgICAgICAgICBhcmcgOiB6ZXB0by5mcmFnbWVudChhcmcpXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIHBhcmVudCwgY29weUJ5Q2xvbmUgPSB0aGlzLmxlbmd0aCA+IDFcclxuICAgICAgaWYgKG5vZGVzLmxlbmd0aCA8IDEpIHJldHVybiB0aGlzXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKF8sIHRhcmdldCl7XHJcbiAgICAgICAgcGFyZW50ID0gaW5zaWRlID8gdGFyZ2V0IDogdGFyZ2V0LnBhcmVudE5vZGVcclxuXHJcbiAgICAgICAgLy8gY29udmVydCBhbGwgbWV0aG9kcyB0byBhIFwiYmVmb3JlXCIgb3BlcmF0aW9uXHJcbiAgICAgICAgdGFyZ2V0ID0gb3BlcmF0b3JJbmRleCA9PSAwID8gdGFyZ2V0Lm5leHRTaWJsaW5nIDpcclxuICAgICAgICAgICAgICAgICBvcGVyYXRvckluZGV4ID09IDEgPyB0YXJnZXQuZmlyc3RDaGlsZCA6XHJcbiAgICAgICAgICAgICAgICAgb3BlcmF0b3JJbmRleCA9PSAyID8gdGFyZ2V0IDpcclxuICAgICAgICAgICAgICAgICBudWxsXHJcblxyXG4gICAgICAgIHZhciBwYXJlbnRJbkRvY3VtZW50ID0gJC5jb250YWlucyhkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHBhcmVudClcclxuXHJcbiAgICAgICAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcclxuICAgICAgICAgIGlmIChjb3B5QnlDbG9uZSkgbm9kZSA9IG5vZGUuY2xvbmVOb2RlKHRydWUpXHJcbiAgICAgICAgICBlbHNlIGlmICghcGFyZW50KSByZXR1cm4gJChub2RlKS5yZW1vdmUoKVxyXG5cclxuICAgICAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUobm9kZSwgdGFyZ2V0KVxyXG4gICAgICAgICAgaWYgKHBhcmVudEluRG9jdW1lbnQpIHRyYXZlcnNlTm9kZShub2RlLCBmdW5jdGlvbihlbCl7XHJcbiAgICAgICAgICAgIGlmIChlbC5ub2RlTmFtZSAhPSBudWxsICYmIGVsLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCkgPT09ICdTQ1JJUFQnICYmXHJcbiAgICAgICAgICAgICAgICghZWwudHlwZSB8fCBlbC50eXBlID09PSAndGV4dC9qYXZhc2NyaXB0JykgJiYgIWVsLnNyYylcclxuICAgICAgICAgICAgICB3aW5kb3dbJ2V2YWwnXS5jYWxsKHdpbmRvdywgZWwuaW5uZXJIVE1MKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGFmdGVyICAgID0+IGluc2VydEFmdGVyXHJcbiAgICAvLyBwcmVwZW5kICA9PiBwcmVwZW5kVG9cclxuICAgIC8vIGJlZm9yZSAgID0+IGluc2VydEJlZm9yZVxyXG4gICAgLy8gYXBwZW5kICAgPT4gYXBwZW5kVG9cclxuICAgICQuZm5baW5zaWRlID8gb3BlcmF0b3IrJ1RvJyA6ICdpbnNlcnQnKyhvcGVyYXRvckluZGV4ID8gJ0JlZm9yZScgOiAnQWZ0ZXInKV0gPSBmdW5jdGlvbihodG1sKXtcclxuICAgICAgJChodG1sKVtvcGVyYXRvcl0odGhpcylcclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuICB9KVxyXG5cclxuICB6ZXB0by5aLnByb3RvdHlwZSA9IFoucHJvdG90eXBlID0gJC5mblxyXG5cclxuICAvLyBFeHBvcnQgaW50ZXJuYWwgQVBJIGZ1bmN0aW9ucyBpbiB0aGUgYCQuemVwdG9gIG5hbWVzcGFjZVxyXG4gIHplcHRvLnVuaXEgPSB1bmlxXHJcbiAgemVwdG8uZGVzZXJpYWxpemVWYWx1ZSA9IGRlc2VyaWFsaXplVmFsdWVcclxuICAkLnplcHRvID0gemVwdG9cclxuXHJcbiAgcmV0dXJuICRcclxufSkoKVxyXG5cclxuXHJcbndpbmRvdy5aZXB0byA9IFplcHRvXHJcbndpbmRvdy4kID09PSB1bmRlZmluZWQgJiYgKHdpbmRvdy4kID0gWmVwdG8pXHJcblxyXG5cclxuXHJcblxyXG5cclxuOyhmdW5jdGlvbigkKXtcclxuICB2YXIgX3ppZCA9IDEsIHVuZGVmaW5lZCxcclxuICAgICAgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UsXHJcbiAgICAgIGlzRnVuY3Rpb24gPSAkLmlzRnVuY3Rpb24sXHJcbiAgICAgIGlzU3RyaW5nID0gZnVuY3Rpb24ob2JqKXsgcmV0dXJuIHR5cGVvZiBvYmogPT0gJ3N0cmluZycgfSxcclxuICAgICAgaGFuZGxlcnMgPSB7fSxcclxuICAgICAgc3BlY2lhbEV2ZW50cz17fSxcclxuICAgICAgZm9jdXNpblN1cHBvcnRlZCA9ICdvbmZvY3VzaW4nIGluIHdpbmRvdyxcclxuICAgICAgZm9jdXMgPSB7IGZvY3VzOiAnZm9jdXNpbicsIGJsdXI6ICdmb2N1c291dCcgfSxcclxuICAgICAgaG92ZXIgPSB7IG1vdXNlZW50ZXI6ICdtb3VzZW92ZXInLCBtb3VzZWxlYXZlOiAnbW91c2VvdXQnIH1cclxuXHJcbiAgc3BlY2lhbEV2ZW50cy5jbGljayA9IHNwZWNpYWxFdmVudHMubW91c2Vkb3duID0gc3BlY2lhbEV2ZW50cy5tb3VzZXVwID0gc3BlY2lhbEV2ZW50cy5tb3VzZW1vdmUgPSAnTW91c2VFdmVudHMnXHJcblxyXG4gIGZ1bmN0aW9uIHppZChlbGVtZW50KSB7XHJcbiAgICByZXR1cm4gZWxlbWVudC5femlkIHx8IChlbGVtZW50Ll96aWQgPSBfemlkKyspXHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGZpbmRIYW5kbGVycyhlbGVtZW50LCBldmVudCwgZm4sIHNlbGVjdG9yKSB7XHJcbiAgICBldmVudCA9IHBhcnNlKGV2ZW50KVxyXG4gICAgaWYgKGV2ZW50Lm5zKSB2YXIgbWF0Y2hlciA9IG1hdGNoZXJGb3IoZXZlbnQubnMpXHJcbiAgICByZXR1cm4gKGhhbmRsZXJzW3ppZChlbGVtZW50KV0gfHwgW10pLmZpbHRlcihmdW5jdGlvbihoYW5kbGVyKSB7XHJcbiAgICAgIHJldHVybiBoYW5kbGVyXHJcbiAgICAgICAgJiYgKCFldmVudC5lICB8fCBoYW5kbGVyLmUgPT0gZXZlbnQuZSlcclxuICAgICAgICAmJiAoIWV2ZW50Lm5zIHx8IG1hdGNoZXIudGVzdChoYW5kbGVyLm5zKSlcclxuICAgICAgICAmJiAoIWZuICAgICAgIHx8IHppZChoYW5kbGVyLmZuKSA9PT0gemlkKGZuKSlcclxuICAgICAgICAmJiAoIXNlbGVjdG9yIHx8IGhhbmRsZXIuc2VsID09IHNlbGVjdG9yKVxyXG4gICAgfSlcclxuICB9XHJcbiAgZnVuY3Rpb24gcGFyc2UoZXZlbnQpIHtcclxuICAgIHZhciBwYXJ0cyA9ICgnJyArIGV2ZW50KS5zcGxpdCgnLicpXHJcbiAgICByZXR1cm4ge2U6IHBhcnRzWzBdLCBuczogcGFydHMuc2xpY2UoMSkuc29ydCgpLmpvaW4oJyAnKX1cclxuICB9XHJcbiAgZnVuY3Rpb24gbWF0Y2hlckZvcihucykge1xyXG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoJyg/Ol58ICknICsgbnMucmVwbGFjZSgnICcsICcgLiogPycpICsgJyg/OiB8JCknKVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZXZlbnRDYXB0dXJlKGhhbmRsZXIsIGNhcHR1cmVTZXR0aW5nKSB7XHJcbiAgICByZXR1cm4gaGFuZGxlci5kZWwgJiZcclxuICAgICAgKCFmb2N1c2luU3VwcG9ydGVkICYmIChoYW5kbGVyLmUgaW4gZm9jdXMpKSB8fFxyXG4gICAgICAhIWNhcHR1cmVTZXR0aW5nXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZWFsRXZlbnQodHlwZSkge1xyXG4gICAgcmV0dXJuIGhvdmVyW3R5cGVdIHx8IChmb2N1c2luU3VwcG9ydGVkICYmIGZvY3VzW3R5cGVdKSB8fCB0eXBlXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGQoZWxlbWVudCwgZXZlbnRzLCBmbiwgZGF0YSwgc2VsZWN0b3IsIGRlbGVnYXRvciwgY2FwdHVyZSl7XHJcbiAgICB2YXIgaWQgPSB6aWQoZWxlbWVudCksIHNldCA9IChoYW5kbGVyc1tpZF0gfHwgKGhhbmRsZXJzW2lkXSA9IFtdKSlcclxuICAgIGV2ZW50cy5zcGxpdCgvXFxzLykuZm9yRWFjaChmdW5jdGlvbihldmVudCl7XHJcbiAgICAgIGlmIChldmVudCA9PSAncmVhZHknKSByZXR1cm4gJChkb2N1bWVudCkucmVhZHkoZm4pXHJcbiAgICAgIHZhciBoYW5kbGVyICAgPSBwYXJzZShldmVudClcclxuICAgICAgaGFuZGxlci5mbiAgICA9IGZuXHJcbiAgICAgIGhhbmRsZXIuc2VsICAgPSBzZWxlY3RvclxyXG4gICAgICAvLyBlbXVsYXRlIG1vdXNlZW50ZXIsIG1vdXNlbGVhdmVcclxuICAgICAgaWYgKGhhbmRsZXIuZSBpbiBob3ZlcikgZm4gPSBmdW5jdGlvbihlKXtcclxuICAgICAgICB2YXIgcmVsYXRlZCA9IGUucmVsYXRlZFRhcmdldFxyXG4gICAgICAgIGlmICghcmVsYXRlZCB8fCAocmVsYXRlZCAhPT0gdGhpcyAmJiAhJC5jb250YWlucyh0aGlzLCByZWxhdGVkKSkpXHJcbiAgICAgICAgICByZXR1cm4gaGFuZGxlci5mbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXHJcbiAgICAgIH1cclxuICAgICAgaGFuZGxlci5kZWwgICA9IGRlbGVnYXRvclxyXG4gICAgICB2YXIgY2FsbGJhY2sgID0gZGVsZWdhdG9yIHx8IGZuXHJcbiAgICAgIGhhbmRsZXIucHJveHkgPSBmdW5jdGlvbihlKXtcclxuICAgICAgICBlID0gY29tcGF0aWJsZShlKVxyXG4gICAgICAgIGlmIChlLmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkKCkpIHJldHVyblxyXG4gICAgICAgIGUuZGF0YSA9IGRhdGFcclxuICAgICAgICB2YXIgcmVzdWx0ID0gY2FsbGJhY2suYXBwbHkoZWxlbWVudCwgZS5fYXJncyA9PSB1bmRlZmluZWQgPyBbZV0gOiBbZV0uY29uY2F0KGUuX2FyZ3MpKVxyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSBlLnByZXZlbnREZWZhdWx0KCksIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICByZXR1cm4gcmVzdWx0XHJcbiAgICAgIH1cclxuICAgICAgaGFuZGxlci5pID0gc2V0Lmxlbmd0aFxyXG4gICAgICBzZXQucHVzaChoYW5kbGVyKVxyXG4gICAgICBpZiAoJ2FkZEV2ZW50TGlzdGVuZXInIGluIGVsZW1lbnQpXHJcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHJlYWxFdmVudChoYW5kbGVyLmUpLCBoYW5kbGVyLnByb3h5LCBldmVudENhcHR1cmUoaGFuZGxlciwgY2FwdHVyZSkpXHJcbiAgICB9KVxyXG4gIH1cclxuICBmdW5jdGlvbiByZW1vdmUoZWxlbWVudCwgZXZlbnRzLCBmbiwgc2VsZWN0b3IsIGNhcHR1cmUpe1xyXG4gICAgdmFyIGlkID0gemlkKGVsZW1lbnQpXHJcbiAgICA7KGV2ZW50cyB8fCAnJykuc3BsaXQoL1xccy8pLmZvckVhY2goZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICBmaW5kSGFuZGxlcnMoZWxlbWVudCwgZXZlbnQsIGZuLCBzZWxlY3RvcikuZm9yRWFjaChmdW5jdGlvbihoYW5kbGVyKXtcclxuICAgICAgICBkZWxldGUgaGFuZGxlcnNbaWRdW2hhbmRsZXIuaV1cclxuICAgICAgaWYgKCdyZW1vdmVFdmVudExpc3RlbmVyJyBpbiBlbGVtZW50KVxyXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihyZWFsRXZlbnQoaGFuZGxlci5lKSwgaGFuZGxlci5wcm94eSwgZXZlbnRDYXB0dXJlKGhhbmRsZXIsIGNhcHR1cmUpKVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gICQuZXZlbnQgPSB7IGFkZDogYWRkLCByZW1vdmU6IHJlbW92ZSB9XHJcblxyXG4gICQucHJveHkgPSBmdW5jdGlvbihmbiwgY29udGV4dCkge1xyXG4gICAgdmFyIGFyZ3MgPSAoMiBpbiBhcmd1bWVudHMpICYmIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKVxyXG4gICAgaWYgKGlzRnVuY3Rpb24oZm4pKSB7XHJcbiAgICAgIHZhciBwcm94eUZuID0gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MgPyBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpIDogYXJndW1lbnRzKSB9XHJcbiAgICAgIHByb3h5Rm4uX3ppZCA9IHppZChmbilcclxuICAgICAgcmV0dXJuIHByb3h5Rm5cclxuICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcoY29udGV4dCkpIHtcclxuICAgICAgaWYgKGFyZ3MpIHtcclxuICAgICAgICBhcmdzLnVuc2hpZnQoZm5bY29udGV4dF0sIGZuKVxyXG4gICAgICAgIHJldHVybiAkLnByb3h5LmFwcGx5KG51bGwsIGFyZ3MpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICQucHJveHkoZm5bY29udGV4dF0sIGZuKVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiZXhwZWN0ZWQgZnVuY3Rpb25cIilcclxuICAgIH1cclxuICB9XHJcblxyXG4gICQuZm4uYmluZCA9IGZ1bmN0aW9uKGV2ZW50LCBkYXRhLCBjYWxsYmFjayl7XHJcbiAgICByZXR1cm4gdGhpcy5vbihldmVudCwgZGF0YSwgY2FsbGJhY2spXHJcbiAgfVxyXG4gICQuZm4udW5iaW5kID0gZnVuY3Rpb24oZXZlbnQsIGNhbGxiYWNrKXtcclxuICAgIHJldHVybiB0aGlzLm9mZihldmVudCwgY2FsbGJhY2spXHJcbiAgfVxyXG4gICQuZm4ub25lID0gZnVuY3Rpb24oZXZlbnQsIHNlbGVjdG9yLCBkYXRhLCBjYWxsYmFjayl7XHJcbiAgICByZXR1cm4gdGhpcy5vbihldmVudCwgc2VsZWN0b3IsIGRhdGEsIGNhbGxiYWNrLCAxKVxyXG4gIH1cclxuXHJcbiAgdmFyIHJldHVyblRydWUgPSBmdW5jdGlvbigpe3JldHVybiB0cnVlfSxcclxuICAgICAgcmV0dXJuRmFsc2UgPSBmdW5jdGlvbigpe3JldHVybiBmYWxzZX0sXHJcbiAgICAgIGlnbm9yZVByb3BlcnRpZXMgPSAvXihbQS1aXXxyZXR1cm5WYWx1ZSR8bGF5ZXJbWFldJCkvLFxyXG4gICAgICBldmVudE1ldGhvZHMgPSB7XHJcbiAgICAgICAgcHJldmVudERlZmF1bHQ6ICdpc0RlZmF1bHRQcmV2ZW50ZWQnLFxyXG4gICAgICAgIHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbjogJ2lzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkJyxcclxuICAgICAgICBzdG9wUHJvcGFnYXRpb246ICdpc1Byb3BhZ2F0aW9uU3RvcHBlZCdcclxuICAgICAgfVxyXG5cclxuICBmdW5jdGlvbiBjb21wYXRpYmxlKGV2ZW50LCBzb3VyY2UpIHtcclxuICAgIGlmIChzb3VyY2UgfHwgIWV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCkge1xyXG4gICAgICBzb3VyY2UgfHwgKHNvdXJjZSA9IGV2ZW50KVxyXG5cclxuICAgICAgJC5lYWNoKGV2ZW50TWV0aG9kcywgZnVuY3Rpb24obmFtZSwgcHJlZGljYXRlKSB7XHJcbiAgICAgICAgdmFyIHNvdXJjZU1ldGhvZCA9IHNvdXJjZVtuYW1lXVxyXG4gICAgICAgIGV2ZW50W25hbWVdID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgIHRoaXNbcHJlZGljYXRlXSA9IHJldHVyblRydWVcclxuICAgICAgICAgIHJldHVybiBzb3VyY2VNZXRob2QgJiYgc291cmNlTWV0aG9kLmFwcGx5KHNvdXJjZSwgYXJndW1lbnRzKVxyXG4gICAgICAgIH1cclxuICAgICAgICBldmVudFtwcmVkaWNhdGVdID0gcmV0dXJuRmFsc2VcclxuICAgICAgfSlcclxuXHJcbiAgICAgIGlmIChzb3VyY2UuZGVmYXVsdFByZXZlbnRlZCAhPT0gdW5kZWZpbmVkID8gc291cmNlLmRlZmF1bHRQcmV2ZW50ZWQgOlxyXG4gICAgICAgICAgJ3JldHVyblZhbHVlJyBpbiBzb3VyY2UgPyBzb3VyY2UucmV0dXJuVmFsdWUgPT09IGZhbHNlIDpcclxuICAgICAgICAgIHNvdXJjZS5nZXRQcmV2ZW50RGVmYXVsdCAmJiBzb3VyY2UuZ2V0UHJldmVudERlZmF1bHQoKSlcclxuICAgICAgICBldmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQgPSByZXR1cm5UcnVlXHJcbiAgICB9XHJcbiAgICByZXR1cm4gZXZlbnRcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZVByb3h5KGV2ZW50KSB7XHJcbiAgICB2YXIga2V5LCBwcm94eSA9IHsgb3JpZ2luYWxFdmVudDogZXZlbnQgfVxyXG4gICAgZm9yIChrZXkgaW4gZXZlbnQpXHJcbiAgICAgIGlmICghaWdub3JlUHJvcGVydGllcy50ZXN0KGtleSkgJiYgZXZlbnRba2V5XSAhPT0gdW5kZWZpbmVkKSBwcm94eVtrZXldID0gZXZlbnRba2V5XVxyXG5cclxuICAgIHJldHVybiBjb21wYXRpYmxlKHByb3h5LCBldmVudClcclxuICB9XHJcblxyXG4gICQuZm4uZGVsZWdhdGUgPSBmdW5jdGlvbihzZWxlY3RvciwgZXZlbnQsIGNhbGxiYWNrKXtcclxuICAgIHJldHVybiB0aGlzLm9uKGV2ZW50LCBzZWxlY3RvciwgY2FsbGJhY2spXHJcbiAgfVxyXG4gICQuZm4udW5kZWxlZ2F0ZSA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBldmVudCwgY2FsbGJhY2spe1xyXG4gICAgcmV0dXJuIHRoaXMub2ZmKGV2ZW50LCBzZWxlY3RvciwgY2FsbGJhY2spXHJcbiAgfVxyXG5cclxuICAkLmZuLmxpdmUgPSBmdW5jdGlvbihldmVudCwgY2FsbGJhY2spe1xyXG4gICAgJChkb2N1bWVudC5ib2R5KS5kZWxlZ2F0ZSh0aGlzLnNlbGVjdG9yLCBldmVudCwgY2FsbGJhY2spXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICAkLmZuLmRpZSA9IGZ1bmN0aW9uKGV2ZW50LCBjYWxsYmFjayl7XHJcbiAgICAkKGRvY3VtZW50LmJvZHkpLnVuZGVsZWdhdGUodGhpcy5zZWxlY3RvciwgZXZlbnQsIGNhbGxiYWNrKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG4gICQuZm4ub24gPSBmdW5jdGlvbihldmVudCwgc2VsZWN0b3IsIGRhdGEsIGNhbGxiYWNrLCBvbmUpe1xyXG4gICAgdmFyIGF1dG9SZW1vdmUsIGRlbGVnYXRvciwgJHRoaXMgPSB0aGlzXHJcbiAgICBpZiAoZXZlbnQgJiYgIWlzU3RyaW5nKGV2ZW50KSkge1xyXG4gICAgICAkLmVhY2goZXZlbnQsIGZ1bmN0aW9uKHR5cGUsIGZuKXtcclxuICAgICAgICAkdGhpcy5vbih0eXBlLCBzZWxlY3RvciwgZGF0YSwgZm4sIG9uZSlcclxuICAgICAgfSlcclxuICAgICAgcmV0dXJuICR0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFpc1N0cmluZyhzZWxlY3RvcikgJiYgIWlzRnVuY3Rpb24oY2FsbGJhY2spICYmIGNhbGxiYWNrICE9PSBmYWxzZSlcclxuICAgICAgY2FsbGJhY2sgPSBkYXRhLCBkYXRhID0gc2VsZWN0b3IsIHNlbGVjdG9yID0gdW5kZWZpbmVkXHJcbiAgICBpZiAoY2FsbGJhY2sgPT09IHVuZGVmaW5lZCB8fCBkYXRhID09PSBmYWxzZSlcclxuICAgICAgY2FsbGJhY2sgPSBkYXRhLCBkYXRhID0gdW5kZWZpbmVkXHJcblxyXG4gICAgaWYgKGNhbGxiYWNrID09PSBmYWxzZSkgY2FsbGJhY2sgPSByZXR1cm5GYWxzZVxyXG5cclxuICAgIHJldHVybiAkdGhpcy5lYWNoKGZ1bmN0aW9uKF8sIGVsZW1lbnQpe1xyXG4gICAgICBpZiAob25lKSBhdXRvUmVtb3ZlID0gZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgcmVtb3ZlKGVsZW1lbnQsIGUudHlwZSwgY2FsbGJhY2spXHJcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNlbGVjdG9yKSBkZWxlZ2F0b3IgPSBmdW5jdGlvbihlKXtcclxuICAgICAgICB2YXIgZXZ0LCBtYXRjaCA9ICQoZS50YXJnZXQpLmNsb3Nlc3Qoc2VsZWN0b3IsIGVsZW1lbnQpLmdldCgwKVxyXG4gICAgICAgIGlmIChtYXRjaCAmJiBtYXRjaCAhPT0gZWxlbWVudCkge1xyXG4gICAgICAgICAgZXZ0ID0gJC5leHRlbmQoY3JlYXRlUHJveHkoZSksIHtjdXJyZW50VGFyZ2V0OiBtYXRjaCwgbGl2ZUZpcmVkOiBlbGVtZW50fSlcclxuICAgICAgICAgIHJldHVybiAoYXV0b1JlbW92ZSB8fCBjYWxsYmFjaykuYXBwbHkobWF0Y2gsIFtldnRdLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgYWRkKGVsZW1lbnQsIGV2ZW50LCBjYWxsYmFjaywgZGF0YSwgc2VsZWN0b3IsIGRlbGVnYXRvciB8fCBhdXRvUmVtb3ZlKVxyXG4gICAgfSlcclxuICB9XHJcbiAgJC5mbi5vZmYgPSBmdW5jdGlvbihldmVudCwgc2VsZWN0b3IsIGNhbGxiYWNrKXtcclxuICAgIHZhciAkdGhpcyA9IHRoaXNcclxuICAgIGlmIChldmVudCAmJiAhaXNTdHJpbmcoZXZlbnQpKSB7XHJcbiAgICAgICQuZWFjaChldmVudCwgZnVuY3Rpb24odHlwZSwgZm4pe1xyXG4gICAgICAgICR0aGlzLm9mZih0eXBlLCBzZWxlY3RvciwgZm4pXHJcbiAgICAgIH0pXHJcbiAgICAgIHJldHVybiAkdGhpc1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghaXNTdHJpbmcoc2VsZWN0b3IpICYmICFpc0Z1bmN0aW9uKGNhbGxiYWNrKSAmJiBjYWxsYmFjayAhPT0gZmFsc2UpXHJcbiAgICAgIGNhbGxiYWNrID0gc2VsZWN0b3IsIHNlbGVjdG9yID0gdW5kZWZpbmVkXHJcblxyXG4gICAgaWYgKGNhbGxiYWNrID09PSBmYWxzZSkgY2FsbGJhY2sgPSByZXR1cm5GYWxzZVxyXG5cclxuICAgIHJldHVybiAkdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJlbW92ZSh0aGlzLCBldmVudCwgY2FsbGJhY2ssIHNlbGVjdG9yKVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gICQuZm4udHJpZ2dlciA9IGZ1bmN0aW9uKGV2ZW50LCBhcmdzKXtcclxuICAgIGV2ZW50ID0gKGlzU3RyaW5nKGV2ZW50KSB8fCAkLmlzUGxhaW5PYmplY3QoZXZlbnQpKSA/ICQuRXZlbnQoZXZlbnQpIDogY29tcGF0aWJsZShldmVudClcclxuICAgIGV2ZW50Ll9hcmdzID0gYXJnc1xyXG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAvLyBoYW5kbGUgZm9jdXMoKSwgYmx1cigpIGJ5IGNhbGxpbmcgdGhlbSBkaXJlY3RseVxyXG4gICAgICBpZiAoZXZlbnQudHlwZSBpbiBmb2N1cyAmJiB0eXBlb2YgdGhpc1tldmVudC50eXBlXSA9PSBcImZ1bmN0aW9uXCIpIHRoaXNbZXZlbnQudHlwZV0oKVxyXG4gICAgICAvLyBpdGVtcyBpbiB0aGUgY29sbGVjdGlvbiBtaWdodCBub3QgYmUgRE9NIGVsZW1lbnRzXHJcbiAgICAgIGVsc2UgaWYgKCdkaXNwYXRjaEV2ZW50JyBpbiB0aGlzKSB0aGlzLmRpc3BhdGNoRXZlbnQoZXZlbnQpXHJcbiAgICAgIGVsc2UgJCh0aGlzKS50cmlnZ2VySGFuZGxlcihldmVudCwgYXJncylcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICAvLyB0cmlnZ2VycyBldmVudCBoYW5kbGVycyBvbiBjdXJyZW50IGVsZW1lbnQganVzdCBhcyBpZiBhbiBldmVudCBvY2N1cnJlZCxcclxuICAvLyBkb2Vzbid0IHRyaWdnZXIgYW4gYWN0dWFsIGV2ZW50LCBkb2Vzbid0IGJ1YmJsZVxyXG4gICQuZm4udHJpZ2dlckhhbmRsZXIgPSBmdW5jdGlvbihldmVudCwgYXJncyl7XHJcbiAgICB2YXIgZSwgcmVzdWx0XHJcbiAgICB0aGlzLmVhY2goZnVuY3Rpb24oaSwgZWxlbWVudCl7XHJcbiAgICAgIGUgPSBjcmVhdGVQcm94eShpc1N0cmluZyhldmVudCkgPyAkLkV2ZW50KGV2ZW50KSA6IGV2ZW50KVxyXG4gICAgICBlLl9hcmdzID0gYXJnc1xyXG4gICAgICBlLnRhcmdldCA9IGVsZW1lbnRcclxuICAgICAgJC5lYWNoKGZpbmRIYW5kbGVycyhlbGVtZW50LCBldmVudC50eXBlIHx8IGV2ZW50KSwgZnVuY3Rpb24oaSwgaGFuZGxlcil7XHJcbiAgICAgICAgcmVzdWx0ID0gaGFuZGxlci5wcm94eShlKVxyXG4gICAgICAgIGlmIChlLmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkKCkpIHJldHVybiBmYWxzZVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICAgIHJldHVybiByZXN1bHRcclxuICB9XHJcblxyXG4gIC8vIHNob3J0Y3V0IG1ldGhvZHMgZm9yIGAuYmluZChldmVudCwgZm4pYCBmb3IgZWFjaCBldmVudCB0eXBlXHJcbiAgOygnZm9jdXNpbiBmb2N1c291dCBmb2N1cyBibHVyIGxvYWQgcmVzaXplIHNjcm9sbCB1bmxvYWQgY2xpY2sgZGJsY2xpY2sgJytcclxuICAnbW91c2Vkb3duIG1vdXNldXAgbW91c2Vtb3ZlIG1vdXNlb3ZlciBtb3VzZW91dCBtb3VzZWVudGVyIG1vdXNlbGVhdmUgJytcclxuICAnY2hhbmdlIHNlbGVjdCBrZXlkb3duIGtleXByZXNzIGtleXVwIGVycm9yJykuc3BsaXQoJyAnKS5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAkLmZuW2V2ZW50XSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAgIHJldHVybiAoMCBpbiBhcmd1bWVudHMpID9cclxuICAgICAgICB0aGlzLmJpbmQoZXZlbnQsIGNhbGxiYWNrKSA6XHJcbiAgICAgICAgdGhpcy50cmlnZ2VyKGV2ZW50KVxyXG4gICAgfVxyXG4gIH0pXHJcblxyXG4gICQuRXZlbnQgPSBmdW5jdGlvbih0eXBlLCBwcm9wcykge1xyXG4gICAgaWYgKCFpc1N0cmluZyh0eXBlKSkgcHJvcHMgPSB0eXBlLCB0eXBlID0gcHJvcHMudHlwZVxyXG4gICAgdmFyIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoc3BlY2lhbEV2ZW50c1t0eXBlXSB8fCAnRXZlbnRzJyksIGJ1YmJsZXMgPSB0cnVlXHJcbiAgICBpZiAocHJvcHMpIGZvciAodmFyIG5hbWUgaW4gcHJvcHMpIChuYW1lID09ICdidWJibGVzJykgPyAoYnViYmxlcyA9ICEhcHJvcHNbbmFtZV0pIDogKGV2ZW50W25hbWVdID0gcHJvcHNbbmFtZV0pXHJcbiAgICBldmVudC5pbml0RXZlbnQodHlwZSwgYnViYmxlcywgdHJ1ZSlcclxuICAgIHJldHVybiBjb21wYXRpYmxlKGV2ZW50KVxyXG4gIH1cclxuXHJcbn0pKFplcHRvKVxyXG5cclxuXHJcblxyXG5cclxuXHJcbjsoZnVuY3Rpb24oJCl7XHJcbiAgdmFyIGpzb25wSUQgPSAwLFxyXG4gICAgICBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcclxuICAgICAga2V5LFxyXG4gICAgICBuYW1lLFxyXG4gICAgICByc2NyaXB0ID0gLzxzY3JpcHRcXGJbXjxdKig/Oig/ITxcXC9zY3JpcHQ+KTxbXjxdKikqPFxcL3NjcmlwdD4vZ2ksXHJcbiAgICAgIHNjcmlwdFR5cGVSRSA9IC9eKD86dGV4dHxhcHBsaWNhdGlvbilcXC9qYXZhc2NyaXB0L2ksXHJcbiAgICAgIHhtbFR5cGVSRSA9IC9eKD86dGV4dHxhcHBsaWNhdGlvbilcXC94bWwvaSxcclxuICAgICAganNvblR5cGUgPSAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgIGh0bWxUeXBlID0gJ3RleHQvaHRtbCcsXHJcbiAgICAgIGJsYW5rUkUgPSAvXlxccyokLyxcclxuICAgICAgb3JpZ2luQW5jaG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXHJcblxyXG4gIG9yaWdpbkFuY2hvci5ocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWZcclxuXHJcbiAgLy8gdHJpZ2dlciBhIGN1c3RvbSBldmVudCBhbmQgcmV0dXJuIGZhbHNlIGlmIGl0IHdhcyBjYW5jZWxsZWRcclxuICBmdW5jdGlvbiB0cmlnZ2VyQW5kUmV0dXJuKGNvbnRleHQsIGV2ZW50TmFtZSwgZGF0YSkge1xyXG4gICAgdmFyIGV2ZW50ID0gJC5FdmVudChldmVudE5hbWUpXHJcbiAgICAkKGNvbnRleHQpLnRyaWdnZXIoZXZlbnQsIGRhdGEpXHJcbiAgICByZXR1cm4gIWV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpXHJcbiAgfVxyXG5cclxuICAvLyB0cmlnZ2VyIGFuIEFqYXggXCJnbG9iYWxcIiBldmVudFxyXG4gIGZ1bmN0aW9uIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIGNvbnRleHQsIGV2ZW50TmFtZSwgZGF0YSkge1xyXG4gICAgaWYgKHNldHRpbmdzLmdsb2JhbCkgcmV0dXJuIHRyaWdnZXJBbmRSZXR1cm4oY29udGV4dCB8fCBkb2N1bWVudCwgZXZlbnROYW1lLCBkYXRhKVxyXG4gIH1cclxuXHJcbiAgLy8gTnVtYmVyIG9mIGFjdGl2ZSBBamF4IHJlcXVlc3RzXHJcbiAgJC5hY3RpdmUgPSAwXHJcblxyXG4gIGZ1bmN0aW9uIGFqYXhTdGFydChzZXR0aW5ncykge1xyXG4gICAgaWYgKHNldHRpbmdzLmdsb2JhbCAmJiAkLmFjdGl2ZSsrID09PSAwKSB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBudWxsLCAnYWpheFN0YXJ0JylcclxuICB9XHJcbiAgZnVuY3Rpb24gYWpheFN0b3Aoc2V0dGluZ3MpIHtcclxuICAgIGlmIChzZXR0aW5ncy5nbG9iYWwgJiYgISgtLSQuYWN0aXZlKSkgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgbnVsbCwgJ2FqYXhTdG9wJylcclxuICB9XHJcblxyXG4gIC8vIHRyaWdnZXJzIGFuIGV4dHJhIGdsb2JhbCBldmVudCBcImFqYXhCZWZvcmVTZW5kXCIgdGhhdCdzIGxpa2UgXCJhamF4U2VuZFwiIGJ1dCBjYW5jZWxhYmxlXHJcbiAgZnVuY3Rpb24gYWpheEJlZm9yZVNlbmQoeGhyLCBzZXR0aW5ncykge1xyXG4gICAgdmFyIGNvbnRleHQgPSBzZXR0aW5ncy5jb250ZXh0XHJcbiAgICBpZiAoc2V0dGluZ3MuYmVmb3JlU2VuZC5jYWxsKGNvbnRleHQsIHhociwgc2V0dGluZ3MpID09PSBmYWxzZSB8fFxyXG4gICAgICAgIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIGNvbnRleHQsICdhamF4QmVmb3JlU2VuZCcsIFt4aHIsIHNldHRpbmdzXSkgPT09IGZhbHNlKVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBjb250ZXh0LCAnYWpheFNlbmQnLCBbeGhyLCBzZXR0aW5nc10pXHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGFqYXhTdWNjZXNzKGRhdGEsIHhociwgc2V0dGluZ3MsIGRlZmVycmVkKSB7XHJcbiAgICB2YXIgY29udGV4dCA9IHNldHRpbmdzLmNvbnRleHQsIHN0YXR1cyA9ICdzdWNjZXNzJ1xyXG4gICAgc2V0dGluZ3Muc3VjY2Vzcy5jYWxsKGNvbnRleHQsIGRhdGEsIHN0YXR1cywgeGhyKVxyXG4gICAgaWYgKGRlZmVycmVkKSBkZWZlcnJlZC5yZXNvbHZlV2l0aChjb250ZXh0LCBbZGF0YSwgc3RhdHVzLCB4aHJdKVxyXG4gICAgdHJpZ2dlckdsb2JhbChzZXR0aW5ncywgY29udGV4dCwgJ2FqYXhTdWNjZXNzJywgW3hociwgc2V0dGluZ3MsIGRhdGFdKVxyXG4gICAgYWpheENvbXBsZXRlKHN0YXR1cywgeGhyLCBzZXR0aW5ncylcclxuICB9XHJcbiAgLy8gdHlwZTogXCJ0aW1lb3V0XCIsIFwiZXJyb3JcIiwgXCJhYm9ydFwiLCBcInBhcnNlcmVycm9yXCJcclxuICBmdW5jdGlvbiBhamF4RXJyb3IoZXJyb3IsIHR5cGUsIHhociwgc2V0dGluZ3MsIGRlZmVycmVkKSB7XHJcbiAgICB2YXIgY29udGV4dCA9IHNldHRpbmdzLmNvbnRleHRcclxuICAgIHNldHRpbmdzLmVycm9yLmNhbGwoY29udGV4dCwgeGhyLCB0eXBlLCBlcnJvcilcclxuICAgIGlmIChkZWZlcnJlZCkgZGVmZXJyZWQucmVqZWN0V2l0aChjb250ZXh0LCBbeGhyLCB0eXBlLCBlcnJvcl0pXHJcbiAgICB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBjb250ZXh0LCAnYWpheEVycm9yJywgW3hociwgc2V0dGluZ3MsIGVycm9yIHx8IHR5cGVdKVxyXG4gICAgYWpheENvbXBsZXRlKHR5cGUsIHhociwgc2V0dGluZ3MpXHJcbiAgfVxyXG4gIC8vIHN0YXR1czogXCJzdWNjZXNzXCIsIFwibm90bW9kaWZpZWRcIiwgXCJlcnJvclwiLCBcInRpbWVvdXRcIiwgXCJhYm9ydFwiLCBcInBhcnNlcmVycm9yXCJcclxuICBmdW5jdGlvbiBhamF4Q29tcGxldGUoc3RhdHVzLCB4aHIsIHNldHRpbmdzKSB7XHJcbiAgICB2YXIgY29udGV4dCA9IHNldHRpbmdzLmNvbnRleHRcclxuICAgIHNldHRpbmdzLmNvbXBsZXRlLmNhbGwoY29udGV4dCwgeGhyLCBzdGF0dXMpXHJcbiAgICB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBjb250ZXh0LCAnYWpheENvbXBsZXRlJywgW3hociwgc2V0dGluZ3NdKVxyXG4gICAgYWpheFN0b3Aoc2V0dGluZ3MpXHJcbiAgfVxyXG5cclxuICAvLyBFbXB0eSBmdW5jdGlvbiwgdXNlZCBhcyBkZWZhdWx0IGNhbGxiYWNrXHJcbiAgZnVuY3Rpb24gZW1wdHkoKSB7fVxyXG5cclxuICAkLmFqYXhKU09OUCA9IGZ1bmN0aW9uKG9wdGlvbnMsIGRlZmVycmVkKXtcclxuICAgIGlmICghKCd0eXBlJyBpbiBvcHRpb25zKSkgcmV0dXJuICQuYWpheChvcHRpb25zKVxyXG5cclxuICAgIHZhciBfY2FsbGJhY2tOYW1lID0gb3B0aW9ucy5qc29ucENhbGxiYWNrLFxyXG4gICAgICBjYWxsYmFja05hbWUgPSAoJC5pc0Z1bmN0aW9uKF9jYWxsYmFja05hbWUpID9cclxuICAgICAgICBfY2FsbGJhY2tOYW1lKCkgOiBfY2FsbGJhY2tOYW1lKSB8fCAoJ2pzb25wJyArICgrK2pzb25wSUQpKSxcclxuICAgICAgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JyksXHJcbiAgICAgIG9yaWdpbmFsQ2FsbGJhY2sgPSB3aW5kb3dbY2FsbGJhY2tOYW1lXSxcclxuICAgICAgcmVzcG9uc2VEYXRhLFxyXG4gICAgICBhYm9ydCA9IGZ1bmN0aW9uKGVycm9yVHlwZSkge1xyXG4gICAgICAgICQoc2NyaXB0KS50cmlnZ2VySGFuZGxlcignZXJyb3InLCBlcnJvclR5cGUgfHwgJ2Fib3J0JylcclxuICAgICAgfSxcclxuICAgICAgeGhyID0geyBhYm9ydDogYWJvcnQgfSwgYWJvcnRUaW1lb3V0XHJcblxyXG4gICAgaWYgKGRlZmVycmVkKSBkZWZlcnJlZC5wcm9taXNlKHhocilcclxuXHJcbiAgICAkKHNjcmlwdCkub24oJ2xvYWQgZXJyb3InLCBmdW5jdGlvbihlLCBlcnJvclR5cGUpe1xyXG4gICAgICBjbGVhclRpbWVvdXQoYWJvcnRUaW1lb3V0KVxyXG4gICAgICAkKHNjcmlwdCkub2ZmKCkucmVtb3ZlKClcclxuXHJcbiAgICAgIGlmIChlLnR5cGUgPT0gJ2Vycm9yJyB8fCAhcmVzcG9uc2VEYXRhKSB7XHJcbiAgICAgICAgYWpheEVycm9yKG51bGwsIGVycm9yVHlwZSB8fCAnZXJyb3InLCB4aHIsIG9wdGlvbnMsIGRlZmVycmVkKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFqYXhTdWNjZXNzKHJlc3BvbnNlRGF0YVswXSwgeGhyLCBvcHRpb25zLCBkZWZlcnJlZClcclxuICAgICAgfVxyXG5cclxuICAgICAgd2luZG93W2NhbGxiYWNrTmFtZV0gPSBvcmlnaW5hbENhbGxiYWNrXHJcbiAgICAgIGlmIChyZXNwb25zZURhdGEgJiYgJC5pc0Z1bmN0aW9uKG9yaWdpbmFsQ2FsbGJhY2spKVxyXG4gICAgICAgIG9yaWdpbmFsQ2FsbGJhY2socmVzcG9uc2VEYXRhWzBdKVxyXG5cclxuICAgICAgb3JpZ2luYWxDYWxsYmFjayA9IHJlc3BvbnNlRGF0YSA9IHVuZGVmaW5lZFxyXG4gICAgfSlcclxuXHJcbiAgICBpZiAoYWpheEJlZm9yZVNlbmQoeGhyLCBvcHRpb25zKSA9PT0gZmFsc2UpIHtcclxuICAgICAgYWJvcnQoJ2Fib3J0JylcclxuICAgICAgcmV0dXJuIHhoclxyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvd1tjYWxsYmFja05hbWVdID0gZnVuY3Rpb24oKXtcclxuICAgICAgcmVzcG9uc2VEYXRhID0gYXJndW1lbnRzXHJcbiAgICB9XHJcblxyXG4gICAgc2NyaXB0LnNyYyA9IG9wdGlvbnMudXJsLnJlcGxhY2UoL1xcPyguKyk9XFw/LywgJz8kMT0nICsgY2FsbGJhY2tOYW1lKVxyXG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpXHJcblxyXG4gICAgaWYgKG9wdGlvbnMudGltZW91dCA+IDApIGFib3J0VGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgYWJvcnQoJ3RpbWVvdXQnKVxyXG4gICAgfSwgb3B0aW9ucy50aW1lb3V0KVxyXG5cclxuICAgIHJldHVybiB4aHJcclxuICB9XHJcblxyXG4gICQuYWpheFNldHRpbmdzID0ge1xyXG4gICAgLy8gRGVmYXVsdCB0eXBlIG9mIHJlcXVlc3RcclxuICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgLy8gQ2FsbGJhY2sgdGhhdCBpcyBleGVjdXRlZCBiZWZvcmUgcmVxdWVzdFxyXG4gICAgYmVmb3JlU2VuZDogZW1wdHksXHJcbiAgICAvLyBDYWxsYmFjayB0aGF0IGlzIGV4ZWN1dGVkIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRzXHJcbiAgICBzdWNjZXNzOiBlbXB0eSxcclxuICAgIC8vIENhbGxiYWNrIHRoYXQgaXMgZXhlY3V0ZWQgdGhlIHRoZSBzZXJ2ZXIgZHJvcHMgZXJyb3JcclxuICAgIGVycm9yOiBlbXB0eSxcclxuICAgIC8vIENhbGxiYWNrIHRoYXQgaXMgZXhlY3V0ZWQgb24gcmVxdWVzdCBjb21wbGV0ZSAoYm90aDogZXJyb3IgYW5kIHN1Y2Nlc3MpXHJcbiAgICBjb21wbGV0ZTogZW1wdHksXHJcbiAgICAvLyBUaGUgY29udGV4dCBmb3IgdGhlIGNhbGxiYWNrc1xyXG4gICAgY29udGV4dDogbnVsbCxcclxuICAgIC8vIFdoZXRoZXIgdG8gdHJpZ2dlciBcImdsb2JhbFwiIEFqYXggZXZlbnRzXHJcbiAgICBnbG9iYWw6IHRydWUsXHJcbiAgICAvLyBUcmFuc3BvcnRcclxuICAgIHhocjogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpXHJcbiAgICB9LFxyXG4gICAgLy8gTUlNRSB0eXBlcyBtYXBwaW5nXHJcbiAgICAvLyBJSVMgcmV0dXJucyBKYXZhc2NyaXB0IGFzIFwiYXBwbGljYXRpb24veC1qYXZhc2NyaXB0XCJcclxuICAgIGFjY2VwdHM6IHtcclxuICAgICAgc2NyaXB0OiAndGV4dC9qYXZhc2NyaXB0LCBhcHBsaWNhdGlvbi9qYXZhc2NyaXB0LCBhcHBsaWNhdGlvbi94LWphdmFzY3JpcHQnLFxyXG4gICAgICBqc29uOiAgIGpzb25UeXBlLFxyXG4gICAgICB4bWw6ICAgICdhcHBsaWNhdGlvbi94bWwsIHRleHQveG1sJyxcclxuICAgICAgaHRtbDogICBodG1sVHlwZSxcclxuICAgICAgdGV4dDogICAndGV4dC9wbGFpbidcclxuICAgIH0sXHJcbiAgICAvLyBXaGV0aGVyIHRoZSByZXF1ZXN0IGlzIHRvIGFub3RoZXIgZG9tYWluXHJcbiAgICBjcm9zc0RvbWFpbjogZmFsc2UsXHJcbiAgICAvLyBEZWZhdWx0IHRpbWVvdXRcclxuICAgIHRpbWVvdXQ6IDAsXHJcbiAgICAvLyBXaGV0aGVyIGRhdGEgc2hvdWxkIGJlIHNlcmlhbGl6ZWQgdG8gc3RyaW5nXHJcbiAgICBwcm9jZXNzRGF0YTogdHJ1ZSxcclxuICAgIC8vIFdoZXRoZXIgdGhlIGJyb3dzZXIgc2hvdWxkIGJlIGFsbG93ZWQgdG8gY2FjaGUgR0VUIHJlc3BvbnNlc1xyXG4gICAgY2FjaGU6IHRydWVcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG1pbWVUb0RhdGFUeXBlKG1pbWUpIHtcclxuICAgIGlmIChtaW1lKSBtaW1lID0gbWltZS5zcGxpdCgnOycsIDIpWzBdXHJcbiAgICByZXR1cm4gbWltZSAmJiAoIG1pbWUgPT0gaHRtbFR5cGUgPyAnaHRtbCcgOlxyXG4gICAgICBtaW1lID09IGpzb25UeXBlID8gJ2pzb24nIDpcclxuICAgICAgc2NyaXB0VHlwZVJFLnRlc3QobWltZSkgPyAnc2NyaXB0JyA6XHJcbiAgICAgIHhtbFR5cGVSRS50ZXN0KG1pbWUpICYmICd4bWwnICkgfHwgJ3RleHQnXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhcHBlbmRRdWVyeSh1cmwsIHF1ZXJ5KSB7XHJcbiAgICBpZiAocXVlcnkgPT0gJycpIHJldHVybiB1cmxcclxuICAgIHJldHVybiAodXJsICsgJyYnICsgcXVlcnkpLnJlcGxhY2UoL1smP117MSwyfS8sICc/JylcclxuICB9XHJcblxyXG4gIC8vIHNlcmlhbGl6ZSBwYXlsb2FkIGFuZCBhcHBlbmQgaXQgdG8gdGhlIFVSTCBmb3IgR0VUIHJlcXVlc3RzXHJcbiAgZnVuY3Rpb24gc2VyaWFsaXplRGF0YShvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucy5wcm9jZXNzRGF0YSAmJiBvcHRpb25zLmRhdGEgJiYgJC50eXBlKG9wdGlvbnMuZGF0YSkgIT0gXCJzdHJpbmdcIilcclxuICAgICAgb3B0aW9ucy5kYXRhID0gJC5wYXJhbShvcHRpb25zLmRhdGEsIG9wdGlvbnMudHJhZGl0aW9uYWwpXHJcbiAgICBpZiAob3B0aW9ucy5kYXRhICYmICghb3B0aW9ucy50eXBlIHx8IG9wdGlvbnMudHlwZS50b1VwcGVyQ2FzZSgpID09ICdHRVQnKSlcclxuICAgICAgb3B0aW9ucy51cmwgPSBhcHBlbmRRdWVyeShvcHRpb25zLnVybCwgb3B0aW9ucy5kYXRhKSwgb3B0aW9ucy5kYXRhID0gdW5kZWZpbmVkXHJcbiAgfVxyXG5cclxuICAkLmFqYXggPSBmdW5jdGlvbihvcHRpb25zKXtcclxuICAgIHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBvcHRpb25zIHx8IHt9KSxcclxuICAgICAgICBkZWZlcnJlZCA9ICQuRGVmZXJyZWQgJiYgJC5EZWZlcnJlZCgpLFxyXG4gICAgICAgIHVybEFuY2hvciwgaGFzaEluZGV4XHJcbiAgICBmb3IgKGtleSBpbiAkLmFqYXhTZXR0aW5ncykgaWYgKHNldHRpbmdzW2tleV0gPT09IHVuZGVmaW5lZCkgc2V0dGluZ3Nba2V5XSA9ICQuYWpheFNldHRpbmdzW2tleV1cclxuXHJcbiAgICBhamF4U3RhcnQoc2V0dGluZ3MpXHJcblxyXG4gICAgaWYgKCFzZXR0aW5ncy5jcm9zc0RvbWFpbikge1xyXG4gICAgICB1cmxBbmNob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcclxuICAgICAgdXJsQW5jaG9yLmhyZWYgPSBzZXR0aW5ncy51cmxcclxuICAgICAgdXJsQW5jaG9yLmhyZWYgPSB1cmxBbmNob3IuaHJlZlxyXG4gICAgICBzZXR0aW5ncy5jcm9zc0RvbWFpbiA9IChvcmlnaW5BbmNob3IucHJvdG9jb2wgKyAnLy8nICsgb3JpZ2luQW5jaG9yLmhvc3QpICE9PSAodXJsQW5jaG9yLnByb3RvY29sICsgJy8vJyArIHVybEFuY2hvci5ob3N0KVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghc2V0dGluZ3MudXJsKSBzZXR0aW5ncy51cmwgPSB3aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKVxyXG4gICAgaWYgKChoYXNoSW5kZXggPSBzZXR0aW5ncy51cmwuaW5kZXhPZignIycpKSA+IC0xKSBzZXR0aW5ncy51cmwgPSBzZXR0aW5ncy51cmwuc2xpY2UoMCwgaGFzaEluZGV4KVxyXG4gICAgc2VyaWFsaXplRGF0YShzZXR0aW5ncylcclxuXHJcbiAgICB2YXIgZGF0YVR5cGUgPSBzZXR0aW5ncy5kYXRhVHlwZSwgaGFzUGxhY2Vob2xkZXIgPSAvXFw/Lis9XFw/Ly50ZXN0KHNldHRpbmdzLnVybClcclxuICAgIGlmIChoYXNQbGFjZWhvbGRlcikgZGF0YVR5cGUgPSAnanNvbnAnXHJcblxyXG4gICAgaWYgKHNldHRpbmdzLmNhY2hlID09PSBmYWxzZSB8fCAoXHJcbiAgICAgICAgICghb3B0aW9ucyB8fCBvcHRpb25zLmNhY2hlICE9PSB0cnVlKSAmJlxyXG4gICAgICAgICAoJ3NjcmlwdCcgPT0gZGF0YVR5cGUgfHwgJ2pzb25wJyA9PSBkYXRhVHlwZSlcclxuICAgICAgICApKVxyXG4gICAgICBzZXR0aW5ncy51cmwgPSBhcHBlbmRRdWVyeShzZXR0aW5ncy51cmwsICdfPScgKyBEYXRlLm5vdygpKVxyXG5cclxuICAgIGlmICgnanNvbnAnID09IGRhdGFUeXBlKSB7XHJcbiAgICAgIGlmICghaGFzUGxhY2Vob2xkZXIpXHJcbiAgICAgICAgc2V0dGluZ3MudXJsID0gYXBwZW5kUXVlcnkoc2V0dGluZ3MudXJsLFxyXG4gICAgICAgICAgc2V0dGluZ3MuanNvbnAgPyAoc2V0dGluZ3MuanNvbnAgKyAnPT8nKSA6IHNldHRpbmdzLmpzb25wID09PSBmYWxzZSA/ICcnIDogJ2NhbGxiYWNrPT8nKVxyXG4gICAgICByZXR1cm4gJC5hamF4SlNPTlAoc2V0dGluZ3MsIGRlZmVycmVkKVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBtaW1lID0gc2V0dGluZ3MuYWNjZXB0c1tkYXRhVHlwZV0sXHJcbiAgICAgICAgaGVhZGVycyA9IHsgfSxcclxuICAgICAgICBzZXRIZWFkZXIgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkgeyBoZWFkZXJzW25hbWUudG9Mb3dlckNhc2UoKV0gPSBbbmFtZSwgdmFsdWVdIH0sXHJcbiAgICAgICAgcHJvdG9jb2wgPSAvXihbXFx3LV0rOilcXC9cXC8vLnRlc3Qoc2V0dGluZ3MudXJsKSA/IFJlZ0V4cC4kMSA6IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCxcclxuICAgICAgICB4aHIgPSBzZXR0aW5ncy54aHIoKSxcclxuICAgICAgICBuYXRpdmVTZXRIZWFkZXIgPSB4aHIuc2V0UmVxdWVzdEhlYWRlcixcclxuICAgICAgICBhYm9ydFRpbWVvdXRcclxuXHJcbiAgICBpZiAoZGVmZXJyZWQpIGRlZmVycmVkLnByb21pc2UoeGhyKVxyXG5cclxuICAgIGlmICghc2V0dGluZ3MuY3Jvc3NEb21haW4pIHNldEhlYWRlcignWC1SZXF1ZXN0ZWQtV2l0aCcsICdYTUxIdHRwUmVxdWVzdCcpXHJcbiAgICBzZXRIZWFkZXIoJ0FjY2VwdCcsIG1pbWUgfHwgJyovKicpXHJcbiAgICBpZiAobWltZSA9IHNldHRpbmdzLm1pbWVUeXBlIHx8IG1pbWUpIHtcclxuICAgICAgaWYgKG1pbWUuaW5kZXhPZignLCcpID4gLTEpIG1pbWUgPSBtaW1lLnNwbGl0KCcsJywgMilbMF1cclxuICAgICAgeGhyLm92ZXJyaWRlTWltZVR5cGUgJiYgeGhyLm92ZXJyaWRlTWltZVR5cGUobWltZSlcclxuICAgIH1cclxuICAgIGlmIChzZXR0aW5ncy5jb250ZW50VHlwZSB8fCAoc2V0dGluZ3MuY29udGVudFR5cGUgIT09IGZhbHNlICYmIHNldHRpbmdzLmRhdGEgJiYgc2V0dGluZ3MudHlwZS50b1VwcGVyQ2FzZSgpICE9ICdHRVQnKSlcclxuICAgICAgc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCBzZXR0aW5ncy5jb250ZW50VHlwZSB8fCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJylcclxuXHJcbiAgICBpZiAoc2V0dGluZ3MuaGVhZGVycykgZm9yIChuYW1lIGluIHNldHRpbmdzLmhlYWRlcnMpIHNldEhlYWRlcihuYW1lLCBzZXR0aW5ncy5oZWFkZXJzW25hbWVdKVxyXG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIgPSBzZXRIZWFkZXJcclxuXHJcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKXtcclxuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQpIHtcclxuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZW1wdHlcclxuICAgICAgICBjbGVhclRpbWVvdXQoYWJvcnRUaW1lb3V0KVxyXG4gICAgICAgIHZhciByZXN1bHQsIGVycm9yID0gZmFsc2VcclxuICAgICAgICBpZiAoKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIHx8IHhoci5zdGF0dXMgPT0gMzA0IHx8ICh4aHIuc3RhdHVzID09IDAgJiYgcHJvdG9jb2wgPT0gJ2ZpbGU6JykpIHtcclxuICAgICAgICAgIGRhdGFUeXBlID0gZGF0YVR5cGUgfHwgbWltZVRvRGF0YVR5cGUoc2V0dGluZ3MubWltZVR5cGUgfHwgeGhyLmdldFJlc3BvbnNlSGVhZGVyKCdjb250ZW50LXR5cGUnKSlcclxuICAgICAgICAgIHJlc3VsdCA9IHhoci5yZXNwb25zZVRleHRcclxuXHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBodHRwOi8vcGVyZmVjdGlvbmtpbGxzLmNvbS9nbG9iYWwtZXZhbC13aGF0LWFyZS10aGUtb3B0aW9ucy9cclxuICAgICAgICAgICAgaWYgKGRhdGFUeXBlID09ICdzY3JpcHQnKSAgICAoMSxldmFsKShyZXN1bHQpXHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGRhdGFUeXBlID09ICd4bWwnKSAgcmVzdWx0ID0geGhyLnJlc3BvbnNlWE1MXHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGRhdGFUeXBlID09ICdqc29uJykgcmVzdWx0ID0gYmxhbmtSRS50ZXN0KHJlc3VsdCkgPyBudWxsIDogJC5wYXJzZUpTT04ocmVzdWx0KVxyXG4gICAgICAgICAgfSBjYXRjaCAoZSkgeyBlcnJvciA9IGUgfVxyXG5cclxuICAgICAgICAgIGlmIChlcnJvcikgYWpheEVycm9yKGVycm9yLCAncGFyc2VyZXJyb3InLCB4aHIsIHNldHRpbmdzLCBkZWZlcnJlZClcclxuICAgICAgICAgIGVsc2UgYWpheFN1Y2Nlc3MocmVzdWx0LCB4aHIsIHNldHRpbmdzLCBkZWZlcnJlZClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYWpheEVycm9yKHhoci5zdGF0dXNUZXh0IHx8IG51bGwsIHhoci5zdGF0dXMgPyAnZXJyb3InIDogJ2Fib3J0JywgeGhyLCBzZXR0aW5ncywgZGVmZXJyZWQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGFqYXhCZWZvcmVTZW5kKHhociwgc2V0dGluZ3MpID09PSBmYWxzZSkge1xyXG4gICAgICB4aHIuYWJvcnQoKVxyXG4gICAgICBhamF4RXJyb3IobnVsbCwgJ2Fib3J0JywgeGhyLCBzZXR0aW5ncywgZGVmZXJyZWQpXHJcbiAgICAgIHJldHVybiB4aHJcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2V0dGluZ3MueGhyRmllbGRzKSBmb3IgKG5hbWUgaW4gc2V0dGluZ3MueGhyRmllbGRzKSB4aHJbbmFtZV0gPSBzZXR0aW5ncy54aHJGaWVsZHNbbmFtZV1cclxuXHJcbiAgICB2YXIgYXN5bmMgPSAnYXN5bmMnIGluIHNldHRpbmdzID8gc2V0dGluZ3MuYXN5bmMgOiB0cnVlXHJcbiAgICB4aHIub3BlbihzZXR0aW5ncy50eXBlLCBzZXR0aW5ncy51cmwsIGFzeW5jLCBzZXR0aW5ncy51c2VybmFtZSwgc2V0dGluZ3MucGFzc3dvcmQpXHJcblxyXG4gICAgZm9yIChuYW1lIGluIGhlYWRlcnMpIG5hdGl2ZVNldEhlYWRlci5hcHBseSh4aHIsIGhlYWRlcnNbbmFtZV0pXHJcblxyXG4gICAgaWYgKHNldHRpbmdzLnRpbWVvdXQgPiAwKSBhYm9ydFRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGVtcHR5XHJcbiAgICAgICAgeGhyLmFib3J0KClcclxuICAgICAgICBhamF4RXJyb3IobnVsbCwgJ3RpbWVvdXQnLCB4aHIsIHNldHRpbmdzLCBkZWZlcnJlZClcclxuICAgICAgfSwgc2V0dGluZ3MudGltZW91dClcclxuXHJcbiAgICAvLyBhdm9pZCBzZW5kaW5nIGVtcHR5IHN0cmluZyAoIzMxOSlcclxuICAgIHhoci5zZW5kKHNldHRpbmdzLmRhdGEgPyBzZXR0aW5ncy5kYXRhIDogbnVsbClcclxuICAgIHJldHVybiB4aHJcclxuICB9XHJcblxyXG4gIC8vIGhhbmRsZSBvcHRpb25hbCBkYXRhL3N1Y2Nlc3MgYXJndW1lbnRzXHJcbiAgZnVuY3Rpb24gcGFyc2VBcmd1bWVudHModXJsLCBkYXRhLCBzdWNjZXNzLCBkYXRhVHlwZSkge1xyXG4gICAgaWYgKCQuaXNGdW5jdGlvbihkYXRhKSkgZGF0YVR5cGUgPSBzdWNjZXNzLCBzdWNjZXNzID0gZGF0YSwgZGF0YSA9IHVuZGVmaW5lZFxyXG4gICAgaWYgKCEkLmlzRnVuY3Rpb24oc3VjY2VzcykpIGRhdGFUeXBlID0gc3VjY2Vzcywgc3VjY2VzcyA9IHVuZGVmaW5lZFxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdXJsOiB1cmxcclxuICAgICwgZGF0YTogZGF0YVxyXG4gICAgLCBzdWNjZXNzOiBzdWNjZXNzXHJcbiAgICAsIGRhdGFUeXBlOiBkYXRhVHlwZVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJC5nZXQgPSBmdW5jdGlvbigvKiB1cmwsIGRhdGEsIHN1Y2Nlc3MsIGRhdGFUeXBlICovKXtcclxuICAgIHJldHVybiAkLmFqYXgocGFyc2VBcmd1bWVudHMuYXBwbHkobnVsbCwgYXJndW1lbnRzKSlcclxuICB9XHJcblxyXG4gICQucG9zdCA9IGZ1bmN0aW9uKC8qIHVybCwgZGF0YSwgc3VjY2VzcywgZGF0YVR5cGUgKi8pe1xyXG4gICAgdmFyIG9wdGlvbnMgPSBwYXJzZUFyZ3VtZW50cy5hcHBseShudWxsLCBhcmd1bWVudHMpXHJcbiAgICBvcHRpb25zLnR5cGUgPSAnUE9TVCdcclxuICAgIHJldHVybiAkLmFqYXgob3B0aW9ucylcclxuICB9XHJcblxyXG4gICQuZ2V0SlNPTiA9IGZ1bmN0aW9uKC8qIHVybCwgZGF0YSwgc3VjY2VzcyAqLyl7XHJcbiAgICB2YXIgb3B0aW9ucyA9IHBhcnNlQXJndW1lbnRzLmFwcGx5KG51bGwsIGFyZ3VtZW50cylcclxuICAgIG9wdGlvbnMuZGF0YVR5cGUgPSAnanNvbidcclxuICAgIHJldHVybiAkLmFqYXgob3B0aW9ucylcclxuICB9XHJcblxyXG4gICQuZm4ubG9hZCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgc3VjY2Vzcyl7XHJcbiAgICBpZiAoIXRoaXMubGVuZ3RoKSByZXR1cm4gdGhpc1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzLCBwYXJ0cyA9IHVybC5zcGxpdCgvXFxzLyksIHNlbGVjdG9yLFxyXG4gICAgICAgIG9wdGlvbnMgPSBwYXJzZUFyZ3VtZW50cyh1cmwsIGRhdGEsIHN1Y2Nlc3MpLFxyXG4gICAgICAgIGNhbGxiYWNrID0gb3B0aW9ucy5zdWNjZXNzXHJcbiAgICBpZiAocGFydHMubGVuZ3RoID4gMSkgb3B0aW9ucy51cmwgPSBwYXJ0c1swXSwgc2VsZWN0b3IgPSBwYXJ0c1sxXVxyXG4gICAgb3B0aW9ucy5zdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICBzZWxmLmh0bWwoc2VsZWN0b3IgP1xyXG4gICAgICAgICQoJzxkaXY+JykuaHRtbChyZXNwb25zZS5yZXBsYWNlKHJzY3JpcHQsIFwiXCIpKS5maW5kKHNlbGVjdG9yKVxyXG4gICAgICAgIDogcmVzcG9uc2UpXHJcbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrLmFwcGx5KHNlbGYsIGFyZ3VtZW50cylcclxuICAgIH1cclxuICAgICQuYWpheChvcHRpb25zKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcblxyXG4gIHZhciBlc2NhcGUgPSBlbmNvZGVVUklDb21wb25lbnRcclxuXHJcbiAgZnVuY3Rpb24gc2VyaWFsaXplKHBhcmFtcywgb2JqLCB0cmFkaXRpb25hbCwgc2NvcGUpe1xyXG4gICAgdmFyIHR5cGUsIGFycmF5ID0gJC5pc0FycmF5KG9iaiksIGhhc2ggPSAkLmlzUGxhaW5PYmplY3Qob2JqKVxyXG4gICAgJC5lYWNoKG9iaiwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xyXG4gICAgICB0eXBlID0gJC50eXBlKHZhbHVlKVxyXG4gICAgICBpZiAoc2NvcGUpIGtleSA9IHRyYWRpdGlvbmFsID8gc2NvcGUgOlxyXG4gICAgICAgIHNjb3BlICsgJ1snICsgKGhhc2ggfHwgdHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdhcnJheScgPyBrZXkgOiAnJykgKyAnXSdcclxuICAgICAgLy8gaGFuZGxlIGRhdGEgaW4gc2VyaWFsaXplQXJyYXkoKSBmb3JtYXRcclxuICAgICAgaWYgKCFzY29wZSAmJiBhcnJheSkgcGFyYW1zLmFkZCh2YWx1ZS5uYW1lLCB2YWx1ZS52YWx1ZSlcclxuICAgICAgLy8gcmVjdXJzZSBpbnRvIG5lc3RlZCBvYmplY3RzXHJcbiAgICAgIGVsc2UgaWYgKHR5cGUgPT0gXCJhcnJheVwiIHx8ICghdHJhZGl0aW9uYWwgJiYgdHlwZSA9PSBcIm9iamVjdFwiKSlcclxuICAgICAgICBzZXJpYWxpemUocGFyYW1zLCB2YWx1ZSwgdHJhZGl0aW9uYWwsIGtleSlcclxuICAgICAgZWxzZSBwYXJhbXMuYWRkKGtleSwgdmFsdWUpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgJC5wYXJhbSA9IGZ1bmN0aW9uKG9iaiwgdHJhZGl0aW9uYWwpe1xyXG4gICAgdmFyIHBhcmFtcyA9IFtdXHJcbiAgICBwYXJhbXMuYWRkID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xyXG4gICAgICBpZiAoJC5pc0Z1bmN0aW9uKHZhbHVlKSkgdmFsdWUgPSB2YWx1ZSgpXHJcbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB2YWx1ZSA9IFwiXCJcclxuICAgICAgdGhpcy5wdXNoKGVzY2FwZShrZXkpICsgJz0nICsgZXNjYXBlKHZhbHVlKSlcclxuICAgIH1cclxuICAgIHNlcmlhbGl6ZShwYXJhbXMsIG9iaiwgdHJhZGl0aW9uYWwpXHJcbiAgICByZXR1cm4gcGFyYW1zLmpvaW4oJyYnKS5yZXBsYWNlKC8lMjAvZywgJysnKVxyXG4gIH1cclxufSkoWmVwdG8pXHJcblxyXG5cclxuXHJcblxyXG5cclxuOyhmdW5jdGlvbigpe1xyXG4gIC8vIGdldENvbXB1dGVkU3R5bGUgc2hvdWxkbid0IGZyZWFrIG91dCB3aGVuIGNhbGxlZFxyXG4gIC8vIHdpdGhvdXQgYSB2YWxpZCBlbGVtZW50IGFzIGFyZ3VtZW50XHJcbiAgdHJ5IHtcclxuICAgIGdldENvbXB1dGVkU3R5bGUodW5kZWZpbmVkKVxyXG4gIH0gY2F0Y2goZSkge1xyXG4gICAgdmFyIG5hdGl2ZUdldENvbXB1dGVkU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlO1xyXG4gICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUgPSBmdW5jdGlvbihlbGVtZW50KXtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gbmF0aXZlR2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KVxyXG4gICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICByZXR1cm4gbnVsbFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59KSgpXHJcblxyXG5cclxuXHJcblxyXG5cclxuOyhmdW5jdGlvbigkKXtcclxuICAvLyBDcmVhdGUgYSBjb2xsZWN0aW9uIG9mIGNhbGxiYWNrcyB0byBiZSBmaXJlZCBpbiBhIHNlcXVlbmNlLCB3aXRoIGNvbmZpZ3VyYWJsZSBiZWhhdmlvdXJcclxuICAvLyBPcHRpb24gZmxhZ3M6XHJcbiAgLy8gICAtIG9uY2U6IENhbGxiYWNrcyBmaXJlZCBhdCBtb3N0IG9uZSB0aW1lLlxyXG4gIC8vICAgLSBtZW1vcnk6IFJlbWVtYmVyIHRoZSBtb3N0IHJlY2VudCBjb250ZXh0IGFuZCBhcmd1bWVudHNcclxuICAvLyAgIC0gc3RvcE9uRmFsc2U6IENlYXNlIGl0ZXJhdGluZyBvdmVyIGNhbGxiYWNrIGxpc3RcclxuICAvLyAgIC0gdW5pcXVlOiBQZXJtaXQgYWRkaW5nIGF0IG1vc3Qgb25lIGluc3RhbmNlIG9mIHRoZSBzYW1lIGNhbGxiYWNrXHJcbiAgJC5DYWxsYmFja3MgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gJC5leHRlbmQoe30sIG9wdGlvbnMpXHJcblxyXG4gICAgdmFyIG1lbW9yeSwgLy8gTGFzdCBmaXJlIHZhbHVlIChmb3Igbm9uLWZvcmdldHRhYmxlIGxpc3RzKVxyXG4gICAgICAgIGZpcmVkLCAgLy8gRmxhZyB0byBrbm93IGlmIGxpc3Qgd2FzIGFscmVhZHkgZmlyZWRcclxuICAgICAgICBmaXJpbmcsIC8vIEZsYWcgdG8ga25vdyBpZiBsaXN0IGlzIGN1cnJlbnRseSBmaXJpbmdcclxuICAgICAgICBmaXJpbmdTdGFydCwgLy8gRmlyc3QgY2FsbGJhY2sgdG8gZmlyZSAodXNlZCBpbnRlcm5hbGx5IGJ5IGFkZCBhbmQgZmlyZVdpdGgpXHJcbiAgICAgICAgZmlyaW5nTGVuZ3RoLCAvLyBFbmQgb2YgdGhlIGxvb3Agd2hlbiBmaXJpbmdcclxuICAgICAgICBmaXJpbmdJbmRleCwgLy8gSW5kZXggb2YgY3VycmVudGx5IGZpcmluZyBjYWxsYmFjayAobW9kaWZpZWQgYnkgcmVtb3ZlIGlmIG5lZWRlZClcclxuICAgICAgICBsaXN0ID0gW10sIC8vIEFjdHVhbCBjYWxsYmFjayBsaXN0XHJcbiAgICAgICAgc3RhY2sgPSAhb3B0aW9ucy5vbmNlICYmIFtdLCAvLyBTdGFjayBvZiBmaXJlIGNhbGxzIGZvciByZXBlYXRhYmxlIGxpc3RzXHJcbiAgICAgICAgZmlyZSA9IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgIG1lbW9yeSA9IG9wdGlvbnMubWVtb3J5ICYmIGRhdGFcclxuICAgICAgICAgIGZpcmVkID0gdHJ1ZVxyXG4gICAgICAgICAgZmlyaW5nSW5kZXggPSBmaXJpbmdTdGFydCB8fCAwXHJcbiAgICAgICAgICBmaXJpbmdTdGFydCA9IDBcclxuICAgICAgICAgIGZpcmluZ0xlbmd0aCA9IGxpc3QubGVuZ3RoXHJcbiAgICAgICAgICBmaXJpbmcgPSB0cnVlXHJcbiAgICAgICAgICBmb3IgKCA7IGxpc3QgJiYgZmlyaW5nSW5kZXggPCBmaXJpbmdMZW5ndGggOyArK2ZpcmluZ0luZGV4ICkge1xyXG4gICAgICAgICAgICBpZiAobGlzdFtmaXJpbmdJbmRleF0uYXBwbHkoZGF0YVswXSwgZGF0YVsxXSkgPT09IGZhbHNlICYmIG9wdGlvbnMuc3RvcE9uRmFsc2UpIHtcclxuICAgICAgICAgICAgICBtZW1vcnkgPSBmYWxzZVxyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGZpcmluZyA9IGZhbHNlXHJcbiAgICAgICAgICBpZiAobGlzdCkge1xyXG4gICAgICAgICAgICBpZiAoc3RhY2spIHN0YWNrLmxlbmd0aCAmJiBmaXJlKHN0YWNrLnNoaWZ0KCkpXHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG1lbW9yeSkgbGlzdC5sZW5ndGggPSAwXHJcbiAgICAgICAgICAgIGVsc2UgQ2FsbGJhY2tzLmRpc2FibGUoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIENhbGxiYWNrcyA9IHtcclxuICAgICAgICAgIGFkZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmIChsaXN0KSB7XHJcbiAgICAgICAgICAgICAgdmFyIHN0YXJ0ID0gbGlzdC5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgIGFkZCA9IGZ1bmN0aW9uKGFyZ3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAkLmVhY2goYXJncywgZnVuY3Rpb24oXywgYXJnKXtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXJnID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLnVuaXF1ZSB8fCAhQ2FsbGJhY2tzLmhhcyhhcmcpKSBsaXN0LnB1c2goYXJnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoYXJnICYmIGFyZy5sZW5ndGggJiYgdHlwZW9mIGFyZyAhPT0gJ3N0cmluZycpIGFkZChhcmcpXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGFkZChhcmd1bWVudHMpXHJcbiAgICAgICAgICAgICAgaWYgKGZpcmluZykgZmlyaW5nTGVuZ3RoID0gbGlzdC5sZW5ndGhcclxuICAgICAgICAgICAgICBlbHNlIGlmIChtZW1vcnkpIHtcclxuICAgICAgICAgICAgICAgIGZpcmluZ1N0YXJ0ID0gc3RhcnRcclxuICAgICAgICAgICAgICAgIGZpcmUobWVtb3J5KVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmIChsaXN0KSB7XHJcbiAgICAgICAgICAgICAgJC5lYWNoKGFyZ3VtZW50cywgZnVuY3Rpb24oXywgYXJnKXtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleFxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKChpbmRleCA9ICQuaW5BcnJheShhcmcsIGxpc3QsIGluZGV4KSkgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICBsaXN0LnNwbGljZShpbmRleCwgMSlcclxuICAgICAgICAgICAgICAgICAgLy8gSGFuZGxlIGZpcmluZyBpbmRleGVzXHJcbiAgICAgICAgICAgICAgICAgIGlmIChmaXJpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPD0gZmlyaW5nTGVuZ3RoKSAtLWZpcmluZ0xlbmd0aFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA8PSBmaXJpbmdJbmRleCkgLS1maXJpbmdJbmRleFxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGhhczogZnVuY3Rpb24oZm4pIHtcclxuICAgICAgICAgICAgcmV0dXJuICEhKGxpc3QgJiYgKGZuID8gJC5pbkFycmF5KGZuLCBsaXN0KSA+IC0xIDogbGlzdC5sZW5ndGgpKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGVtcHR5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZmlyaW5nTGVuZ3RoID0gbGlzdC5sZW5ndGggPSAwXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZGlzYWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGxpc3QgPSBzdGFjayA9IG1lbW9yeSA9IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGRpc2FibGVkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICFsaXN0XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbG9jazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHN0YWNrID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBpZiAoIW1lbW9yeSkgQ2FsbGJhY2tzLmRpc2FibGUoKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGxvY2tlZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAhc3RhY2tcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmaXJlV2l0aDogZnVuY3Rpb24oY29udGV4dCwgYXJncykge1xyXG4gICAgICAgICAgICBpZiAobGlzdCAmJiAoIWZpcmVkIHx8IHN0YWNrKSkge1xyXG4gICAgICAgICAgICAgIGFyZ3MgPSBhcmdzIHx8IFtdXHJcbiAgICAgICAgICAgICAgYXJncyA9IFtjb250ZXh0LCBhcmdzLnNsaWNlID8gYXJncy5zbGljZSgpIDogYXJnc11cclxuICAgICAgICAgICAgICBpZiAoZmlyaW5nKSBzdGFjay5wdXNoKGFyZ3MpXHJcbiAgICAgICAgICAgICAgZWxzZSBmaXJlKGFyZ3MpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmaXJlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIENhbGxiYWNrcy5maXJlV2l0aCh0aGlzLCBhcmd1bWVudHMpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZmlyZWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gISFmaXJlZFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICByZXR1cm4gQ2FsbGJhY2tzXHJcbiAgfVxyXG59KShaZXB0bylcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbjsoZnVuY3Rpb24oJCl7XHJcbiAgdmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlXHJcblxyXG4gIGZ1bmN0aW9uIERlZmVycmVkKGZ1bmMpIHtcclxuICAgIHZhciB0dXBsZXMgPSBbXHJcbiAgICAgICAgICAvLyBhY3Rpb24sIGFkZCBsaXN0ZW5lciwgbGlzdGVuZXIgbGlzdCwgZmluYWwgc3RhdGVcclxuICAgICAgICAgIFsgXCJyZXNvbHZlXCIsIFwiZG9uZVwiLCAkLkNhbGxiYWNrcyh7b25jZToxLCBtZW1vcnk6MX0pLCBcInJlc29sdmVkXCIgXSxcclxuICAgICAgICAgIFsgXCJyZWplY3RcIiwgXCJmYWlsXCIsICQuQ2FsbGJhY2tzKHtvbmNlOjEsIG1lbW9yeToxfSksIFwicmVqZWN0ZWRcIiBdLFxyXG4gICAgICAgICAgWyBcIm5vdGlmeVwiLCBcInByb2dyZXNzXCIsICQuQ2FsbGJhY2tzKHttZW1vcnk6MX0pIF1cclxuICAgICAgICBdLFxyXG4gICAgICAgIHN0YXRlID0gXCJwZW5kaW5nXCIsXHJcbiAgICAgICAgcHJvbWlzZSA9IHtcclxuICAgICAgICAgIHN0YXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYWx3YXlzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZGVmZXJyZWQuZG9uZShhcmd1bWVudHMpLmZhaWwoYXJndW1lbnRzKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHRoZW46IGZ1bmN0aW9uKC8qIGZuRG9uZSBbLCBmbkZhaWxlZCBbLCBmblByb2dyZXNzXV0gKi8pIHtcclxuICAgICAgICAgICAgdmFyIGZucyA9IGFyZ3VtZW50c1xyXG4gICAgICAgICAgICByZXR1cm4gRGVmZXJyZWQoZnVuY3Rpb24oZGVmZXIpe1xyXG4gICAgICAgICAgICAgICQuZWFjaCh0dXBsZXMsIGZ1bmN0aW9uKGksIHR1cGxlKXtcclxuICAgICAgICAgICAgICAgIHZhciBmbiA9ICQuaXNGdW5jdGlvbihmbnNbaV0pICYmIGZuc1tpXVxyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWRbdHVwbGVbMV1dKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgIHZhciByZXR1cm5lZCA9IGZuICYmIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcclxuICAgICAgICAgICAgICAgICAgaWYgKHJldHVybmVkICYmICQuaXNGdW5jdGlvbihyZXR1cm5lZC5wcm9taXNlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybmVkLnByb21pc2UoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgLmRvbmUoZGVmZXIucmVzb2x2ZSlcclxuICAgICAgICAgICAgICAgICAgICAgIC5mYWlsKGRlZmVyLnJlamVjdClcclxuICAgICAgICAgICAgICAgICAgICAgIC5wcm9ncmVzcyhkZWZlci5ub3RpZnkpXHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzID09PSBwcm9taXNlID8gZGVmZXIucHJvbWlzZSgpIDogdGhpcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzID0gZm4gPyBbcmV0dXJuZWRdIDogYXJndW1lbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJbdHVwbGVbMF0gKyBcIldpdGhcIl0oY29udGV4dCwgdmFsdWVzKVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgZm5zID0gbnVsbFxyXG4gICAgICAgICAgICB9KS5wcm9taXNlKClcclxuICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgcHJvbWlzZTogZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYmogIT0gbnVsbCA/ICQuZXh0ZW5kKCBvYmosIHByb21pc2UgKSA6IHByb21pc2VcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlZmVycmVkID0ge31cclxuXHJcbiAgICAkLmVhY2godHVwbGVzLCBmdW5jdGlvbihpLCB0dXBsZSl7XHJcbiAgICAgIHZhciBsaXN0ID0gdHVwbGVbMl0sXHJcbiAgICAgICAgICBzdGF0ZVN0cmluZyA9IHR1cGxlWzNdXHJcblxyXG4gICAgICBwcm9taXNlW3R1cGxlWzFdXSA9IGxpc3QuYWRkXHJcblxyXG4gICAgICBpZiAoc3RhdGVTdHJpbmcpIHtcclxuICAgICAgICBsaXN0LmFkZChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgc3RhdGUgPSBzdGF0ZVN0cmluZ1xyXG4gICAgICAgIH0sIHR1cGxlc1tpXjFdWzJdLmRpc2FibGUsIHR1cGxlc1syXVsyXS5sb2NrKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBkZWZlcnJlZFt0dXBsZVswXV0gPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGRlZmVycmVkW3R1cGxlWzBdICsgXCJXaXRoXCJdKHRoaXMgPT09IGRlZmVycmVkID8gcHJvbWlzZSA6IHRoaXMsIGFyZ3VtZW50cylcclxuICAgICAgICByZXR1cm4gdGhpc1xyXG4gICAgICB9XHJcbiAgICAgIGRlZmVycmVkW3R1cGxlWzBdICsgXCJXaXRoXCJdID0gbGlzdC5maXJlV2l0aFxyXG4gICAgfSlcclxuXHJcbiAgICBwcm9taXNlLnByb21pc2UoZGVmZXJyZWQpXHJcbiAgICBpZiAoZnVuYykgZnVuYy5jYWxsKGRlZmVycmVkLCBkZWZlcnJlZClcclxuICAgIHJldHVybiBkZWZlcnJlZFxyXG4gIH1cclxuXHJcbiAgJC53aGVuID0gZnVuY3Rpb24oc3ViKSB7XHJcbiAgICB2YXIgcmVzb2x2ZVZhbHVlcyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKSxcclxuICAgICAgICBsZW4gPSByZXNvbHZlVmFsdWVzLmxlbmd0aCxcclxuICAgICAgICBpID0gMCxcclxuICAgICAgICByZW1haW4gPSBsZW4gIT09IDEgfHwgKHN1YiAmJiAkLmlzRnVuY3Rpb24oc3ViLnByb21pc2UpKSA/IGxlbiA6IDAsXHJcbiAgICAgICAgZGVmZXJyZWQgPSByZW1haW4gPT09IDEgPyBzdWIgOiBEZWZlcnJlZCgpLFxyXG4gICAgICAgIHByb2dyZXNzVmFsdWVzLCBwcm9ncmVzc0NvbnRleHRzLCByZXNvbHZlQ29udGV4dHMsXHJcbiAgICAgICAgdXBkYXRlRm4gPSBmdW5jdGlvbihpLCBjdHgsIHZhbCl7XHJcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgICAgICAgICBjdHhbaV0gPSB0aGlzXHJcbiAgICAgICAgICAgIHZhbFtpXSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gc2xpY2UuY2FsbChhcmd1bWVudHMpIDogdmFsdWVcclxuICAgICAgICAgICAgaWYgKHZhbCA9PT0gcHJvZ3Jlc3NWYWx1ZXMpIHtcclxuICAgICAgICAgICAgICBkZWZlcnJlZC5ub3RpZnlXaXRoKGN0eCwgdmFsKVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCEoLS1yZW1haW4pKSB7XHJcbiAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZVdpdGgoY3R4LCB2YWwpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgaWYgKGxlbiA+IDEpIHtcclxuICAgICAgcHJvZ3Jlc3NWYWx1ZXMgPSBuZXcgQXJyYXkobGVuKVxyXG4gICAgICBwcm9ncmVzc0NvbnRleHRzID0gbmV3IEFycmF5KGxlbilcclxuICAgICAgcmVzb2x2ZUNvbnRleHRzID0gbmV3IEFycmF5KGxlbilcclxuICAgICAgZm9yICggOyBpIDwgbGVuOyArK2kgKSB7XHJcbiAgICAgICAgaWYgKHJlc29sdmVWYWx1ZXNbaV0gJiYgJC5pc0Z1bmN0aW9uKHJlc29sdmVWYWx1ZXNbaV0ucHJvbWlzZSkpIHtcclxuICAgICAgICAgIHJlc29sdmVWYWx1ZXNbaV0ucHJvbWlzZSgpXHJcbiAgICAgICAgICAgIC5kb25lKHVwZGF0ZUZuKGksIHJlc29sdmVDb250ZXh0cywgcmVzb2x2ZVZhbHVlcykpXHJcbiAgICAgICAgICAgIC5mYWlsKGRlZmVycmVkLnJlamVjdClcclxuICAgICAgICAgICAgLnByb2dyZXNzKHVwZGF0ZUZuKGksIHByb2dyZXNzQ29udGV4dHMsIHByb2dyZXNzVmFsdWVzKSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLS1yZW1haW5cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghcmVtYWluKSBkZWZlcnJlZC5yZXNvbHZlV2l0aChyZXNvbHZlQ29udGV4dHMsIHJlc29sdmVWYWx1ZXMpXHJcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpXHJcbiAgfVxyXG5cclxuICAkLkRlZmVycmVkID0gRGVmZXJyZWRcclxufSkoWmVwdG8pXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFplcHRvOyIsIlNQU2NyaXB0ID0gcmVxdWlyZShcIi4vc3BzY3JpcHRcIik7XHJcblNQU2NyaXB0Lkxpc3QgPSByZXF1aXJlKFwiLi9saXN0XCIpO1xyXG5TUFNjcmlwdC5XZWIgPSByZXF1aXJlKFwiLi93ZWJcIik7XHJcblNQU2NyaXB0LlByb2ZpbGVzID0gcmVxdWlyZShcIi4vcHJvZmlsZXNcIilcclxuU1BTY3JpcHQuaGVscGVycyA9IHJlcXVpcmUoXCIuL2hlbHBlcnNcIik7XHJcblxyXG4oZnVuY3Rpb24oc3ApIHtcclxuXHR2YXIgQmFzZURhbyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdHNlbGYud2ViID0gbmV3IHNwLldlYihzZWxmKTtcclxuXHRcdHNlbGYuc2VhcmNoID0gbmV3IHNwLlNlYXJjaChzZWxmKTtcclxuXHRcdHNlbGYucHJvZmlsZXMgPSBuZXcgc3AuUHJvZmlsZXMoc2VsZik7XHJcblx0fTtcclxuXHJcblx0QmFzZURhby5wcm90b3R5cGUuZXhlY3V0ZVJlcXVlc3QgPSBmdW5jdGlvbigpIHtcclxuXHRcdHRocm93IFwiTm90IGltcGxlbWVudGVkIGV4Y2VwdGlvblwiO1xyXG5cdH07XHJcblxyXG5cdEJhc2VEYW8ucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKHJlbGF0aXZlUXVlcnlVcmwsIGV4dGVuZGVkT3B0aW9ucywgcmF3KSB7XHJcblx0XHR2YXIgb3B0aW9ucyA9IHtcclxuXHRcdFx0dHlwZTogXCJHRVRcIlxyXG5cdFx0fTtcclxuXHJcblx0XHRpZiAoZXh0ZW5kZWRPcHRpb25zKSB7XHJcblx0XHRcdCQuZXh0ZW5kKG9wdGlvbnMsIGV4dGVuZGVkT3B0aW9ucyk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcy5leGVjdXRlUmVxdWVzdChyZWxhdGl2ZVF1ZXJ5VXJsLCBvcHRpb25zKTtcclxuXHR9O1xyXG5cclxuXHRCYXNlRGFvLnByb3RvdHlwZS5saXN0cyA9IGZ1bmN0aW9uKGxpc3RuYW1lKSB7XHJcblx0XHRpZighbGlzdG5hbWUpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZ2V0KFwiL3dlYi9saXN0c1wiKS50aGVuKHNwLmhlbHBlcnMudmFsaWRhdGVPRGF0YVYyKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBuZXcgc3AuTGlzdChsaXN0bmFtZSwgdGhpcyk7XHJcblx0fTtcclxuXHJcblx0QmFzZURhby5wcm90b3R5cGUucG9zdCA9IGZ1bmN0aW9uKHJlbGF0aXZlUG9zdFVybCwgYm9keSwgZXh0ZW5kZWRPcHRpb25zKSB7XHJcblx0XHR2YXIgc3RyQm9keSA9IEpTT04uc3RyaW5naWZ5KGJvZHkpO1xyXG5cdFx0dmFyIG9wdGlvbnMgPSB7XHJcblx0XHRcdHR5cGU6IFwiUE9TVFwiLFxyXG5cdFx0XHRkYXRhOiBzdHJCb2R5LFxyXG5cdFx0XHRjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uO29kYXRhPXZlcmJvc2VcIlxyXG5cdFx0fTtcclxuXHRcdCQuZXh0ZW5kKG9wdGlvbnMsIGV4dGVuZGVkT3B0aW9ucyk7XHJcblx0XHRyZXR1cm4gdGhpcy5leGVjdXRlUmVxdWVzdChyZWxhdGl2ZVBvc3RVcmwsIG9wdGlvbnMpO1xyXG5cdH07XHJcblxyXG5cdEJhc2VEYW8ucHJvdG90eXBlLnVwbG9hZEZpbGUgPSBmdW5jdGlvbihmb2xkZXJVcmwsIG5hbWUsIGJhc2U2NEJpbmFyeSkge1xyXG5cdFx0dmFyIHVwbG9hZFVybCA9IFwiL3dlYi9HZXRGb2xkZXJCeVNlcnZlclJlbGF0aXZlVXJsKCdcIiArIGZvbGRlclVybCArIFwiJykvRmlsZXMvQWRkKHVybD0nXCIgKyBuYW1lICsgXCInLG92ZXJ3cml0ZT10cnVlKVwiLFxyXG5cdFx0XHRvcHRpb25zID0ge1xyXG5cdFx0XHRcdGJpbmFyeVN0cmluZ1JlcXVlc3RCb2R5OiB0cnVlLFxyXG5cdFx0XHRcdHN0YXRlOiBcIlVwZGF0ZVwiXHJcblx0XHRcdH07XHJcblx0XHRyZXR1cm4gdGhpcy5wb3N0KHVwbG9hZFVybCwgYmFzZTY0QmluYXJ5LCBvcHRpb25zKTtcclxuXHR9O1xyXG5cclxuXHRzcC5CYXNlRGFvID0gQmFzZURhbztcclxufSkoU1BTY3JpcHQpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTUFNjcmlwdC5CYXNlRGFvOyIsIlNQU2NyaXB0ID0gcmVxdWlyZShcIi4vc3BzY3JpcHRcIik7XHJcblNQU2NyaXB0LmhlbHBlcnMgPSByZXF1aXJlKFwiLi9oZWxwZXJzXCIpO1xyXG5TUFNjcmlwdC5CYXNlRGFvID0gcmVxdWlyZShcIi4vYmFzZURhb1wiKTtcclxuXHJcbihmdW5jdGlvbihzcCkge1xyXG5cdHZhciBDcm9zc0RvbWFpbkRhbyA9IGZ1bmN0aW9uKGFwcFdlYlVybCwgaG9zdFVybCkge1xyXG5cdFx0dGhpcy5hcHBVcmwgPSBhcHBXZWJVcmw7XHJcblx0XHR0aGlzLmhvc3RVcmwgPSBob3N0VXJsO1xyXG5cdFx0dGhpcy5zY3JpcHRSZWFkeSA9IG5ldyAkLkRlZmVycmVkKCk7XHJcblxyXG5cdFx0Ly9Mb2FkIG9mIHVwIHRvIFJlcXVlc3RFeGVjdXRvciBqYXZhc2NyaXB0IGZyb20gdGhlIGhvc3Qgc2l0ZSBpZiBpdHMgbm90IHRoZXJlLlxyXG5cdFx0aWYgKCFTUCB8fCAhU1AuUmVxdWVzdEV4ZWN1dG9yKSB7XHJcblx0XHRcdHRoaXMuc2NyaXB0UmVhZHkgPSAkLmdldFNjcmlwdChob3N0VXJsICsgXCIvX2xheW91dHMvMTUvU1AuUmVxdWVzdEV4ZWN1dG9yLmpzXCIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0aGlzLnNjcmlwdFJlYWR5LnJlc29sdmUoKTtcdFxyXG5cdFx0XHR9LCAxKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRDcm9zc0RvbWFpbkRhby5wcm90b3R5cGUgPSBuZXcgU1BTY3JpcHQuQmFzZURhbygpO1xyXG5cclxuXHRDcm9zc0RvbWFpbkRhby5wcm90b3R5cGUuZXhlY3V0ZVJlcXVlc3QgPSBmdW5jdGlvbihob3N0UmVsYXRpdmVVcmwsIG9wdGlvbnMpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdFx0ZGVmZXJyZWQgPSBuZXcgJC5EZWZlcnJlZCgpLFxyXG5cclxuXHRcdFx0Ly9JZiBhIGNhbGxiYWNrIHdhcyBnaXZlbiBleGVjdXRlIGl0LCBwYXNzaW5nIHJlc3BvbnNlIHRoZW4gdGhlIGRlZmVycmVkXHJcblx0XHRcdC8vb3RoZXJ3aXNlIGp1c3QgcmVzb2x2ZSB0aGUgZGVmZXJyZWQuXHJcblx0XHRcdHN1Y2Nlc3NDYWxsYmFjayA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHRcdFx0dmFyIGRhdGEgPSAkLnBhcnNlSlNPTihyZXNwb25zZS5ib2R5KTtcclxuXHRcdFx0XHQvL2Egc3VjZWVzcyBjYWxsYmFjayB3YXMgcGFzc2VkIGluXHJcblx0XHRcdFx0aWYgKG9wdGlvbnMuc3VjY2Vzcykge1xyXG5cdFx0XHRcdFx0b3B0aW9ucy5zdWNjZXNzKGRhdGEsIGRlZmVycmVkKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly9ubyBzdWNjZXNzIGNhbGxiYWNrIHNvIGp1c3QgbWFrZSBzdXJlIGl0cyB2YWxpZCBPRGF0YVxyXG5cdFx0XHRcdFx0c3AuaGVscGVycy52YWxpZGF0ZU9EYXRhVjIoZGF0YSwgZGVmZXJyZWQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0ZXJyb3JDYWxsYmFjayA9IGZ1bmN0aW9uKGRhdGEsIGVycm9yQ29kZSwgZXJyb3JNZXNzYWdlKSB7XHJcblx0XHRcdFx0Ly9hbiBlcnJvciBjYWxsYmFjayB3YXMgcGFzc2VkIGluXHJcblx0XHRcdFx0aWYgKG9wdGlvbnMuZXJyb3IpIHtcclxuXHRcdFx0XHRcdG9wdGlvbnMuZXJyb3IoZGF0YSwgZXJyb3JDb2RlLCBlcnJvck1lc3NhZ2UsIGRlZmVycmVkKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly9ubyBlcnJvciBjYWxsYmFjayBzbyBqdXN0IHJlamVjdCBpdFxyXG5cdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycm9yTWVzc2FnZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdHRoaXMuc2NyaXB0UmVhZHkuZG9uZShmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly90YWNrIG9uIHRoZSBxdWVyeSBzdHJpbmcgcXVlc3Rpb24gbWFyayBpZiBub3QgdGhlcmUgYWxyZWFkeVxyXG5cdFx0XHRpZiAoaG9zdFJlbGF0aXZlVXJsLmluZGV4T2YoXCI/XCIpID09PSAtMSkge1xyXG5cdFx0XHRcdGhvc3RSZWxhdGl2ZVVybCA9IGhvc3RSZWxhdGl2ZVVybCArIFwiP1wiO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgZXhlY3V0b3IgPSBuZXcgU1AuUmVxdWVzdEV4ZWN1dG9yKHNlbGYuYXBwVXJsKSxcclxuXHRcdFx0XHRmdWxsVXJsID0gc2VsZi5hcHBVcmwgKyBcIi9fYXBpL1NQLkFwcENvbnRleHRTaXRlKEB0YXJnZXQpXCIgKyBob3N0UmVsYXRpdmVVcmwgKyBcIkB0YXJnZXQ9J1wiICsgc2VsZi5ob3N0VXJsICsgXCInXCI7XHJcblxyXG5cdFx0XHR2YXIgZXhlY3V0ZU9wdGlvbnMgPSB7XHJcblx0XHRcdFx0dXJsOiBmdWxsVXJsLFxyXG5cdFx0XHRcdHR5cGU6IFwiR0VUXCIsXHJcblx0XHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdFx0XCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uOyBvZGF0YT12ZXJib3NlXCJcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHN1Y2Nlc3M6IHN1Y2Nlc3NDYWxsYmFjayxcclxuXHRcdFx0XHRlcnJvcjogZXJyb3JDYWxsYmFja1xyXG5cdFx0XHR9O1xyXG5cdFx0XHQvL01lcmdlIHBhc3NlZCBpbiBvcHRpb25zXHJcblx0XHRcdCQuZXh0ZW5kKHRydWUsIGV4ZWN1dGVPcHRpb25zLCBvcHRpb25zKTtcclxuXHRcdFx0ZXhlY3V0b3IuZXhlY3V0ZUFzeW5jKGV4ZWN1dGVPcHRpb25zKTtcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcclxuXHR9O1xyXG5cclxuXHRzcC5Dcm9zc0RvbWFpbkRhbyA9IENyb3NzRG9tYWluRGFvO1xyXG59KShTUFNjcmlwdCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNQU2NyaXB0LkNyb3NzRG9tYWluRGFvOyIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcblxyXG5nbG9iYWwuWmVwdG8gPSByZXF1aXJlKFwiLi4vLi4vbGliL3plcHRvLmN1c3RvbVwiKTtcclxuZ2xvYmFsLiQgPSBnbG9iYWwuWmVwdG87XHJcbmdsb2JhbC5TUFNjcmlwdCA9IHJlcXVpcmUoXCIuL3Nwc2NyaXB0XCIpO1xufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG5nbG9iYWwuU1BTY3JpcHQgPSB7fTtcclxuZ2xvYmFsLlNQU2NyaXB0LlJlc3REYW8gPSByZXF1aXJlKFwiLi4vcmVzdERhb1wiKTtcclxuZ2xvYmFsLlNQU2NyaXB0LkNyb3NzRG9tYWluRGFvID0gcmVxdWlyZShcIi4uL2Nyb3NzRG9tYWluRGFvXCIpO1xyXG5nbG9iYWwuU1BTY3JpcHQucXVlcnlTdHJpbmcgPSByZXF1aXJlKFwiLi4vcXVlcnlTdHJpbmdcIik7XHJcbmdsb2JhbC5TUFNjcmlwdC5TZWFyY2ggPSByZXF1aXJlKFwiLi4vc2VhcmNoXCIpO1xyXG5nbG9iYWwuU1BTY3JpcHQudGVtcGxhdGluZyA9IHJlcXVpcmUoXCIuLi90ZW1wbGF0aW5nXCIpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGdsb2JhbC5TUFNjcmlwdDtcbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwidmFyIFNQU2NyaXB0ID0gcmVxdWlyZShcIi4vc3BzY3JpcHQuanNcIik7XHJcblxyXG4oZnVuY3Rpb24oc3ApIHtcclxuXHR2YXIgaGVscGVycyA9IHt9O1xyXG5cdGhlbHBlcnMudmFsaWRhdGVPRGF0YVYyID0gZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0dmFyIHJlc3VsdHMgPSBkYXRhO1xyXG5cdFx0aWYgKGRhdGEuZCAmJiBkYXRhLmQucmVzdWx0cyAmJiBkYXRhLmQucmVzdWx0cy5sZW5ndGggIT0gbnVsbCkge1xyXG5cdFx0XHRyZXN1bHRzID0gZGF0YS5kLnJlc3VsdHM7XHJcblx0XHR9IGVsc2UgaWYgKGRhdGEuZCkge1xyXG5cdFx0XHRyZXN1bHRzID0gZGF0YS5kO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdHM7XHJcblx0fTtcclxuXHJcblx0aGVscGVycy52YWxpZGF0ZUNyb3NzRG9tYWluT0RhdGFWMiA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcblx0XHR2YXIgZGF0YSA9ICQucGFyc2VKU09OKHJlc3BvbnNlLmJvZHkpO1xyXG5cdFx0aGVscGVycy52YWxpZGF0ZU9EYXRhVjIoZGF0YSk7XHJcblx0fTtcclxuXHJcblx0Ly8nQm9ycm93ZWQnIGZyb20gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvT3BlcmF0b3JzL0JpdHdpc2VfT3BlcmF0b3JzXHJcblx0aGVscGVycy5hcnJheUZyb21CaXRNYXNrID0gZnVuY3Rpb24gKG5NYXNrKSB7XHJcblx0XHQvLyBuTWFzayBtdXN0IGJlIGJldHdlZW4gLTIxNDc0ODM2NDggYW5kIDIxNDc0ODM2NDdcclxuXHRcdGlmICh0eXBlb2Ygbk1hc2sgPT09IFwic3RyaW5nXCIpIHtcclxuXHRcdFx0bk1hc2sgPSBwYXJzZUludChuTWFzayk7XHJcblx0XHR9XHJcblx0XHQvLyBpZiAobk1hc2sgPiAweDdmZmZmZmZmIHx8IG5NYXNrIDwgLTB4ODAwMDAwMDApIHsgXHJcblx0XHQvLyBcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJhcnJheUZyb21NYXNrIC0gb3V0IG9mIHJhbmdlXCIpOyBcclxuXHRcdC8vIH1cclxuXHRcdGZvciAodmFyIG5TaGlmdGVkID0gbk1hc2ssIGFGcm9tTWFzayA9IFtdOyBuU2hpZnRlZDsgYUZyb21NYXNrLnB1c2goQm9vbGVhbihuU2hpZnRlZCAmIDEpKSwgblNoaWZ0ZWQgPj4+PSAxKTtcclxuXHRcdHJldHVybiBhRnJvbU1hc2s7XHJcblx0fTtcclxuXHJcblx0c3AuaGVscGVycyA9IGhlbHBlcnM7XHJcbn0pKFNQU2NyaXB0KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU1BTY3JpcHQuaGVscGVyczsiLCJ2YXIgU1BTY3JpcHQgPSByZXF1aXJlKFwiLi9zcHNjcmlwdFwiKTtcclxuU1BTY3JpcHQuaGVscGVycyA9IHJlcXVpcmUoXCIuL2hlbHBlcnNcIik7XHJcblNQU2NyaXB0LnBlcm1pc3Npb25zID0gcmVxdWlyZShcIi4vcGVybWlzc2lvbnNcIik7XHJcblxyXG4oZnVuY3Rpb24oc3ApIHtcclxuXHR2YXIgYmFzZVVybCA9IG51bGw7XHJcblx0dmFyIExpc3QgPSBmdW5jdGlvbihsaXN0bmFtZSwgZGFvKSB7XHJcblx0XHR0aGlzLmxpc3RuYW1lID0gbGlzdG5hbWU7XHJcblx0XHRiYXNlVXJsID0gXCIvd2ViL2xpc3RzL2dldGJ5dGl0bGUoJ1wiICsgbGlzdG5hbWUgKyBcIicpXCI7XHJcblx0XHR0aGlzLl9kYW8gPSBkYW87XHJcblx0fTtcclxuXHJcblx0TGlzdC5wcm90b3R5cGUuZ2V0SXRlbXMgPSBmdW5jdGlvbihvZGF0YVF1ZXJ5KSB7XHJcblx0XHR2YXIgcXVlcnkgPSAob2RhdGFRdWVyeSAhPSBudWxsKSA/IFwiP1wiICsgb2RhdGFRdWVyeSA6IFwiXCI7XHJcblx0XHRyZXR1cm4gdGhpcy5fZGFvXHJcblx0XHRcdC5nZXQoYmFzZVVybCArIFwiL2l0ZW1zXCIgKyBxdWVyeSlcclxuXHRcdFx0LnRoZW4oc3AuaGVscGVycy52YWxpZGF0ZU9EYXRhVjIpO1xyXG5cdH07XHJcblxyXG5cdExpc3QucHJvdG90eXBlLmdldEl0ZW1CeUlkID0gZnVuY3Rpb24oaWQsIG9kYXRhKSB7XHJcblx0XHR2YXIgdXJsID0gYmFzZVVybCArIFwiL2l0ZW1zKFwiICsgaWQgKyBcIilcIjtcclxuXHRcdHVybCArPSAob2RhdGEgIT0gbnVsbCkgPyBcIj9cIiArIG9kYXRhIDogXCJcIjtcclxuXHRcdHJldHVybiB0aGlzLl9kYW8uZ2V0KHVybCkudGhlbihzcC5oZWxwZXJzLnZhbGlkYXRlT0RhdGFWMik7XHJcblx0fTtcclxuXHJcblx0TGlzdC5wcm90b3R5cGUuaW5mbyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2Rhby5nZXQoYmFzZVVybCkudGhlbihzcC5oZWxwZXJzLnZhbGlkYXRlT0RhdGFWMik7XHJcblx0fTtcclxuXHJcblx0TGlzdC5wcm90b3R5cGUuYWRkSXRlbSA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdHJldHVybiBzZWxmLl9kYW8uZ2V0KGJhc2VVcmwpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRpdGVtID0gJC5leHRlbmQoe1xyXG5cdFx0XHRcdFwiX19tZXRhZGF0YVwiOiB7XHJcblx0XHRcdFx0XHRcInR5cGVcIjogZGF0YS5kLkxpc3RJdGVtRW50aXR5VHlwZUZ1bGxOYW1lXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCBpdGVtKTtcclxuXHJcblx0XHRcdHZhciBjdXN0b21PcHRpb25zID0ge1xyXG5cdFx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHRcdFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvbjtvZGF0YT12ZXJib3NlXCIsXHJcblx0XHRcdFx0XHRcIlgtUmVxdWVzdERpZ2VzdFwiOiAkKFwiI19fUkVRVUVTVERJR0VTVFwiKS52YWwoKSxcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRyZXR1cm4gc2VsZi5fZGFvLnBvc3QoYmFzZVVybCArIFwiL2l0ZW1zXCIsIGl0ZW0sIGN1c3RvbU9wdGlvbnMpXHJcblx0XHRcdFx0LnRoZW4oc3AuaGVscGVycy52YWxpZGF0ZU9EYXRhVjIpO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0TGlzdC5wcm90b3R5cGUudXBkYXRlSXRlbSA9IGZ1bmN0aW9uKGl0ZW1JZCwgdXBkYXRlcykge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0cmV0dXJuIHNlbGYuZ2V0SXRlbUJ5SWQoaXRlbUlkKS50aGVuKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0dXBkYXRlcyA9ICQuZXh0ZW5kKHtcclxuXHRcdFx0XHRcIl9fbWV0YWRhdGFcIjoge1xyXG5cdFx0XHRcdFx0XCJ0eXBlXCI6IGl0ZW0uX19tZXRhZGF0YS50eXBlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCB1cGRhdGVzKTtcclxuXHJcblx0XHRcdHZhciBjdXN0b21PcHRpb25zID0ge1xyXG5cdFx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHRcdFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvbjtvZGF0YT12ZXJib3NlXCIsXHJcblx0XHRcdFx0XHRcIlgtUmVxdWVzdERpZ2VzdFwiOiAkKFwiI19fUkVRVUVTVERJR0VTVFwiKS52YWwoKSxcclxuXHRcdFx0XHRcdFwiWC1IVFRQLU1ldGhvZFwiOiBcIk1FUkdFXCIsXHJcblx0XHRcdFx0XHRcIklmLU1hdGNoXCI6IGl0ZW0uX19tZXRhZGF0YS5ldGFnXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0cmV0dXJuIHNlbGYuX2Rhby5wb3N0KGl0ZW0uX19tZXRhZGF0YS51cmksIHVwZGF0ZXMsIGN1c3RvbU9wdGlvbnMpO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHRcclxuXHRMaXN0LnByb3RvdHlwZS5kZWxldGVJdGVtID0gZnVuY3Rpb24oaXRlbUlkKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRyZXR1cm4gc2VsZi5nZXRJdGVtQnlJZChpdGVtSWQpLnRoZW4oZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHR2YXIgY3VzdG9tT3B0aW9ucyA9IHtcclxuXHRcdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0XHRcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb247b2RhdGE9dmVyYm9zZVwiLFxyXG5cdFx0XHRcdFx0XCJYLVJlcXVlc3REaWdlc3RcIjogJChcIiNfX1JFUVVFU1RESUdFU1RcIikudmFsKCksXHJcblx0XHRcdFx0XHRcIlgtSFRUUC1NZXRob2RcIjogXCJERUxFVEVcIixcclxuXHRcdFx0XHRcdFwiSWYtTWF0Y2hcIjogaXRlbS5fX21ldGFkYXRhLmV0YWdcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdHJldHVybiBzZWxmLl9kYW8ucG9zdChpdGVtLl9fbWV0YWRhdGEudXJpLCBcIlwiLCBjdXN0b21PcHRpb25zKTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdExpc3QucHJvdG90eXBlLmZpbmRJdGVtcyA9IGZ1bmN0aW9uKGtleSwgdmFsdWUsIGV4dHJhT0RhdGEpIHtcclxuXHRcdC8vaWYgaXRzIGEgc3RyaW5nLCB3cmFwIGluIHNpbmdsZSBxdW90ZXNcclxuXHRcdHZhciBmaWx0ZXJWYWx1ZSA9IHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiA/IFwiJ1wiICsgdmFsdWUgKyBcIidcIiA6IHZhbHVlO1xyXG5cdFx0dmFyIG9kYXRhID0gXCIkZmlsdGVyPVwiICsga2V5ICsgXCIgZXEgXCIgKyBmaWx0ZXJWYWx1ZTtcclxuXHRcdG9kYXRhICs9IChleHRyYU9EYXRhICE9IG51bGwpID8gXCImXCIgKyBleHRyYU9EYXRhIDogXCJcIjtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5nZXRJdGVtcyhvZGF0YSk7XHJcblx0fTtcclxuXHJcblx0TGlzdC5wcm90b3R5cGUuZmluZEl0ZW0gPSBmdW5jdGlvbihrZXksIHZhbHVlLCBvZGF0YSkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZmluZEl0ZW1zKGtleSwgdmFsdWUsIG9kYXRhKS50aGVuKGZ1bmN0aW9uKGl0ZW1zKSB7XHJcblx0XHRcdGlmIChpdGVtcyAmJiBpdGVtcy5sZW5ndGggJiYgaXRlbXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdHJldHVybiBpdGVtc1swXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdExpc3QucHJvdG90eXBlLnBlcm1pc3Npb25zID0gZnVuY3Rpb24oZW1haWwpIHtcclxuXHRcdHJldHVybiBzcC5wZXJtaXNzaW9ucyhiYXNlVXJsLCB0aGlzLl9kYW8sIGVtYWlsKTtcclxuXHR9O1xyXG5cclxuXHRzcC5MaXN0ID0gTGlzdDtcclxufSkoU1BTY3JpcHQpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTUFNjcmlwdC5MaXN0OyIsInZhciBTUFNjcmlwdCA9IHJlcXVpcmUoXCIuL3Nwc2NyaXB0XCIpO1xyXG5TUFNjcmlwdC5oZWxwZXJzID0gcmVxdWlyZShcIi4vaGVscGVyc1wiKTtcclxuXHJcbihmdW5jdGlvbihzcCkge1xyXG5cdHZhciB0cmFuc2Zvcm1zID0ge1xyXG5cdFx0cm9sZUFzc2lnbm1lbnQ6IGZ1bmN0aW9uKHJhdykge1xyXG5cdFx0XHR2YXIgcHJpdiA9IHtcclxuXHRcdFx0XHRtZW1iZXI6IHtcclxuXHRcdFx0XHRcdGxvZ2luOiByYXcuTWVtYmVyLkxvZ2luTmFtZSxcclxuXHRcdFx0XHRcdG5hbWU6IHJhdy5NZW1iZXIuVGl0bGUsXHJcblx0XHRcdFx0XHRpZDogcmF3Lk1lbWJlci5JZFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0cHJpdi5yb2xlcyA9IHJhdy5Sb2xlRGVmaW5pdGlvbkJpbmRpbmdzLnJlc3VsdHMubWFwKGZ1bmN0aW9uKHJvbGVEZWYpe1xyXG5cdFx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0XHRuYW1lOiByb2xlRGVmLk5hbWUsXHJcblx0XHRcdFx0XHRkZXNjcmlwdGlvbjogcm9sZURlZi5EZXNjcmlwdGlvbixcclxuXHRcdFx0XHRcdGJhc2VQZXJtaXNzaW9uczogcGVybWlzc2lvbk1hc2tUb1N0cmluZ3Mocm9sZURlZi5CYXNlUGVybWlzc2lvbnMuTG93LCByb2xlRGVmLkJhc2VQZXJtaXNzaW9ucy5IaWdoKVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gcHJpdjtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHR2YXIgcGVybWlzc2lvbk1hc2tUb1N0cmluZ3MgPSBmdW5jdGlvbihsb3dNYXNrLCBoaWdoTWFzaykge1xyXG5cdFx0dmFyIGJhc2VQZXJtaXNzaW9ucyA9IFtdO1xyXG5cdFx0c3BCYXNlUGVybWlzc2lvbnMuZm9yRWFjaChmdW5jdGlvbihiYXNlUGVybWlzc2lvbil7XHJcblx0XHRcdGlmICgoYmFzZVBlcm1pc3Npb24ubG93ICYgbG93TWFzaykgPiAwIHx8IChiYXNlUGVybWlzc2lvbi5oaWdoICYgaGlnaE1hc2spID4gMCkge1xyXG5cdFx0XHRcdGJhc2VQZXJtaXNzaW9ucy5wdXNoKGJhc2VQZXJtaXNzaW9uLm5hbWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBiYXNlUGVybWlzc2lvbnM7XHJcblx0fTtcclxuXHJcblx0dmFyIHBlcm1pc3Npb25zID0gZnVuY3Rpb24oYmFzZVVybCwgZGFvLCBlbWFpbCkge1xyXG5cdFx0aWYoIWVtYWlsKSB7XHJcblx0XHRcdHZhciB1cmwgPSBiYXNlVXJsICsgXCIvUm9sZUFzc2lnbm1lbnRzPyRleHBhbmQ9TWVtYmVyLFJvbGVEZWZpbml0aW9uQmluZGluZ3NcIjtcclxuXHRcdFx0cmV0dXJuIGRhby5nZXQodXJsKVxyXG5cdFx0XHRcdC50aGVuKHNwLmhlbHBlcnMudmFsaWRhdGVPRGF0YVYyKVxyXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHMubWFwKHRyYW5zZm9ybXMucm9sZUFzc2lnbm1lbnQpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0Ly9BbiBlbWFpbCB3YXMgcGFzc2VkIHNvIGNoZWNrIHByaXZzIG9uIHRoYXQgc3BlY2lmaWMgdXNlclxyXG5cdFx0dmFyIGNoZWNrUHJpdnMgPSBmdW5jdGlvbih1c2VyKSB7XHJcblx0XHRcdHZhciBsb2dpbiA9IGVuY29kZVVSSUNvbXBvbmVudCh1c2VyLkxvZ2luTmFtZSk7XHJcblx0XHRcdHZhciB1cmwgPSBiYXNlVXJsICsgXCIvZ2V0dXNlcmVmZmVjdGl2ZXBlcm1pc3Npb25zKEB2KT9Adj0nXCIgKyBsb2dpbiArIFwiJ1wiO1xyXG5cdFx0XHRyZXR1cm4gZGFvLmdldCh1cmwpLnRoZW4oc3AuaGVscGVycy52YWxpZGF0ZU9EYXRhVjIpO1xyXG5cdFx0fTtcclxuXHRcdHJldHVybiBkYW8ud2ViLmdldFVzZXIoZW1haWwpXHJcblx0XHRcdC50aGVuKGNoZWNrUHJpdnMpXHJcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHByaXZzKSB7XHJcblx0XHRcdFx0cmV0dXJuIHBlcm1pc3Npb25NYXNrVG9TdHJpbmdzKHByaXZzLkdldFVzZXJFZmZlY3RpdmVQZXJtaXNzaW9ucy5Mb3csIHByaXZzLkdldFVzZXJFZmZlY3RpdmVQZXJtaXNzaW9ucy5IaWdoKTtcclxuXHRcdFx0fSk7XHJcblx0fTtcclxuXHJcblx0Ly8gU2NyYXBlZCBpdCBmcm9tIFNQLlBlcm1pc3Npb25LaW5kXHJcblx0Ly8gdmFyIGJhc2VQZXJtaXNzaW9ucyA9IFtdO1xyXG5cdC8vIE9iamVjdC5rZXlzKFNQLlBlcm1pc3Npb25LaW5kKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkgeyBcclxuXHQvLyBcdHZhciBwZXJtID0gbmV3IFNQLkJhc2VQZXJtaXNzaW9ucygpO1xyXG5cdC8vICAgICBwZXJtLnNldChTUC5QZXJtaXNzaW9uS2luZFtrZXldKTtcclxuXHQvLyAgICAgdmFyIHBlcm1pc2lzb24gPSB7XHJcblx0Ly8gICAgIFx0bmFtZToga2V5LFxyXG5cdC8vICAgICBcdGxvdzogcGVybS4kQV8xLFxyXG5cdC8vICAgICBcdGhpZ2g6IHBlcm0uJDlfMVxyXG5cdC8vICAgICB9O1xyXG5cdC8vICAgICBiYXNlUGVybWlzc2lvbnMucHVzaChwZXJtaXNpc29uKTtcclxuXHQvLyB9KTtcclxuXHR2YXIgc3BCYXNlUGVybWlzc2lvbnMgPSBbICBcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwiZW1wdHlNYXNrXCIsXHJcbiAgICAgIFwibG93XCI6MCxcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJ2aWV3TGlzdEl0ZW1zXCIsXHJcbiAgICAgIFwibG93XCI6MSxcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJhZGRMaXN0SXRlbXNcIixcclxuICAgICAgXCJsb3dcIjoyLFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImVkaXRMaXN0SXRlbXNcIixcclxuICAgICAgXCJsb3dcIjo0LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImRlbGV0ZUxpc3RJdGVtc1wiLFxyXG4gICAgICBcImxvd1wiOjgsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwiYXBwcm92ZUl0ZW1zXCIsXHJcbiAgICAgIFwibG93XCI6MTYsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwib3Blbkl0ZW1zXCIsXHJcbiAgICAgIFwibG93XCI6MzIsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwidmlld1ZlcnNpb25zXCIsXHJcbiAgICAgIFwibG93XCI6NjQsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwiZGVsZXRlVmVyc2lvbnNcIixcclxuICAgICAgXCJsb3dcIjoxMjgsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwiY2FuY2VsQ2hlY2tvdXRcIixcclxuICAgICAgXCJsb3dcIjoyNTYsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwibWFuYWdlUGVyc29uYWxWaWV3c1wiLFxyXG4gICAgICBcImxvd1wiOjUxMixcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJtYW5hZ2VMaXN0c1wiLFxyXG4gICAgICBcImxvd1wiOjIwNDgsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwidmlld0Zvcm1QYWdlc1wiLFxyXG4gICAgICBcImxvd1wiOjQwOTYsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwiYW5vbnltb3VzU2VhcmNoQWNjZXNzTGlzdFwiLFxyXG4gICAgICBcImxvd1wiOjgxOTIsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwib3BlblwiLFxyXG4gICAgICBcImxvd1wiOjY1NTM2LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcInZpZXdQYWdlc1wiLFxyXG4gICAgICBcImxvd1wiOjEzMTA3MixcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJhZGRBbmRDdXN0b21pemVQYWdlc1wiLFxyXG4gICAgICBcImxvd1wiOjI2MjE0NCxcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJhcHBseVRoZW1lQW5kQm9yZGVyXCIsXHJcbiAgICAgIFwibG93XCI6NTI0Mjg4LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImFwcGx5U3R5bGVTaGVldHNcIixcclxuICAgICAgXCJsb3dcIjoxMDQ4NTc2LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcInZpZXdVc2FnZURhdGFcIixcclxuICAgICAgXCJsb3dcIjoyMDk3MTUyLFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImNyZWF0ZVNTQ1NpdGVcIixcclxuICAgICAgXCJsb3dcIjo0MTk0MzA0LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcIm1hbmFnZVN1YndlYnNcIixcclxuICAgICAgXCJsb3dcIjo4Mzg4NjA4LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImNyZWF0ZUdyb3Vwc1wiLFxyXG4gICAgICBcImxvd1wiOjE2Nzc3MjE2LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcIm1hbmFnZVBlcm1pc3Npb25zXCIsXHJcbiAgICAgIFwibG93XCI6MzM1NTQ0MzIsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwiYnJvd3NlRGlyZWN0b3JpZXNcIixcclxuICAgICAgXCJsb3dcIjo2NzEwODg2NCxcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJicm93c2VVc2VySW5mb1wiLFxyXG4gICAgICBcImxvd1wiOjEzNDIxNzcyOCxcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJhZGREZWxQcml2YXRlV2ViUGFydHNcIixcclxuICAgICAgXCJsb3dcIjoyNjg0MzU0NTYsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwidXBkYXRlUGVyc29uYWxXZWJQYXJ0c1wiLFxyXG4gICAgICBcImxvd1wiOjUzNjg3MDkxMixcclxuICAgICAgXCJoaWdoXCI6MFxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJtYW5hZ2VXZWJcIixcclxuICAgICAgXCJsb3dcIjoxMDczNzQxODI0LFxyXG4gICAgICBcImhpZ2hcIjowXHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImFub255bW91c1NlYXJjaEFjY2Vzc1dlYkxpc3RzXCIsXHJcbiAgICAgIFwibG93XCI6LTIxNDc0ODM2NDgsXHJcbiAgICAgIFwiaGlnaFwiOjBcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwidXNlQ2xpZW50SW50ZWdyYXRpb25cIixcclxuICAgICAgXCJsb3dcIjowLFxyXG4gICAgICBcImhpZ2hcIjoxNlxyXG4gICB9LFxyXG4gICB7ICBcclxuICAgICAgXCJuYW1lXCI6XCJ1c2VSZW1vdGVBUElzXCIsXHJcbiAgICAgIFwibG93XCI6MCxcclxuICAgICAgXCJoaWdoXCI6MzJcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwibWFuYWdlQWxlcnRzXCIsXHJcbiAgICAgIFwibG93XCI6MCxcclxuICAgICAgXCJoaWdoXCI6NjRcclxuICAgfSxcclxuICAgeyAgXHJcbiAgICAgIFwibmFtZVwiOlwiY3JlYXRlQWxlcnRzXCIsXHJcbiAgICAgIFwibG93XCI6MCxcclxuICAgICAgXCJoaWdoXCI6MTI4XHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImVkaXRNeVVzZXJJbmZvXCIsXHJcbiAgICAgIFwibG93XCI6MCxcclxuICAgICAgXCJoaWdoXCI6MjU2XHJcbiAgIH0sXHJcbiAgIHsgIFxyXG4gICAgICBcIm5hbWVcIjpcImVudW1lcmF0ZVBlcm1pc3Npb25zXCIsXHJcbiAgICAgIFwibG93XCI6MCxcclxuICAgICAgXCJoaWdoXCI6MTA3Mzc0MTgyNFxyXG4gICB9XHJcbl07XHJcblxyXG5cdHNwLnBlcm1pc3Npb25zID0gcGVybWlzc2lvbnM7XHJcbn0pKFNQU2NyaXB0KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU1BTY3JpcHQucGVybWlzc2lvbnM7IiwidmFyIFNQU2NyaXB0ID0gcmVxdWlyZTsoXCIuL3Nwc2NyaXB0XCIpO1xyXG5TUFNjcmlwdC5oZWxwZXJzID0gcmVxdWlyZShcIi4vaGVscGVyc1wiKTtcclxuXHJcbihmdW5jdGlvbihzcCkge1xyXG5cdHZhciBQcm9maWxlcyA9IGZ1bmN0aW9uKGRhbykge1xyXG5cdFx0dGhpcy5fZGFvID0gZGFvO1xyXG5cdFx0dGhpcy5iYXNlVXJsID0gXCIvU1AuVXNlclByb2ZpbGVzLlBlb3BsZU1hbmFnZXJcIjtcclxuXHR9O1xyXG5cclxuXHR2YXIgdHJhbnNmb3JtUGVyc29uUHJvcGVydGllcyA9IGZ1bmN0aW9uKHByb2ZpbGUpIHtcclxuXHRcdHByb2ZpbGUuVXNlclByb2ZpbGVQcm9wZXJ0aWVzLnJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbihrZXl2YWx1ZSl7XHJcblx0XHRcdHByb2ZpbGVba2V5dmFsdWUuS2V5XSA9IGtleXZhbHVlLlZhbHVlO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gcHJvZmlsZTtcclxuXHR9O1xyXG5cclxuXHRQcm9maWxlcy5wcm90b3R5cGUuY3VycmVudCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHVybCA9IHRoaXMuYmFzZVVybCArIFwiL0dldE15UHJvcGVydGllc1wiO1xyXG5cdFx0cmV0dXJuIHRoaXMuX2Rhby5nZXQodXJsKVxyXG5cdFx0XHRcdFx0LnRoZW4oc3AuaGVscGVycy52YWxpZGF0ZU9EYXRhVjIpXHJcblx0XHRcdFx0XHQudGhlbih0cmFuc2Zvcm1QZXJzb25Qcm9wZXJ0aWVzKTtcclxuXHR9O1xyXG5cclxuXHRQcm9maWxlcy5wcm90b3R5cGUuZ2V0UHJvZmlsZSA9IGZ1bmN0aW9uKHVzZXIpIHtcclxuXHRcdHZhciBsb2dpbiA9IGVuY29kZVVSSUNvbXBvbmVudCh1c2VyLkxvZ2luTmFtZSk7XHJcblx0XHR2YXIgdXJsID0gdGhpcy5iYXNlVXJsICsgXCIvR2V0UHJvcGVydGllc0ZvcihhY2NvdW50TmFtZT1Adik/QHY9J1wiICsgbG9naW4gKyBcIidcIjtcclxuXHRcdHJldHVybiB0aGlzLl9kYW8uZ2V0KHVybClcclxuXHRcdFx0LnRoZW4oc3AuaGVscGVycy52YWxpZGF0ZU9EYXRhVjIpXHJcblx0XHRcdC50aGVuKHRyYW5zZm9ybVBlcnNvblByb3BlcnRpZXMpO1xyXG5cdH07XHJcblxyXG5cdFByb2ZpbGVzLnByb3RvdHlwZS5nZXRCeUVtYWlsID0gZnVuY3Rpb24oZW1haWwpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdHJldHVybiBzZWxmLl9kYW8ud2ViLmdldFVzZXIoZW1haWwpXHJcblx0XHRcdC50aGVuKGZ1bmN0aW9uKHVzZXIpIHtcclxuXHRcdFx0XHRyZXR1cm4gc2VsZi5nZXRQcm9maWxlKHVzZXIpO1xyXG5cdFx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHRzcC5Qcm9maWxlcyA9IFByb2ZpbGVzO1xyXG59KShTUFNjcmlwdCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNQU2NyaXB0LlByb2ZpbGVzOyIsIlNQU2NyaXB0ID0gcmVxdWlyZShcIi4vc3BzY3JpcHRcIik7XHJcblxyXG4oZnVuY3Rpb24oc3ApIHtcclxuXHRzcC5xdWVyeVN0cmluZyA9IHtcclxuXHRcdF9xdWVyeVN0cmluZzoge30sXHJcblx0XHRfcHJvY2Vzc2VkOiBmYWxzZSxcclxuXHJcblx0XHQvL3ByaXZhdGUgbWV0aG9kIChvbmx5IHJ1biBvbiB0aGUgZmlyc3QgJ0dldFZhbHVlJyByZXF1ZXN0KVxyXG5cdFx0X3Byb2Nlc3NRdWVyeVN0cmluZzogZnVuY3Rpb24odGV4dCkge1xyXG5cdFx0XHR2YXIgcXMgPSB0ZXh0IHx8IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyaW5nKDEpLFxyXG5cdFx0XHRcdGtleVZhbHVlLFxyXG5cdFx0XHRcdGtleVZhbHVlcyA9IHFzLnNwbGl0KCcmJyk7XHJcblxyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleVZhbHVlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGtleVZhbHVlID0ga2V5VmFsdWVzW2ldLnNwbGl0KCc9Jyk7XHJcblx0XHRcdFx0Ly90aGlzLl9xdWVyeVN0cmluZy5wdXNoKGtleVZhbHVlWzBdKTtcclxuXHRcdFx0XHR0aGlzLl9xdWVyeVN0cmluZ1trZXlWYWx1ZVswXV0gPSBkZWNvZGVVUklDb21wb25lbnQoa2V5VmFsdWVbMV0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuX3Byb2Nlc3NlZCA9IHRydWU7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vUHVibGljIE1ldGhvZHNcclxuXHRcdGNvbnRhaW5zOiBmdW5jdGlvbihrZXksIHRleHQpIHtcclxuXHRcdFx0aWYgKCF0aGlzLl9wcm9jZXNzZWQpIHtcclxuXHRcdFx0XHR0aGlzLl9wcm9jZXNzUXVlcnlTdHJpbmcodGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRoaXMuX3F1ZXJ5U3RyaW5nLmhhc093blByb3BlcnR5KGtleSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGdldFZhbHVlOiBmdW5jdGlvbihrZXksIHRleHQpIHtcclxuXHRcdFx0aWYgKCF0aGlzLl9wcm9jZXNzZWQpIHtcclxuXHRcdFx0XHR0aGlzLl9wcm9jZXNzUXVlcnlTdHJpbmcodGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRoaXMuY29udGFpbnMoa2V5KSA/IHRoaXMuX3F1ZXJ5U3RyaW5nW2tleV0gOiBcIlwiO1xyXG5cdFx0fSxcclxuXHJcblx0XHRnZXRBbGw6IGZ1bmN0aW9uKHRleHQpIHtcclxuXHRcdFx0aWYgKCF0aGlzLl9wcm9jZXNzZWQpIHtcclxuXHRcdFx0XHR0aGlzLl9wcm9jZXNzUXVlcnlTdHJpbmcodGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRoaXMuX3F1ZXJ5U3RyaW5nO1xyXG5cdFx0fSxcclxuXHJcblx0XHRvYmplY3RUb1F1ZXJ5U3RyaW5nOiBmdW5jdGlvbihvYmosIHF1b3RlVmFsdWVzKSB7XHJcblx0XHRcdHZhciBwYXJhbXMgPSBbXTtcclxuXHRcdFx0Zm9yICh2YXIga2V5IGluIG9iaikge1xyXG5cdFx0XHRcdHZhbHVlID0gb2JqW2tleV07XHJcblx0XHRcdFx0aWYgKHZhbHVlICE9PSBudWxsKSB7XHJcblx0XHRcdFx0XHRpZiAocXVvdGVWYWx1ZXMpIHtcclxuXHRcdFx0XHRcdFx0cGFyYW1zLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj0nXCIgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpICsgXCInXCIpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cGFyYW1zLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHBhcmFtcy5qb2luKFwiJlwiKTtcclxuXHRcdH1cclxuXHR9O1xyXG59KShTUFNjcmlwdCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNQU2NyaXB0LnF1ZXJ5U3RyaW5nOyIsInZhciBTUFNjcmlwdCA9IHJlcXVpcmUoXCIuL3Nwc2NyaXB0XCIpO1xyXG5TUFNjcmlwdC5CYXNlRGFvID0gcmVxdWlyZShcIi4vYmFzZURhb1wiKTtcclxuU1BTY3JpcHQuU2VhcmNoID0gcmVxdWlyZShcIi4vc2VhcmNoXCIpO1xyXG5cclxuKGZ1bmN0aW9uKHNwKSB7XHJcblx0dmFyIFJlc3REYW8gPSBmdW5jdGlvbih1cmwpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdHNwLkJhc2VEYW8uY2FsbCh0aGlzKTtcclxuXHRcdHRoaXMud2ViVXJsID0gdXJsO1xyXG5cdH07XHJcblxyXG5cdFJlc3REYW8ucHJvdG90eXBlID0gbmV3IHNwLkJhc2VEYW8oKTtcclxuXHJcblx0UmVzdERhby5wcm90b3R5cGUuZXhlY3V0ZVJlcXVlc3QgPSBmdW5jdGlvbih1cmwsIG9wdGlvbnMpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdFx0ZnVsbFVybCA9ICgvXmh0dHAvaSkudGVzdCh1cmwpID8gdXJsIDogdGhpcy53ZWJVcmwgKyBcIi9fYXBpXCIgKyB1cmwsXHJcblx0XHRcdGV4ZWN1dGVPcHRpb25zID0ge1xyXG5cdFx0XHRcdHVybDogZnVsbFVybCxcclxuXHRcdFx0XHR0eXBlOiBcIkdFVFwiLFxyXG5cdFx0XHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XHRcdFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvbjsgb2RhdGE9dmVyYm9zZVwiXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdCQuZXh0ZW5kKGV4ZWN1dGVPcHRpb25zLCBvcHRpb25zKTtcclxuXHRcdHJldHVybiAkLmFqYXgoZXhlY3V0ZU9wdGlvbnMpO1xyXG5cdH07XHJcblxyXG5cdHNwLlJlc3REYW8gPSBSZXN0RGFvO1xyXG59KShTUFNjcmlwdCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNQU2NyaXB0LlJlc3REYW87IiwiU1BTY3JpcHQgPSByZXF1aXJlKFwiLi9zcHNjcmlwdFwiKTtcclxuU1BTY3JpcHQuUmVzdERhbyA9IHJlcXVpcmUoXCIuL3Jlc3REYW9cIik7XHJcblNQU2NyaXB0LnF1ZXJ5U3RyaW5nID0gcmVxdWlyZSgnLi9xdWVyeVN0cmluZycpO1xyXG5cclxuKGZ1bmN0aW9uKHNwKSB7XHJcblx0dmFyIFNlYXJjaCA9IGZ1bmN0aW9uKHVybE9yRGFvKSB7XHJcblx0XHRpZiAodHlwZW9mIHVybE9yRGFvID09PSBcInN0cmluZ1wiKSB7XHJcblx0XHRcdHRoaXMuZGFvID0gbmV3IHNwLlJlc3REYW8odXJsT3JEYW8pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5kYW8gPSB1cmxPckRhbztcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRTZWFyY2guUXVlcnlPcHRpb25zID0gZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNvdXJjZWlkID0gbnVsbDtcclxuXHRcdHRoaXMuc3RhcnRyb3cgPSBudWxsO1xyXG5cdFx0dGhpcy5yb3dsaW1pdCA9IDMwO1xyXG5cdFx0dGhpcy5zZWxlY3RlZHByb3BlcnRpZXMgPSBudWxsO1xyXG5cdFx0dGhpcy5yZWZpbmVycyA9IG51bGw7XHJcblx0XHR0aGlzLnJlZmluZW1lbnRmaWx0ZXJzID0gbnVsbDtcclxuXHRcdHRoaXMuaGlkZGVuY29uc3RyYWludHMgPSBudWxsO1xyXG5cdFx0dGhpcy5zb3J0bGlzdCA9IG51bGw7XHJcblx0fTtcclxuXHJcblx0dmFyIGNvbnZlcnRSb3dzVG9PYmplY3RzID0gZnVuY3Rpb24oaXRlbVJvd3MpIHtcclxuXHRcdHZhciBpdGVtcyA9IFtdO1xyXG5cclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbVJvd3MubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIHJvdyA9IGl0ZW1Sb3dzW2ldLFxyXG5cdFx0XHRcdGl0ZW0gPSB7fTtcclxuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCByb3cuQ2VsbHMucmVzdWx0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdGl0ZW1bcm93LkNlbGxzLnJlc3VsdHNbal0uS2V5XSA9IHJvdy5DZWxscy5yZXN1bHRzW2pdLlZhbHVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpdGVtcy5wdXNoKGl0ZW0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBpdGVtcztcclxuXHR9O1xyXG5cclxuXHQvL3NlYWxlZCBjbGFzcyB1c2VkIHRvIGZvcm1hdCByZXN1bHRzXHJcblx0dmFyIFNlYXJjaFJlc3VsdHMgPSBmdW5jdGlvbihxdWVyeVJlc3BvbnNlKSB7XHJcblx0XHR0aGlzLmVsYXBzZWRUaW1lID0gcXVlcnlSZXNwb25zZS5FbGFwc2VkVGltZTtcclxuXHRcdHRoaXMuc3VnZ2VzdGlvbiA9IHF1ZXJ5UmVzcG9uc2UuU3BlbGxpbmdTdWdnZXN0aW9uO1xyXG5cdFx0dGhpcy5yZXN1bHRzQ291bnQgPSBxdWVyeVJlc3BvbnNlLlByaW1hcnlRdWVyeVJlc3VsdC5SZWxldmFudFJlc3VsdHMuUm93Q291bnQ7XHJcblx0XHR0aGlzLnRvdGFsUmVzdWx0cyA9IHF1ZXJ5UmVzcG9uc2UuUHJpbWFyeVF1ZXJ5UmVzdWx0LlJlbGV2YW50UmVzdWx0cy5Ub3RhbFJvd3M7XHJcblx0XHR0aGlzLnRvdGFsUmVzdWx0c0luY2x1ZGluZ0R1cGxpY2F0ZXMgPSBxdWVyeVJlc3BvbnNlLlByaW1hcnlRdWVyeVJlc3VsdC5SZWxldmFudFJlc3VsdHMuVG90YWxSb3dzSW5jbHVkaW5nRHVwbGljYXRlcztcclxuXHRcdHRoaXMuaXRlbXMgPSBjb252ZXJ0Um93c1RvT2JqZWN0cyhxdWVyeVJlc3BvbnNlLlByaW1hcnlRdWVyeVJlc3VsdC5SZWxldmFudFJlc3VsdHMuVGFibGUuUm93cy5yZXN1bHRzKTtcclxuXHR9O1xyXG5cclxuXHRTZWFyY2gucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24ocXVlcnlUZXh0LCBxdWVyeU9wdGlvbnMpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdFx0b3B0aW9uc1F1ZXJ5U3RyaW5nID0gcXVlcnlPcHRpb25zICE9IG51bGwgPyBcIiZcIiArIHNwLnF1ZXJ5U3RyaW5nLm9iamVjdFRvUXVlcnlTdHJpbmcocXVlcnlPcHRpb25zLCB0cnVlKSA6IFwiXCIsXHJcblx0XHRcdGFzeW5jUmVxdWVzdCA9IG5ldyAkLkRlZmVycmVkKCk7XHJcblxyXG5cdFx0dmFyIHVybCA9IFwiL3NlYXJjaC9xdWVyeT9xdWVyeXRleHQ9J1wiICsgcXVlcnlUZXh0ICsgXCInXCIgKyBvcHRpb25zUXVlcnlTdHJpbmc7XHJcblx0XHR2YXIgZ2V0UmVxdWVzdCA9IHNlbGYuZGFvLmdldCh1cmwpO1xyXG5cclxuXHRcdGdldFJlcXVlc3QuZG9uZShmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdGlmIChkYXRhLmQgJiYgZGF0YS5kLnF1ZXJ5KSB7XHJcblx0XHRcdFx0dmFyIHJlc3VsdHMgPSBuZXcgU2VhcmNoUmVzdWx0cyhkYXRhLmQucXVlcnkpO1xyXG5cdFx0XHRcdGFzeW5jUmVxdWVzdC5yZXNvbHZlKHJlc3VsdHMpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFzeW5jUmVxdWVzdC5yZWplY3QoZGF0YSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBhc3luY1JlcXVlc3QucHJvbWlzZSgpO1xyXG5cdH07XHJcblxyXG5cdFNlYXJjaC5wcm90b3R5cGUucGVvcGxlID0gZnVuY3Rpb24ocXVlcnlUZXh0LCBxdWVyeU9wdGlvbnMpIHtcclxuXHRcdHZhciBvcHRpb25zID0gcXVlcnlPcHRpb25zIHx8IHt9O1xyXG5cdFx0b3B0aW9ucy5zb3VyY2VpZCA9ICAnYjA5YTc5OTAtMDVlYS00YWY5LTgxZWYtZWRmYWIxNmM0ZTMxJztcclxuXHRcdHJldHVybiB0aGlzLnF1ZXJ5KHF1ZXJ5VGV4dCwgb3B0aW9ucyk7XHJcblx0fTtcclxuXHJcblx0c3AuU2VhcmNoID0gU2VhcmNoO1xyXG5cclxufSkoU1BTY3JpcHQpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTUFNjcmlwdC5TZWFyY2g7IiwibW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJTUFNjcmlwdCA9IHJlcXVpcmUoXCIuL3Nwc2NyaXB0XCIpO1xyXG5cclxuKGZ1bmN0aW9uKHNwKSB7XHJcblx0c3AudGVtcGxhdGluZyA9IHtcclxuXHJcblx0XHRQbGFjZWhvbGRlcjogZnVuY3Rpb24ocmF3KSB7XHJcblx0XHRcdHRoaXMucmF3ID0gcmF3O1xyXG5cdFx0XHR0aGlzLmZ1bGxQcm9wZXJ0eSA9IHJhdy5zbGljZSgyLCByYXcubGVuZ3RoIC0gMik7XHJcblx0XHR9LFxyXG5cclxuXHRcdGdldFBsYWNlSG9sZGVyczogZnVuY3Rpb24odGVtcGxhdGUsIHJlZ2V4cCkge1xyXG5cdFx0XHR2YXIgcmVnRXhwUGF0dGVybiA9IHJlZ2V4cCB8fCAvXFx7XFx7W15cXH1dK1xcfVxcfT8vZztcclxuXHRcdFx0cmV0dXJuIHRlbXBsYXRlLm1hdGNoKHJlZ0V4cFBhdHRlcm4pO1xyXG5cdFx0fSxcclxuXHJcblx0XHRnZXRPYmplY3RWYWx1ZTogZnVuY3Rpb24ob2JqLCBmdWxsUHJvcGVydHkpIHtcclxuXHRcdFx0dmFyIHZhbHVlID0gb2JqLFxyXG5cdFx0XHRcdHByb3BlcnR5Q2hhaW4gPSBmdWxsUHJvcGVydHkuc3BsaXQoJy4nKTtcclxuXHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydHlDaGFpbi5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdHZhciBwcm9wZXJ0eSA9IHByb3BlcnR5Q2hhaW5baV07XHJcblx0XHRcdFx0dmFsdWUgPSB2YWx1ZVtwcm9wZXJ0eV0gIT0gbnVsbCA/IHZhbHVlW3Byb3BlcnR5XSA6IFwiTm90IEZvdW5kOiBcIiArIGZ1bGxQcm9wZXJ0eTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYoZnVsbFByb3BlcnR5ID09PSBcIl9cIikge1xyXG5cdFx0XHRcdHZhbHVlID0gb2JqO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikgJiYgdmFsdWUuaW5kZXhPZihcIi9EYXRlKFwiKSAhPT0gLTEpIHtcclxuXHRcdFx0XHR2YXIgZGF0ZVZhbHVlID0gdmFsdWUuVVRDSnNvblRvRGF0ZSgpO1xyXG5cdFx0XHRcdHZhbHVlID0gZGF0ZVZhbHVlLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHR9LFxyXG5cclxuXHRcdHBvcHVsYXRlVGVtcGxhdGU6IGZ1bmN0aW9uKHRlbXBsYXRlLCBpdGVtLCByZWdleHApIHtcclxuXHRcdFx0dmFyIHBsYWNlaG9sZGVycyA9IHRoaXMuZ2V0UGxhY2VIb2xkZXJzKHRlbXBsYXRlLCByZWdleHApIHx8IFtdLFxyXG5cdFx0XHRcdGl0ZW1IdG1sID0gdGVtcGxhdGU7XHJcblxyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHBsYWNlaG9sZGVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdHZhciBwbGFjZWhvbGRlciA9IG5ldyB0aGlzLlBsYWNlaG9sZGVyKHBsYWNlaG9sZGVyc1tpXSk7XHJcblx0XHRcdFx0cGxhY2Vob2xkZXIudmFsID0gdGhpcy5nZXRPYmplY3RWYWx1ZShpdGVtLCBwbGFjZWhvbGRlci5mdWxsUHJvcGVydHkpO1xyXG5cdFx0XHRcdHZhciBwYXR0ZXJuID0gcGxhY2Vob2xkZXIucmF3LnJlcGxhY2UoXCJbXCIsIFwiXFxcXFtcIikucmVwbGFjZShcIl1cIiwgXCJcXFxcXVwiKTtcclxuXHRcdFx0XHR2YXIgbW9kaWZpZXIgPSBcImdcIjtcclxuXHRcdFx0XHRpdGVtSHRtbCA9IGl0ZW1IdG1sLnJlcGxhY2UobmV3IFJlZ0V4cChwYXR0ZXJuLCBtb2RpZmllciksIHBsYWNlaG9sZGVyLnZhbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGl0ZW1IdG1sO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdHNwLnRlbXBsYXRpbmcuRWFjaCA9IHtcclxuXHJcblx0XHRyZWdFeHA6IC9cXHtcXFtbXlxcXV0rXFxdXFx9Py9nLFxyXG5cclxuXHRcdHBvcHVsYXRlRWFjaFRlbXBsYXRlczogZnVuY3Rpb24oaXRlbUh0bWwsIGl0ZW0pIHtcclxuXHRcdFx0dmFyICRpdGVtSHRtbCA9ICQoaXRlbUh0bWwpLFxyXG5cdFx0XHRcdGVhY2hUZW1wbGF0ZXMgPSAkaXRlbUh0bWwuZmluZChcIltkYXRhLWVhY2hdXCIpO1xyXG5cclxuXHRcdFx0ZWFjaFRlbXBsYXRlcy5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBhcnJheUh0bWwgPSBcIlwiLFxyXG5cdFx0XHRcdFx0aXRlbVRlbXBsYXRlID0gJCh0aGlzKS5odG1sKCksXHJcblx0XHRcdFx0XHRhcnJheVByb3AgPSAkKHRoaXMpLmRhdGEoXCJlYWNoXCIpLFxyXG5cdFx0XHRcdFx0YXJyYXkgPSBzcC50ZW1wbGF0aW5nLmdldE9iamVjdFZhbHVlKGl0ZW0sIGFycmF5UHJvcCk7XHJcblxyXG5cdFx0XHRcdGlmIChhcnJheSAhPSBudWxsICYmICQuaXNBcnJheShhcnJheSkpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0YXJyYXlIdG1sICs9IHNwLnRlbXBsYXRpbmcucG9wdWxhdGVUZW1wbGF0ZShpdGVtVGVtcGxhdGUsIGFycmF5W2ldLCBzcC50ZW1wbGF0aW5nLkVhY2gucmVnRXhwKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdCRpdGVtSHRtbC5maW5kKCQodGhpcykpLmh0bWwoYXJyYXlIdG1sKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR2YXIgdGVtcCA9ICRpdGVtSHRtbC5jbG9uZSgpLndyYXAoXCI8ZGl2PlwiKTtcclxuXHRcdFx0cmV0dXJuIHRlbXAucGFyZW50KCkuaHRtbCgpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdHNwLnRlbXBsYXRpbmcucmVuZGVyVGVtcGxhdGUgPSBmdW5jdGlvbih0ZW1wbGF0ZSwgaXRlbSwgcmVuZGVyRWFjaFRlbXBsYXRlKSB7XHJcblx0XHR2YXIgaXRlbUh0bWwgPSBzcC50ZW1wbGF0aW5nLnBvcHVsYXRlVGVtcGxhdGUodGVtcGxhdGUsIGl0ZW0pO1xyXG5cdFx0aWYgKHJlbmRlckVhY2hUZW1wbGF0ZSkge1xyXG5cdFx0XHRpdGVtSHRtbCA9IHNwLnRlbXBsYXRpbmcuRWFjaC5wb3B1bGF0ZUVhY2hUZW1wbGF0ZXMoaXRlbUh0bWwsIGl0ZW0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGl0ZW1IdG1sO1xyXG5cdH07XHJcbn0pKFNQU2NyaXB0KTtcclxuXHJcblN0cmluZy5wcm90b3R5cGUuVVRDSnNvblRvRGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciB1dGNTdHIgPSB0aGlzLnN1YnN0cmluZyh0aGlzLmluZGV4T2YoXCIoXCIpICsgMSk7XHJcblx0dXRjU3RyID0gdXRjU3RyLnN1YnN0cmluZygwLCB1dGNTdHIuaW5kZXhPZihcIilcIikpO1xyXG5cclxuXHR2YXIgcmV0dXJuRGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KHV0Y1N0ciwgMTApKTtcclxuXHR2YXIgaG91ck9mZnNldCA9IHJldHVybkRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDYwO1xyXG5cdHJldHVybkRhdGUuc2V0SG91cnMocmV0dXJuRGF0ZS5nZXRIb3VycygpICsgaG91ck9mZnNldCk7XHJcblxyXG5cdHJldHVybiByZXR1cm5EYXRlO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTUFNjcmlwdC50ZW1wbGF0aW5nOyIsInZhciBTUFNjcmlwdCA9IHJlcXVpcmU7KFwiLi9zcHNjcmlwdFwiKTtcclxuU1BTY3JpcHQuaGVscGVycyA9IHJlcXVpcmUoXCIuL2hlbHBlcnNcIik7XHJcblNQU2NyaXB0LnBlcm1pc3Npb25zID0gcmVxdWlyZShcIi4vcGVybWlzc2lvbnNcIik7XHJcblxyXG4oZnVuY3Rpb24oc3ApIHtcclxuXHR2YXIgYmFzZVVybCA9IFwiL3dlYlwiO1xyXG5cdHZhciBXZWIgPSBmdW5jdGlvbihkYW8pIHtcclxuXHRcdHRoaXMuX2RhbyA9IGRhbztcclxuXHR9O1xyXG5cclxuXHRXZWIucHJvdG90eXBlLmluZm8gPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLl9kYW9cclxuXHRcdFx0LmdldChiYXNlVXJsKVxyXG5cdFx0XHQudGhlbihzcC5oZWxwZXJzLnZhbGlkYXRlT0RhdGFWMik7XHJcblx0fTtcclxuXHJcblx0V2ViLnByb3RvdHlwZS5zdWJzaXRlcyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2Rhb1xyXG5cdFx0XHQuZ2V0KGJhc2VVcmwgKyBcIi93ZWJpbmZvc1wiKVxyXG5cdFx0XHQudGhlbihzcC5oZWxwZXJzLnZhbGlkYXRlT0RhdGFWMik7XHJcblx0fTtcclxuXHJcblx0V2ViLnByb3RvdHlwZS5wZXJtaXNzaW9ucyA9IGZ1bmN0aW9uKGVtYWlsKSB7XHJcblx0XHRyZXR1cm4gc3AucGVybWlzc2lvbnMoYmFzZVVybCwgdGhpcy5fZGFvLCBlbWFpbCk7XHJcblx0fTtcclxuXHJcblx0V2ViLnByb3RvdHlwZS5nZXRVc2VyID0gZnVuY3Rpb24oZW1haWwpIHtcclxuXHRcdHZhciB1cmwgPSBiYXNlVXJsICsgXCIvU2l0ZVVzZXJzL0dldEJ5RW1haWwoJ1wiICsgZW1haWwgKyBcIicpXCI7XHJcblx0XHRyZXR1cm4gdGhpcy5fZGFvLmdldCh1cmwpLnRoZW4oc3AuaGVscGVycy52YWxpZGF0ZU9EYXRhVjIpO1xyXG5cdH07XHJcblxyXG5cdHNwLldlYiA9IFdlYjtcclxufSkoU1BTY3JpcHQpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTUFNjcmlwdC5XZWI7Il19
