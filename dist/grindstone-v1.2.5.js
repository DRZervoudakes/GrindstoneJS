/**
 * Grindstone JavaScript Library v1.2.5
 * https://github.com/DanZiti/GrindstoneJS
 *
 * Copyright (c) 2014, 2016 Dan Zervoudakes
 * Released under the MIT license
 * https://github.com/DanZiti/GrindstoneJS/blob/master/LICENSE
 */

(function(w, d) {
	
"use strict";

/**
 * Library core: constructor, prototype
 * @param {string|object} selector
 * @param {context} context
 * @returns {array} Grindstone.set
 */
	
	
	var Grindstone = function(selector, context) {
		
		if (selector) {
			
			var selectedElements, ctx, els, i, j;
			
			if (typeof selector === "string") {
				
				if (context) {
					
					ctx = d.querySelectorAll(context);
					selectedElements = [];
					
					for (i = 0; i < ctx.length; i++) {
						els = ctx[i].querySelectorAll(selector);
						for (j = 0; j < els.length; j++) {
							selectedElements.push(els[j]);
						}
					}
					
				} else {
					selectedElements = d.querySelectorAll(selector);
				}
				
				if (selectedElements.length > 0) {
					this.set = selectedElements;
				} else {
					return [];
				}
				
				return this;
				
			} else if (typeof selector === "object") {
				this.set = [selector];
			}
			
		} else {
			throw new Error("Cannot create new instance of Grindstone without a selector.");
		}
	};
	
	var $ = function(selector, context) {
		return new Grindstone(selector, context);
	};
	
	$.fn = Grindstone.prototype;
	
	/**
	 * The init() method:
	 * Use this throughout each module to collect and loop through the set
	 */
	
	$.fn.init = function(callback) {
		for (var i = 0; i < this.set["length"]; i++) {
			callback.call(this.set[i]);
		}
	};

/**
 * ajax()
 *
 * Basic AJAX call for pulling external data into the DOM and sending data to external servers
 *
 * Parameter - to be programmed as an object with the following properties:
 * -method ("GET"/"POST")
 * -url (data path)
 * -async (true/false)
 * -success (callback to invoke if successful)
 * -header (adds a custom HTTP header to the request)
 * -headerValue (value of the custom HTTP header)
 * -sendStr (string to be sent for POST requests)
 */
	
	$.ajax = function(options) {
		
		var method, url, async, success, header, headerValue, sendStr, xmlhttp;
		
		function prop(property) {
			return options.hasOwnProperty(property);
		};
		
		if (typeof options === "object") {
			
			method   = (prop("method"))   ? options.method   : null;
			url      = (prop("url"))      ? options.url      : null;
			async    = (prop("async"))    ? options.async    : true;
			success  = (prop("success"))  ? options.success  : null;
			sendStr  = (prop("str"))      ? options.sendStr  : null;
			
		}
		
		else {
			throw new Error("Ajax request cannot be sent.");
		}
		
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState === 4 && xmlhttp.status !== 404) {
				success(xmlhttp);
			}
		};
		xmlhttp.open(method, url, async);
		
		if (prop("header") && prop("headerValue")) {
			xmlhttp.setRequestHeader(header, headerValue);
		}
		
		else {
			xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		}
		
		xmlhttp.send(sendStr);
		return xmlhttp;
	};

/**
 * Append a new child element to the current object
 * @param {string|object} element
 * @returns {object} current instance of Grindstone
 */
	
	$.fn.append = function(element) {
		
		var dom, i;
		
		this.init(function() {
				
			if (typeof element === "string") {
				
				if (element.match(/(<).+(>)/)) {
					this.innerHTML += element;
				} else {
					dom = document.querySelectorAll(element);
					for (i = 0; i < dom.length; i++) {
						this.appendChild(dom[i]);
					}
				}
				
			} else {
				this.appendChild(element);
			}
			
		});
		
		return this;
	};

/**
 * attr() / hasAttr() / removeAttr()
 *
 * Sets or returns the value of the specified attribute; Checks to see if the specified element has the specified attribute;
 * Removes the specified attribute
 *
 * Parameters:
 * -attribute
 * -value (optional - if included, the specified attribute will be set to this value...
 *         otherwise, the current value of the specified value will be returned)
 */
	
	$.fn.attr = function(_attribute, _value) {
		
		var elemAttribute;
		
		this.init(function() {
			
			if (_value) {
				this.setAttribute(_attribute, _value);
			}
			
			else {
				elemAttribute = this.getAttribute(_attribute);
			}
			
		});
		
		return _value ? this : elemAttribute;
	};
	
	$.fn.hasAttr = function(_attribute) {
		
		var exists;
		
		this.init(function() {
			if (_attribute) exists = $(this).attr(_attribute) !== null;
		});
		
		return exists;
	};
	
	$.fn.removeAttr = function(_attribute) {
		
		this.init(function() {
			if (_attribute) this.removeAttribute(_attribute);
		});
		
		return this;
	};

/**
 * css()
 *
 * Adjusts the CSS styles of a selected element if an object is passed as the argument or if both the styles and value arguments are passed as strings
 * Returns the specified CSS value if a string is passed as the styles argument and the value argument is null
 *
 * Parameter:
 * -styles (can be programmed as an object or a string)
 * -value (optional; the new value of the styles argument, assuming styles is a string with a valid CSS property)
 */
	
	$.fn.css = function(_styles, _value) {
		
		var returnedStyle, i;
		
		this.init(function() {
			
			if (typeof _styles === "object") {
				for (i in _styles) {
					this.style[i] = _styles[i];
				}
			}
			
			else if (typeof _styles === "string" && !_value) {
				returnedStyle = this.style[_styles];
			}
			
			else if (typeof _styles === "string" && typeof _value === "string") {
				this.style[_styles] = _value;
			}
			
		});
		
		return (typeof _styles === "object" || typeof _styles === "string" && _value) ? this : returnedStyle;
	};

/**
 * hasClass() / addClass() / removeClass() / toggleClass()
 *
 * Detects whether or not the target element has the specified class; Adds/removes the specified class; Toggles the specified class
 *
 * Parameter:
 * -cls (the className being specified)
 */
	
	// Regular expression specific to this module
	//
	$.regxCls = function(_cls) {
		return new RegExp("(\\s|^)" + _cls + "(\\s|$)");
	};
	
	// Detect if a given element has a particular class
	//
	$.fn.hasClass = function(_cls) {
		
		var hasCls;
		
		this.init(function() {
			hasCls = (this.className.match($.regxCls(_cls)) !== null) ? true : false;
		});
		
		return hasCls;
	};
	
	// Add the specified class to the element if it doesn't already contain that class
	//
	$.fn.addClass = function(_cls) {
		
		this.init(function() {
			
			if (!$(this).hasClass(_cls)) {
				
				if (this.className === "") {
					this.className += _cls;
				}
				
				else {
					this.className += " " + _cls;
				}
				
			}
			
		});
		
		return this;
	};
	
	// Remove the specified class from the element if it contains that class
	//
	$.fn.removeClass = function(_cls) {
		
		this.init(function() {
			if ($(this).hasClass(_cls)) this.className = this.className.replace($.regxCls(_cls), "");
		});
		
		return this;
	};
	
	// Toggle the specified class
	//
	$.fn.toggleClass = function(_cls) {
		
		this.init(function() {
			
			if (!$(this).hasClass(_cls)) {
				$(this).addClass(_cls);
			}
			
			else {
				$(this).removeClass(_cls);
			}
			
		});
		
		return this;
	};

/**
 * clone()
 *
 * Returns an exact duplicate of the first element matching the selector, including its children
 */
	
	$.fn.clone = function() {
		return this.set[0].cloneNode(true);
	};

/**
 * height() / width()
 *
 * Returns the height/width value of the specified selector as an integer
 * To change the height and/or width (in px), enter in the "num" parameter
 * If simply returning the current height/width, this will only apply to the first match in the set and includes padding
 * Setting the height/width will apply to all elements in the set
 *
 * Parameter: (optional)
 * -num (integer; number of pixels)
 */
	
	$.fn.height = function(_num) {
		
		if (typeof _num === "number" || _num === 0) {
			
			this.init(function() {
				this.style.height = _num + "px";
			});
			
		}
		
		else {
			return this.set[0].offsetHeight;
		}
		
		return this;
	};
	
	$.fn.width = function(_num) {
		
		if (typeof _num === "number" || _num === 0) {
			
			this.init(function() {
				this.style.width = _num + "px";
			});
			
		}
		
		else {
			return this.set[0].offsetWidth;
		}
		
		return this;
	};

/**
 * show() / hide()
 *
 * Shows a hidden element
 * Hides a visible element
 * May be instant or delayed
 *
 * Parameter: (optional)
 * -delay (miliseconds)
 */
	
	$.fn.show = function(_delay) {
		
		this.init(function() {
			
			if (typeof _delay === "number") {
				
				var self = this;
				
				setTimeout(function() {
					self.style.display = "block";
				}, _delay);
				
			}
			
			else {
				this.style.display = "block";
			}
			
		});
		
		return this;
	};
	
	$.fn.hide = function(_delay) {
		
		this.init(function() {
			
			if (typeof _delay === "number") {
				
				var self = this;
				
				setTimeout(function() {
					self.style.display = "none";
				}, _delay);
				
			}
			
			else {
				this.style.display = "none";
			}
			
		});
		
		return this;
	};

/**
 * doubleTap()
 * 
 * Custom double-tapping/double-clicking method
 *
 * Parameter:
 * -callback (triggered if the double-click/double-tap event is completed in time)
 */
	
	$.fn.doubleTap = function(_callback) {
		
		var active, interaction;
		
		this.init(function() {
			
			active = false;
			interaction = ("createTouch" in document) ? "touchend" : "click";
				
			$(this).on(interaction, function() {
				
				if (active) {
					_callback();
					return active = false;
				}
				
				active = true;
				
				setTimeout(function() {
					return active = false;
				}, 350);
				
			});
				
		});
		
		return this;
 	};
 
/**
 * each()
 * 
 * Iterates through each item in the set and executes the callback
 *
 * Parameter:
 * -callback (function called once for each item in the set)
 */
	
	$.fn.each = function(_callback) {
		
		for (var i = 0; i < this.set["length"]; i++) {
			_callback.call(this.set[i]);
		}
		
		return this;
 	};
 
/**
 * eq()
 *
 * Returns an element from the set as specified by the corresponding index value
 */
	
	$.fn.eq = function(index) {
		return $(this.set[index]);
	};

/**
 * on() / off()
 * 
 * Adding and removing event listeners
 *
 * Parameters:
 * -action (the event(s) to handle)
 * -callback (the event handler)
 */
	
	// Assign the eventListener
	//
	$.fn.on = function(_action, _callback) {
		
		var events, i;
		
		this.init(function() {
					
			events = _action.split(" ");
			
			for (i = 0; i < events.length; i++) {
				this.addEventListener(events[i], _callback, false);
			}
			
		});
		
		return this;
 	};
	
	// Drop the eventListener
	//
	$.fn.off = function(_action, _callback) {
		
		var events, i;
		
		this.init(function() {
					
			events = _action.split(" ");
			
			for (i = 0; i < events.length; i++) {
				this.removeEventListener(events[i], _callback, false);
			}
			
		});
		
		return this;
	};

/**
 * html()
 * 
 * Returns the selected element's innerHTML, or replaces it if the "content" argument is entered
 *
 * Parameter: (optional)
 * -content
 */
	
	$.fn.html = function(_content) {
		
		var txt;
		
		this.init(function() {
			
			if (_content) {
				this.innerHTML = _content;
			}
			
			else {
				txt = this.innerHTML;
			}
			
		});
		
		return _content ? this : txt;
 	};
 
/**
 * before() / after()
 *
 * Inserts new content either before or after the target element
 * New content can be either HTML input as a string or existing DOM elements
 *
 * Parameter:
 * -content
 */
	
	$.fn.before = function(_content) {
		
		var dom, i;
		
		this.init(function() {
				
			if (typeof _content === "string") {
				
				if (_content.charAt(0) === "<" && _content.charAt(_content.length - 1) === ">" && _content.length >= 3) {
					this.insertAdjacentHTML("beforebegin", _content);
				}
				
				else {
					
					dom = document.querySelectorAll(_content);
					
					for (i = 0; i < dom.length; i++) {
						this.parentNode.insertBefore(dom[i], this);
					}
				}
				
			}
			
			else {
				this.parentNode.insertBefore(_content, this);
			}
			
		});
		
		return this;
	};
	
	$.fn.after = function(_content) {
		
		var dom, i;
		
		this.init(function() {
				
			if (typeof _content === "string") {
				
				if (_content.charAt(0) === "<" && _content.charAt(_content.length - 1) === ">" && _content.length >= 3) {
					this.insertAdjacentHTML("afterend", _content);
				}
				
				else {
					
					dom = document.querySelectorAll(_content);
					
					for (i = 0; i < dom.length; i++) {
						this.parentNode.insertBefore(dom[i], this.nextSibling);
					}
				}
				
			}
			
			else {
				this.parentNode.insertBefore(_content, this.nextSibling);
			}
			
		});
		
		return this;
	};

/**
 * mouseable()
 *
 * Dynamically adds class "over" to elements as a hover state (default)
 * Dynamically adds class "down" to elements as an active state (default)
 * Removes the need for applicable CSS pseudo-states
 * Handles both standard mouse events and touch events
 * Developers may define their own hover/active classes with the optional "classes" object
 * 
 * Parameter:
 * -classes (object with properties "hoverClass" and "activeClass")
 */
	
	$.fn.mouseable = function(_classes) {
		
		var hoverClass, activeClass, evt_hover, evt_remove, evt_down, evt_up;
		
		if (_classes) {
			
			if (typeof _classes === "object") {
				hoverClass  = (_classes.hasOwnProperty("hoverClass"))  ? _classes["hoverClass"]  : "over";
				activeClass = (_classes.hasOwnProperty("activeClass")) ? _classes["activeClass"] : "down";
			}
			
			else {
				throw new Error("Classes parameter for mouseable() must be an object with properties 'hoverClass' and/or 'activeClass'.");
			}
			
		}
		
		else {
			hoverClass = "over";
			activeClass = "down";
		}
		
		evt_hover  = ("createTouch" in document) ? "touchstart" : "mouseenter";
		evt_remove = ("createTouch" in document) ? "touchend"   : "mouseleave";
		evt_down   = ("createTouch" in document) ? "touchstart" : "mousedown";
		evt_up     = ("createTouch" in document) ? "touchend"   : "mouseup mouseleave";
		
		this.init(function() {
			
			$(this)
				.on(evt_hover, function() {
					$(this).addClass(hoverClass);
				})
				.on(evt_remove, function() {
					$(this)
						.removeClass(hoverClass + " " + activeClass)
						.removeClass(hoverClass);
				})
				.on(evt_down, function() {
					$(this).addClass(activeClass);
				})
				.on(evt_up, function() {
					$(this).removeClass(activeClass);
				});
			
		});
	};

/**
 * newEl()
 *
 * Creates a new DOM element
 *
 * Parameters:
 * -type (type of DOM element)
 * -id (ID of the new element - optional)
 * -class (className of the new element - optional)
 * -inner (innerHTML to be added - optional)
 */
	
	$.newEl = function(_type, _id, _class, _inner) {
		
		if (_type) {
			
			var newElement = document.createElement(_type);
			
			newElement.id 		 = (_id)	? _id 	 : "";
			newElement.className = (_class) ? _class : "";
			newElement.innerHTML = (_inner) ? _inner : "";
			
			return newElement;
			
		}
		
		else {
			throw new Error("New element type is undefined.");
		}
		
	};

/**
 * offset()
 *
 * Returns the left/top offset value of the specified selector relative to the document (as an integer)
 * This will only apply to the first match in the set and includes margins
 *
 * Parameter:
 * -position (string; either "left" or "top")
 */
	
	$.fn.offset = function(_position) {
		
		var elem, offsetLeft, offsetTop;
		
		if (_position && typeof _position === "string") {
			
			if (_position !== "left" && _position !== "top") {
				throw new Error("offset() position must be either 'left' or 'top'.");
			}
			
			else {
				
				elem = this.set[0];
				
				if (_position === "left") {
					
					offsetLeft = 0;
				   
				    do {
				        if (!isNaN(elem.offsetLeft)) {
				          offsetLeft += elem.offsetLeft;
				        }
				    } while (elem = elem.offsetParent);
				   
				    return offsetLeft;
				}
				
				else if (_position === "top") {
					
					offsetTop = 0;
				  
				    do {
				        if (!isNaN(elem.offsetTop)) {
				          offsetTop += elem.offsetTop;
				        }
				    } while (elem = elem.offsetParent);
				    
				    return offsetTop;
				}
			}
		}
		
		else {
			throw new Error("offset() position must be a string: acceptable values are 'left' and 'top'.");
		}
	};

/**
 * prepend()
 *
 * Inserts a new element or content to the front of the target's childNode list
 * New content can be either HTML input as a string or existing DOM elements
 *
 * Parameter:
 * -prependElement
 */
	
	$.fn.prepend = function(_prependElement) {
		
		var dom, i;
		
		this.init(function() {
			
			if (typeof _prependElement === "string") {
				
				if (_prependElement.charAt(0) === "<" && _prependElement.charAt(_prependElement.length - 1) === ">" && _prependElement.length >= 3) {
					this.insertAdjacentHTML("afterbegin", _prependElement);
				}
				
				else {
					
					dom = document.querySelectorAll(_prependElement);
					
					for (i = 0; i < dom.length; i++) {
						this.insertBefore(dom[i], this.firstChild);
					}
					
				}
				
			}
			
			else {
				this.insertBefore(_prependElement, this.firstChild);
			}
			
		});
		
		return this;
	};

/**
 * ready() / load()
 *
 * Ready: triggers when the DOM structure of the selected element is ready
 * Load: triggers when the full DOM content of the selected element is loaded
 *
 * Parameter:
 * -callback
 */
	
	// DOM structure ready
	//
	$.fn.ready = function(_callback) {
		
		this.init(function() {
			this.addEventListener("DOMContentLoaded", _callback, false);
		});
		
		return this;
	};
	
	// DOM structure and content fully loaded
	//
	$.fn.load = function(_callback) {
		
		this.init(function() {
			this.addEventListener("load", _callback, false);
		});
		
		return this;
	};

/**
 * remove()
 *
 * Appends the specified child element from the current object if the target is specified
 * If no target is specified, the parent of the current node will remove the node from the DOM
 *
 * Parameter: (optional)
 * -target
 */
	
	$.fn.remove = function(_target) {
		
		var elems, parents, i, j;
		
		if (_target) {
			
			elems = document.querySelectorAll(_target);
			parents = this.set;
			
			for (i = 0; i < parents.length; i++) {
				for (j = 0; j < elems.length; j++) {
					parents[i].removeChild(elems[j]);
				}
			}
			
		}
		
		else {
			for (i = 0; i < this.set["length"]; i++) {
				this.set[i].parentNode.removeChild(this.set[i]);
			}
		}
		
		return this;
	};

/**
 * replaceWith()
 * 
 * Replaces the selected element contents with the specified content
 *
 * Parameter:
 * -content
 */
	
	$.fn.replaceWith = function(_content) {
		
		this.init(function() {
			if (_content) this.outerHTML = _content;
		});
		
		return this;
 	};
 
/**
 * resize()
 * 
 * Captures the native "onresize" event and executes a function each time the event triggers
 * 
 * Parameter:
 * -callback
 */
	
	$.fn.resize = function(_callback) {
	
		this.init(function() {
			
			$(this).on("resize", function() {
				_callback();
			});
			
		});
		
		return this;
 	};
 
/**
 * scroll()
 * 
 * Captures the native "onscroll" event and executes a function each time the event triggers
 * 
 * Parameter:
 * -callback
 */
	
	$.fn.scroll = function(_callback) {
		
		this.init(function() {
			
			$(this).on("scroll", function() {
				_callback();
			});
			
		});
		
		return this;
 	};
 
/**
 * scrollTop()
 * 
 * Returns the pageYOffset of the given scrollable element if the "top" argument is not supplied.
 * Scrolls the element to a specific pixel value if the "top" argument is supplied.
 * 
 * Parameter: (optional)
 * -top (number; document top position)
 */
 	
 	$.fn.scrollTop = function(_top) {
		
		var topOffset;
		
		this.init(function() {
			
			if (this === window) {
			
				if (typeof _top === "number") {
					this.scrollTo(0, _top);
				}
				
				else {
					topOffset = this.pageYOffset;
				}
			
			}
			
			else {
				
				if (typeof _top === "number") {
					this.scrollTop = _top;
				}
				
				else {
					topOffset = this.scrollTop;
				}
				
			}
			
		});
		
		return (typeof _top === "number") ? this : topOffset;
 	};
 
/**
 * trigger()
 * 
 * Dispatches custom event listeners
 * 
 * Parameter:
 * -event
 */
	
	$.fn.trigger = function(_event) {
			
		var customEvent = new Event(_event);
		
		this.init(function() {
			this.dispatchEvent(customEvent);
		});
		
		return this;
 	};
 
/**
 * val() / getVal() / removeVal()
 *
 * val(): Assigns an arbitrary value (defined by the developer) to a specified element
 * getVal(): Returns the arbitrary value defined by val()
 * removeVal(): Removes the arbitrary value defined by val()
 * 
 * Parameters:
 * -valueName (defined by the developer)
 * -valueContent (specified in the .val() method only)
 */
	
	// Set the arbitrary value
	//
	$.fn.val = function(_valueName, _valueContent) {
		
		this.init(function() {
			$(this).attr("data-value-" + _valueName, _valueContent);
		});
		
		return this;
	};
	
	// Call the arbitrary value
	//
	$.fn.getVal = function(_valueName) {
		
		var elemValue;
		
		this.init(function() {
			elemValue = $(this).attr("data-value-" + _valueName);
		});
		
		return elemValue;
	};
	
	// Remove the arbitrary value
	//
	$.fn.removeVal = function(_valueName) {
		
		this.init(function() {
			$(this).removeAttr("data-value-" + _valueName);
		});
		
		return this;
	};

/**
 * wrap() / wrapInner()
 * 
 * Wraps the outer/innerHTML of the selected element(s) within the specified structure
 *
 * Parameter:
 * -structure
 */
	
	$.fn.wrap = function(_structure) {
		
		var contents, wrap;
		
		this.init(function() {
			
			if (typeof _structure === "string") {
				
				contents = this.outerHTML;
				wrap = _structure;
				
				this.outerHTML = wrap + contents;
				
			}
			
			else {
				throw new Error("wrap() structure must be specified as a string.");
			}
			
		});
		
		return this;
 	};
	
	$.fn.wrapInner = function(_structure) {
		
		var contents, wrap;
		
		this.init(function() {
			
			if (typeof _structure === "string") {
				
				contents = $(this).html();
				wrap = _structure;
				
				$(this).html(wrap + contents);
				
			}
			
			else {
				throw new Error("wrapInner() structure must be specified as a string.");
			}
			
		});
		
		return this;
 	};
 
	return w.Grindstone = w.$ = $;
 	
})(window, document);