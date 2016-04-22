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
 var Promise = require('es6-promise').Promise;
 
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
	  //url = url.replace(/:([^\/]+)|\{([^\/]+)\}/g, function (match, p) {return options[p] ? options[p] : p})

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