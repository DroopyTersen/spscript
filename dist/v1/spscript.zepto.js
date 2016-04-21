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
/*
 *	@description ajax in broswer 
 *	@author liaozhongwu
 *	@params options {
 *		@key url
 *			@Class String
 *			@default ""
 *			@description request url, support url template :param and {param}
 *		@key method
 *			@Class Enum('GET', 'POST', 'PUT', 'HEAD', 'DELETE', 'PATCH')
 *			@default GET
 *			@description request method
 *		@key async
 *			@Class Boolean
 *			@default true
 *		@key data 
 *			@Class Object
 *			@default {}
 *			@description request data, append to query while method in [GET HEAD PATCH]
 *		@key format
 *			@Class Enum('form', 'json', 'formdata')
 *			@default form
 *			@description request data type, effective while method in [POST PUT DELETE]
 *		@key timeout
 *			@Class Number
 *			@description request timeout
 *    @key origin
 *			@Class Boolean
 *			@default false
 *			@description return origin response instead of body
 *		@key type  
 *			@Class Enum("", "arraybuffer", "blob", "document", "json", "text")
 *			@default json
 *			@description XMLHttpRequest.responseType
 *		@key headers
 *			@Class Object
 *			@default {}
 *			@description request headers
 *		@key before 
 *			@Class Function
 *			@description before request will be sent
 *		@key success
 *			@Class Function
 *			@description while request succeed
 *		@key error 
 *			@Class Function
 *			@description while request made mistakes
 *		@key complete
 *			@Class Function
 *			@description while request completed
 *	@params callback
 *	@return Promise
 */
 
(function () {

	// create default options
	var defaultOptions = {
		url: ''
		, method: 'GET'
		, async: true
		, data: {}
		, origin: false
		, type: "json"
		, headers: {}
	}
	,	errorInterceptors = []

	// util function
	function forEach (obj, callback) {
		if (!isFunction(callback)) return
		if (isArray(obj)) {
			if (obj.forEach) return obj.forEach(callback)
			for (var i = 0; i < obj.length; ++i) {
				callback(obj[i], i)
			}
		} 
		else if (isObject(obj)) {
			for (var key in obj) {
				obj.hasOwnProperty(key) && callback(obj[key], key)
			}
		}
	}

	function extend () {
		var n = {}
		for (var i = 0; i < arguments.length; ++i) {
			forEach(arguments[i], function (value, key) {
				n[key] = value
			})
		}
		return n
	}

	function isString (str) {
		return typeof str === 'string' || Object.prototype.toString.call(str) === '[object String]'
	}

	function isObject (obj) {
		return Object.prototype.toString.call(obj) === '[object Object]'
	}

	function isFunction (func) {
		return typeof func === 'function'
	}

	function isArray (arr) {
		if (Array.isArray) return Array.isArray(arr)
		return arr instanceof Array
	}

	function isValidMethod (method) {
		return isString(method) && /^GET|POST|PUT|HEAD|DELETE|PATCH$/.test(method.toUpperCase())
	}

	function isValidKey (key) {
		return /^url|method|async|data|format|timeout|body|type|headers|before|success|error|complete$/.test(key)
	}

	function querystring (data) {
		var search = []
		forEach(data, recursion)

		function recursion (value, key) {
			if (value === null || value === undefined || isFunction(value)) {
				search.push(encodeURIComponent(key) + "=")
			}
			else if (isObject(value)) {
				forEach(value, function (v, k) { recursion(v, key + "[" + k + "]") })
			} 
			else if (isArray(value)) {
				forEach(value, function (v) { recursion(v, key + "[]") })
			} 
			else {
				search.push(encodeURIComponent(key) + "=" + encodeURIComponent(value))
			}
		}

		return search.join("&")
	}

	function xhr () {
		if (typeof XMLHttpRequest !== 'undefined') return new XMLHttpRequest()
		if (typeof ActiveXObject !== 'undefined') return new ActiveXObject('Microsoft.XMLHTTP')
		return null
	}

 	// main funciton
	function _request () {
		var url = ''
		,	qs = ""
		, method = 'GET'
		, data = null
		, options = {}
		, callback
		, isTimeout = false
		, isFinished = false
		, err

		// handle arguments
		for (var i = 0; i < arguments.length; ++i) {
			var arg = arguments[i]
			if (isString(arg)) {
				url = arg
			} 
			else if (isObject(arg)) {
				options = arg
			} 
			else if (isFunction(arg)) {
				callback = arg
			}
		}

		// extend default options
		options = extend(defaultOptions, options)

		// get url
		isString(options.url) && (url = options.url)

		// get method
		isValidMethod(options.method) && (method = options.method.toUpperCase())

		// handle url template
	  url = url.replace(/:([^\/]+)|\{([^\/]+)\}/g, function (match, p) {return options[p] ? options[p] : p})

		// handle data
		if (method === "POST" || method === "PUT" || method === "DELETE") {
			switch (options.format) {
				case "json":
					options.headers['Content-Type'] = 'application/json;charset=UTF-8'
					data = JSON.stringify(options.data)
					break
				case "formdata":
					if (typeof FormData !== "undefined") {
						options.headers['Content-Type'] = "multipart/form-data"
						if (options.data instanceof FormData) {
							data = options.data
						} else {
							data = new FormData()
							forEach(options.data, function (value, key) {
								data.append(key, value)
							})
						}
						break
					}
				case "form":
				default:
					options.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
					qs = querystring(options.data)
					qs && (data = qs)
					break
			}
		} 
		else {
			qs = querystring(options.data)
			qs && (url += (url.indexOf('?') >= 0 ? '&' : '?') + qs)
		}

		// create XMLHttpRequest
		var http = xhr()

		// handle error
		if (http === null) {
			err = new Error("Your broswer don't support ajax!")
			isFunction(options.error) && options.error(err)
			isFunction(callback) && callback(err)
			if (typeof Promise !== "undefined") return Promise.reject(err)
			return
		}

		// open XMLHttpRequest
		http.open(method, url, options.async)

		// set request headers
		forEach(options.headers, function (value, key) {http.setRequestHeader(key, value)})

		// set response type
		options.type && (http.responseType = options.type)

		function send (resolve, reject) {

			http.onreadystatechange = function () {
				// complete
				if (http.readyState === 4 && !isTimeout) {
					isFinished = true
					var res = http.response
					http.body = http.response
					options.origin && (res = http)

					if (http.status < 400 && http.status >= 100) {
						isFunction(options.success) && options.success(res)
						isFunction(callback) && callback(null, res)
						isFunction(resolve) && resolve(res)
					} 
					else {
						err = new Error('Request Error, Response Code: ' + http.status)
						err.code = http.status
						http.error = err
						forEach(errorInterceptors, function (interceptor) {
							isFunction(interceptor) && interceptor(err, http)
						})
						isFunction(options.error) && options.error(err)
						isFunction(callback) && callback(err, res)
						isFunction(reject) && reject(err)
					}
					isFunction(options.complete) && options.complete(res)
				}
			}

			// call before send
			isFunction(options.before) && options.before()

			// set timeout
			if (options.timeout) {
				setTimeout(function () {
					if (!isFinished) {
						isTimeout = true
						err = new Error('Request Timeout, Response Code: 408')
						err.code = 408
						http.error = err
						forEach(errorInterceptors, function (interceptor) {
							isFunction(interceptor) && interceptor(err, http)
						})
						isFunction(options.error) && options.error(err)
						isFunction(callback) && callback(err, http)
						isFunction(reject) && reject(err)
						isFunction(options.complete) && options.complete(http)
					}
				}, options.timeout)
			}

			// send data
			http.send(data)
		}

		// create Promise
		if (typeof Promise !== "undefined") return new Promise(send)
		send()
	}

	function ajax () {
		return _request.apply(this, arguments)
	}

	ajax.get = function (url, data, callback) {
		return _request.call(this, {url: url, method: 'GET', data: data}, callback)
	}

	ajax.post = function (url, data, callback) {
		return _request.call(this, {url: url, method: 'POST', data: data}, callback)
	}

	ajax.setDefault = function (options) {
		defaultOptions = extend(defaultOptions, options)
		return ajax
	}

	ajax.setErrorInterceptor = function (interceptor) {
		errorInterceptors.push(interceptor)
		return ajax
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = ajax
	} else if (typeof define === "function" && define.amd) {
		define("ajax", [], function () {return ajax})
	} else {
		window.ajax = ajax
	}
})()
},{}],3:[function(require,module,exports){
var templating = {

	Placeholder: function(raw) {
		this.raw = raw;
		this.fullProperty = raw.slice(2, raw.length - 2);
	},

	getPlaceHolders: function(template, regexp) {
		var regExpPattern = regexp || /\{\{[^\}]+\}\}?/g;
		var matches = template.match(regExpPattern);
		return matches || [];
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
			var dateValue = UTCJsonToDate(value);
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

templating.Each = {

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
					arrayHtml += templating.populateTemplate(itemTemplate, array[i], templating.Each.regExp);
				}
			}

			$itemHtml.find($(this)).html(arrayHtml);
		});

		var temp = $itemHtml.clone().wrap("<div>");
		return temp.parent().html();
	}
};

templating.renderTemplate = function(template, item, renderEachTemplate) {
	var itemHtml = templating.populateTemplate(template, item);
	if (renderEachTemplate) {
		itemHtml = templating.Each.populateEachTemplates(itemHtml, item);
	}
	return itemHtml;
};

var UTCJsonToDate = function(jsonDate) {
	var utcStr = jsonDate.substring(jsonDate.indexOf("(") + 1);
	utcStr = utcStr.substring(0, utcStr.indexOf(")"));

	var returnDate = new Date(parseInt(utcStr, 10));
	var hourOffset = returnDate.getTimezoneOffset() / 60;
	returnDate.setHours(returnDate.getHours() + hourOffset);

	return returnDate;
};

module.exports = templating;
},{}],4:[function(require,module,exports){
/* eslint-disable no-unused-vars */
'use strict';
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],5:[function(require,module,exports){
var objAssign = require("object-assign");

var List 		= require("./list");
var Web 		= require("./web");
var Profiles 	= require("./profiles")
var Search 		= require("./search");
var fs 			= require("./filesystem");
var utils 		= require("./utils");

var Folder = fs.Folder;

var BaseDao = function() {
	var self = this;

	self.web = new Web(self);
	self.search = new Search(self);
	self.profiles = new Profiles(self);
};

BaseDao.prototype.executeRequest = function() {
	throw "Not implemented exception";
};

BaseDao.prototype.get = function(relativeQueryUrl, extendedOptions, raw) {
	var options = {
		method: "GET"
	};

	if (extendedOptions) {
		options = objAssign({}, options, extendedOptions);
	}
	return this.executeRequest(relativeQueryUrl, options);
};

BaseDao.prototype.lists = function(listname) {
	if (!listname) {
		return this.get("/web/lists").then(utils.validateODataV2);
	}
	return new List(listname, this);
};

BaseDao.prototype.post = function(relativePostUrl, body, extendedOptions) {
	var strBody = JSON.stringify(body);
	var options = {
		method: "POST",
		data: strBody,
		contentType: "application/json;odata=verbose"
	};
	options = objAssign({}, options, extendedOptions);
	return this.executeRequest(relativePostUrl, options);
};

BaseDao.prototype.getFolder = function(serverRelativeUrl) {
	if (serverRelativeUrl.charAt(0) === "/") {
		serverRelativeUrl = serverRelativeUrl.substr(1);
	}
	var url = "/web/GetFolderByServerRelativeUrl('" + serverRelativeUrl + "')?$expand=Folders,Files";

	return this.get(url).then(utils.validateODataV2).then(function(spFolder) {
		var folder = new Folder(spFolder);
		folder.populateChildren(spFolder);
		return folder;
	});
};

BaseDao.prototype.uploadFile = function(folderUrl, name, base64Binary) {
	var uploadUrl = "/web/GetFolderByServerRelativeUrl('" + folderUrl + "')/Files/Add(url='" + name + "',overwrite=true)",
		options = {
			binaryStringRequestBody: true,
			state: "Update"
		};
	return this.post(uploadUrl, base64Binary, options);
};


module.exports = BaseDao;
},{"./filesystem":8,"./list":9,"./profiles":11,"./search":14,"./utils":15,"./web":16,"object-assign":4}],6:[function(require,module,exports){
(function (global){

global.Zepto = require("../../lib/zepto.custom");
global.$ = global.Zepto;
global.SPScript = require("./spscript");
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../../lib/zepto.custom":1,"./spscript":7}],7:[function(require,module,exports){
(function (global){
var SPScript = {};
SPScript.RestDao = require("../restDao");
SPScript.queryString = require("../queryString");
SPScript.templating = require("droopy-templating");
SPScript.utils = require("../utils");

module.exports = global.SPScript = SPScript;


}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../queryString":12,"../restDao":13,"../utils":15,"droopy-templating":3}],8:[function(require,module,exports){
var utils = require("./utils");

var Folder = function(spFolder) {
	var self = this;
	self.mapProperties(spFolder);
};

Folder.prototype.populateChildren = function(spFolder) {
	this.folders = spFolder.Folders.results.map(function(spFolder){
		return new Folder(spFolder);
	});
	
	this.files = spFolder.Files.results.map(function(spFile){
		return new File(spFile);
	});
};

Folder.prototype.mapProperties = function(spFolder) {
	this.name = spFolder.Name;
	this.serverRelativeUrl = spFolder.ServerRelativeUrl;
	this.itemCount = spFolder.ItemCount;
	this.guid = spFolder.UniqueId;
	this.uri = spFolder.__metadata.uri;
};

var File = function(spFile) {
	this.mapProperties(spFile);
};

File.prototype.mapProperties = function(spFile) {
	this.name = spFile.Name,
	this.title = spFile.Title,
	this.checkoutType = spFile.CheckOutType,
	this.byteLength = spFile.Length,
	this.majorVersion = spFile.MajorVersion,
	this.minorVersion = spFile.MinorVersion,
	this.serverRelativeUrl = spFile.ServerRelativeUrl,
	this.uri =  spFile.__metadata.uri
};
	

module.exports = {
	File: File,
	Folder: Folder
};
},{"./utils":15}],9:[function(require,module,exports){
var utils 			= require("./utils");
var Permissions 	= require("./permissions");
var objAssign 		= require("object-assign");

var List = function(listname, dao) {
	this.listname = listname;
	this.baseUrl = "/web/lists/getbytitle('" + listname + "')";
	this._dao = dao;
	this.permissions = new Permissions(this.baseUrl, this._dao);
};

List.prototype.getItems = function(odataQuery) {
	var query = (odataQuery != null) ? "?" + odataQuery : "";
	return this._dao
		.get(this.baseUrl + "/items" + query)
		.then(utils.validateODataV2);
};

List.prototype.getItemById = function(id, odata) {
	var url = this.baseUrl + "/items(" + id + ")";
	url += (odata != null) ? "?" + odata : "";
	return this._dao.get(url).then(utils.validateODataV2);
};

List.prototype.info = function() {
	return this._dao.get(this.baseUrl).then(utils.validateODataV2);
};

List.prototype.addItem = function(item) {
	var self = this;
	return self._dao.get(self.baseUrl).then(function(data) {
		item = objAssign({}, {
			"__metadata": {
				"type": data.d.ListItemEntityTypeFullName
			}
		}, item);

		var customOptions = {
			headers: {
				"Accept": utils.acceptHeader,
				"X-RequestDigest": utils.getRequestDigest()
			}
		};

		return self._dao.post(baseUrl + "/items", item, customOptions)
			.then(utils.validateODataV2);
	});
};

List.prototype.updateItem = function(itemId, updates) {
	var self = this;
	return self.getItemById(itemId).then(function(item) {
		updates = objAssign({}, {
			"__metadata": {
				"type": item.__metadata.type
			}
		}, updates);

		var customOptions = {
			headers: {
				"Accept": utils.acceptHeader,
				"X-RequestDigest": utils.getRequestDigest(),
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
				"Accept": utils.acceptHeader,
				"X-RequestDigest": utils.getRequestDigest(),
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

module.exports = List;
},{"./permissions":10,"./utils":15,"object-assign":4}],10:[function(require,module,exports){
var utils = require("./utils");

var Permissions = function(baseUrl, dao) {
   this._dao = dao;
   this.baseUrl = baseUrl
};

Permissions.prototype.getRoleAssignments = function() {
   var url = baseUrl + "/RoleAssignments?$expand=Member,RoleDefinitionBindings";
   return dao.get(url)
      .then(utils.validateODataV2)
      .then(function(results) {
         return results.map(transforms.roleAssignment);
      });
};

Permissions.prototype.check = function(email) {
   var self = this;
   var checkPrivs = function(user) {
      var login = encodeURIComponent(user.LoginName);
      var url = self.baseUrl + "/getusereffectivepermissions(@v)?@v='" + login + "'";
      return self._dao.get(url).then(utils.validateODataV2);
   };

   // If no email is passed, then get current user, else get user by email
   var req = !email ? self._dao.get('/web/getuserbyid(' + _spPageContextInfo.userId + ')').then(function(data) {
      return data.d
   }) : self._dao.web.getUser(email)

   return req.then(checkPrivs)
      .then(function(privs) {
         return permissionMaskToStrings(privs.GetUserEffectivePermissions.Low, privs.GetUserEffectivePermissions.High);
      });
}

var transforms = {
   roleAssignment: function(raw) {
      var priv = {
         member: {
            login: raw.Member.LoginName,
            name: raw.Member.Title,
            id: raw.Member.Id
         }
      };
      priv.roles = raw.RoleDefinitionBindings.results.map(function(roleDef) {
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
   spBasePermissions.forEach(function(basePermission) {
      if ((basePermission.low & lowMask) > 0 || (basePermission.high & highMask) > 0) {
         basePermissions.push(basePermission.name);
      }
   });
   return basePermissions;
};

// Scraped it from SP.PermissionKind. 
// Storing it in here to remove sp.js dependency

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

var spBasePermissions = [{
   "name": "emptyMask",
   "low": 0,
   "high": 0
}, {
   "name": "viewListItems",
   "low": 1,
   "high": 0
}, {
   "name": "addListItems",
   "low": 2,
   "high": 0
}, {
   "name": "editListItems",
   "low": 4,
   "high": 0
}, {
   "name": "deleteListItems",
   "low": 8,
   "high": 0
}, {
   "name": "approveItems",
   "low": 16,
   "high": 0
}, {
   "name": "openItems",
   "low": 32,
   "high": 0
}, {
   "name": "viewVersions",
   "low": 64,
   "high": 0
}, {
   "name": "deleteVersions",
   "low": 128,
   "high": 0
}, {
   "name": "cancelCheckout",
   "low": 256,
   "high": 0
}, {
   "name": "managePersonalViews",
   "low": 512,
   "high": 0
}, {
   "name": "manageLists",
   "low": 2048,
   "high": 0
}, {
   "name": "viewFormPages",
   "low": 4096,
   "high": 0
}, {
   "name": "anonymousSearchAccessList",
   "low": 8192,
   "high": 0
}, {
   "name": "open",
   "low": 65536,
   "high": 0
}, {
   "name": "viewPages",
   "low": 131072,
   "high": 0
}, {
   "name": "addAndCustomizePages",
   "low": 262144,
   "high": 0
}, {
   "name": "applyThemeAndBorder",
   "low": 524288,
   "high": 0
}, {
   "name": "applyStyleSheets",
   "low": 1048576,
   "high": 0
}, {
   "name": "viewUsageData",
   "low": 2097152,
   "high": 0
}, {
   "name": "createSSCSite",
   "low": 4194304,
   "high": 0
}, {
   "name": "manageSubwebs",
   "low": 8388608,
   "high": 0
}, {
   "name": "createGroups",
   "low": 16777216,
   "high": 0
}, {
   "name": "managePermissions",
   "low": 33554432,
   "high": 0
}, {
   "name": "browseDirectories",
   "low": 67108864,
   "high": 0
}, {
   "name": "browseUserInfo",
   "low": 134217728,
   "high": 0
}, {
   "name": "addDelPrivateWebParts",
   "low": 268435456,
   "high": 0
}, {
   "name": "updatePersonalWebParts",
   "low": 536870912,
   "high": 0
}, {
   "name": "manageWeb",
   "low": 1073741824,
   "high": 0
}, {
   "name": "anonymousSearchAccessWebLists",
   "low": -2147483648,
   "high": 0
}, {
   "name": "useClientIntegration",
   "low": 0,
   "high": 16
}, {
   "name": "useRemoteAPIs",
   "low": 0,
   "high": 32
}, {
   "name": "manageAlerts",
   "low": 0,
   "high": 64
}, {
   "name": "createAlerts",
   "low": 0,
   "high": 128
}, {
   "name": "editMyUserInfo",
   "low": 0,
   "high": 256
}, {
   "name": "enumeratePermissions",
   "low": 0,
   "high": 1073741824
}];

module.exports = Permissions; 
},{"./utils":15}],11:[function(require,module,exports){
var utils = require("./utils");

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
				.then(utils.validateODataV2)
				.then(transformPersonProperties);
};

Profiles.prototype.setProperty = function(userOrEmail, key, value) {
	var self = this;
	var url = this.baseUrl + "/SetSingleValueProfileProperty";
	var args = {
		propertyName: key,
		propertyValue: value,
	};
	var customOptions = {
		headers: {
			"Accept": utils.acceptHeader,
			"X-RequestDigest": utils.getRequestDigest()
		}
	};

	// if a string is passed, assume its an email address
	if (typeof userOrEmail === "string") {
		return self.getByEmail(userOrEmail).then(function(user){
			args.accountName = user.AccountName;
			return self._dao.post(url, args, customOptions);
		})
	} else {
		args.accountName = userOrEmail.LoginName || userOrEmail.AccountName;
		return self._dao.post(url, args, customOptions);
	}
};

Profiles.prototype.getProfile = function(user) {
	var login = encodeURIComponent(user.LoginName);
	var url = this.baseUrl + "/GetPropertiesFor(accountName=@v)?@v='" + login + "'";
	return this._dao.get(url)
		.then(utils.validateODataV2)
		.then(transformPersonProperties);
};

Profiles.prototype.getByEmail = function(email) {
	var self = this;
	return self._dao.web.getUser(email)
		.then(function(user) {
			return self.getProfile(user);
		});
};

module.exports = Profiles;
},{"./utils":15}],12:[function(require,module,exports){
var queryString = {
	_queryString: {},
	_processed: false,

	//private method (only run on the first 'GetValue' request)
	_processQueryString: function(text) {
		if (text || window.location.search) {
			var qs = text || window.location.search.substring(1),
				keyValue,
				keyValues = qs.split('&');

			for (var i = 0; i < keyValues.length; i++) {
				keyValue = keyValues[i].split('=');
				//this._queryString.push(keyValue[0]);
				this._queryString[keyValue[0]] = decodeURIComponent(keyValue[1].replace(/\+/g, " "));
			}
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

module.exports = queryString;
},{}],13:[function(require,module,exports){
var BaseDao = require("./baseDao");
var objAssign = require("object-assign");
var ajax = require('client-ajax') 

var RestDao = function(url) {
	var self = this;
	BaseDao.call(this);
	this.webUrl = url || _spPageContextInfo.webAbsoluteUrl;
};

RestDao.prototype = new BaseDao();

RestDao.prototype.executeRequest = function(url, options) {
	var self = this;
	var fullUrl = (/^http/i).test(url) ? url : this.webUrl + "/_api" + url;

	var executeOptions = {
		url: fullUrl,
		method: "GET",
		headers: {
			"Accept": "application/json; odata=verbose"
		}
	};

	executeOptions = objAssign({}, executeOptions, options);
	return ajax(executeOptions);
};


module.exports = RestDao;
},{"./baseDao":5,"client-ajax":2,"object-assign":4}],14:[function(require,module,exports){
var queryString = require('./queryString');

var Search = function(dao) {
	this._dao = dao;
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
	this.refiners = queryResponse.PrimaryQueryResult.RefinementResults ? MapRefiners(queryResponse.PrimaryQueryResult.RefinementResults.Refiners.results) : null;
};

var MapRefiners = function(refinerResults) {
	var refiners = [];

	for (var i = 0; i < refinerResults.length; i++) {
		var entry = {};
		entry.RefinerName = refinerResults[i].Name;
		entry.RefinerOptions = refinerResults[i].Entries.results;

		refiners.push(entry);
	}

	return refiners;
};

Search.prototype.query = function(queryText, queryOptions) {
	var self = this;
	var optionsQueryString = queryOptions != null ? "&" + queryString.objectToQueryString(queryOptions, true) : "";

	var url = "/search/query?querytext='" + queryText + "'" + optionsQueryString;
	return self._dao.get(url).then(function(data) {
		if (data.d && data.d.query) {
			return new SearchResults(data.d.query);
		}
		throw new Error("Invalid response back from search service");
	});
};

Search.prototype.people = function(queryText, queryOptions) {
	var options = queryOptions || {};
	options.sourceid = 'b09a7990-05ea-4af9-81ef-edfab16c4e31';
	return this.query(queryText, options);
};


module.exports = Search;
},{"./queryString":12}],15:[function(require,module,exports){
var getRequestDigest = exports.getRequestDigest = function() {
	return document.querySelector("#__REQUESTDIGEST").value
};
var acceptHeader = exports.acceptHeader = "application/json;odata=verbose";

var validateODataV2 = exports.validateODataV2= function(data) {
	var results = data;
	if (data.d && data.d.results && data.d.results.length != null) {
		results = data.d.results;
	} else if (data.d) {
		results = data.d;
	}
	return results;
};

var validateCrossDomainODataV2 = exports.validateCrossDomainODataV2 = function(response) {
	var data = $.parseJSON(response.body);
	helpers.validateODataV2(data);
};

//'Borrowed' from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
var arrayFromBitMask = exports.arrayFromBitMask = function(nMask) {
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

var waitForLibraries = exports.waitForLibraries = function(namespaces, cb) {
	var missing = namespaces.filter(function(namespace) {
		return !validateNamespace(namespace);
	});

	if (missing.length === 0) {
		cb();
	} else {
		setTimeout(function() {
			waitForLibraries(namespaces, cb);
		}, 25);
	}
};

var waitForLibrary = exports.waitForLibrary = function(namespace, cb) {
	return waitForLibraries([namespace], cb);
};

var validateNamespace = exports.validateNamespace = function(namespace) {
	var scope = window;
	var sections = namespace.split(".");
	var sectionsLength = sections.length;
	for (var i = 0; i < sectionsLength; i++) {
		var prop = sections[i];
		if (prop in scope) {
			scope = scope[prop]
		} else {
			return false;
		}
	}
	return true;
};
},{}],16:[function(require,module,exports){
var utils = require("./utils");
var Permissions = require("./permissions");
var objAssign = require("object-assign");

var Web = function(dao) {
	this._dao = dao;
	this.baseUrl = "/web";
	this.permissions = new Permissions(this.baseUrl, this._dao);
};

Web.prototype.info = function() {
	return this._dao
		.get(this.baseUrl)
		.then(utils.validateODataV2);
};

Web.prototype.subsites = function() {
	return this._dao
		.get(this.baseUrl + "/webinfos")
		.then(utils.validateODataV2);
};

Web.prototype.getRequestDigest = function() {
	var url = "/contextinfo";
	var options = {
		headers: {
			"Accept": "application/json;odata=verbose",
			"Content-Type": "application/json;odata=verbose"
			//"Content-Length": "255",
		}
	};
	return this._dao.post(url, {}, options).then(function(data) {
		return data.d.GetContextWebInformation.FormDigestValue;
	});
};

Web.prototype.copyFile = function(sourceUrl, destinationUrl, digest) {
	var self = this;
	if (digest) return self._copyFileWithDigest(sourceUrl, destinationUrl, digest);

	self.getRequestDigest().then(function(requestDigest) {
		return self._copyFileWithDigest(sourceUrl, destinationUrl, requestDigest)
	});
};

Web.prototype.deleteFile = function(sourceUrl, digest) {
	var self = this;
	if (digest) return self._deleteFileWithDigest(sourceUrl, digest);

	self.getRequestDigest().then(function(requestDigest) {
		return self._deleteFileWithDigest(sourceUrl, requestDigest)
	});
};

var headers = {
			"Accept": "application/json;odata=verbose",
			"Content-Type": "application/json;odata=verbose"
};

Web.prototype._deleteFileWithDigest = function(sourceUrl, requestDigest) {
	var url = "/web/getfilebyserverrelativeurl(@url)/?@Url='" + sourceUrl + "'";
	var options = {
		headers: objAssign({}, headers, { 
			"X-HTTP-Method": "DELETE",
			"X-RequestDigest": requestDigest
	 	})
	};
	return this._dao.post(url, {}, options);
}; 

Web.prototype._copyFileWithDigest = function(sourceUrl, destinationUrl, requestDigest) {
	var url = "/web/getfilebyserverrelativeurl(@url)/CopyTo?@Url='" + sourceUrl + "'&strNewUrl='" + destinationUrl + "'&bOverWrite='true'";
	var options = {
		headers: objAssign({}, headers, { "X-RequestDigest": requestDigest })
	}
	return this._dao.post(url, {}, options);
};


Web.prototype.getUser = function(email) {
	var url = baseUrl + "/SiteUsers/GetByEmail('" + email + "')";
	return this._dao.get(url).then(utils.validateODataV2);
};

module.exports = Web;
},{"./permissions":10,"./utils":15,"object-assign":4}]},{},[6])