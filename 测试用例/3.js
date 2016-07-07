function JSLazyLoading(custom, pluginFolderURL) {
	
	"use strict";
	
	pluginFolderURL = pluginFolderURL || function() {
		for (var i=0, scripts = document.getElementsByTagName('script'); i < scripts.length; i++) {
			var source = scripts[i].getAttribute('src');
			if (source) {
				var pos = source.search(/\/jslazyloading(?:\.min)?\.js(\?.*)?$/i);
				if (pos !== -1) {
					return source.substr(0, pos);		
				}
			}
		}
		return '';
	}();
	
	var params = {
	
		docReady: true,
	
		dataAttribute: "data-src",
		
		multiServing: false,
	
		multiServingType: "density",
	
		multiServingBreakpoints: {
		
		},
	
		sequentialLoading: null,
	
		placeholder: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
	
		loaderImage: pluginFolderURL + "/loader.gif",
	
		backgroundColor: null,
	
		fadeInEffect: true,
	
		fadeInDuration: 400,
	
		fadeInPreserveOpacity: true,
	
		softMode: false,

		ajaxListener: false,
		
		limit: 0,
	
		rectangularScope: false,
		
		rangeY: 0,
	
		rangeX: 0
		
	};
	

	if (typeof custom === 'object') {
		for (var i in custom) {
			params[i] = typeof(custom[i]) !== 'string' ? custom[i] : (Number(custom[i]) || custom[i]);
		}
	}
	
	this.started;
	
	var	win = window, doc = win.document, images, root = doc.documentElement, sequentialLoadingTimeout, ajaxListenerInterval, 
		_this = this, match, remainder = 0, containerWidth, containerHeight, widthAttr = "width", heightAttr = "height", cssText = "";
		
	
	if ( match = navigator.userAgent.match(/(Chrome)|(?:(MSIE)|(iP(?:hone|od|ad).+?OS)) (\d+)/) ) {
		if (match[1]) {
			var is_chromium = true;
		} else if (match[2]) {
			var IE_below_9 = match[4] < 9,
				IE_below_8 = match[4] < 8;
		} else if (match[3]) {
			var IOS_below_5 = match[4] < 5;
		}
	}
	
	function log(e) {
		if (win.console && typeof console.log === 'function') {
			console.log(e);
		}
	}
	
	function search(callback, attribute) {
		for (var i=0, source, attribute = attribute || params.dataAttribute, collection = doc.images, len = collection.length; i<len; i++) {
			if (source = collection[i].getAttribute(attribute)) {
				callback(collection[i], i, source);
			}
		}
	}
	
	function some(array, callback) {
		try {
			for (var i=0, len = array.length; i<len; i++) {
				if ( array[i] && callback(array[i], i) ) {
					return true;
				}
			}
		} catch(e) {
			log(e);
		}
	}
	
	function forEach(array, callback, convert) {
		if (convert && typeof array === 'string') {
			array = [array];
		}
		for (var i=0, len=array.length; i<len; i++) {
			if (array[i]) {
				callback(array[i], i);
			}
		}
	}
	
	
	if (IE_below_9) {
		var addListener = function(element, event, handler) {
			element.attachEvent("on"+event, handler);
		},
		removeListener = function(element, event, handler) {
			element.detachEvent("on"+event, handler);
		},
		docReady = function(handler) {
			try {
				root.doScroll("left"); 
				handler();
			}
			catch(e) {
				setTimeout(function(){ 
					docReady(handler);
				}, 10);
			}
		};
		if (IE_below_8) {
		
			widthAttr = "data-width"; heightAttr = "data-height";
			
			params.placeholder = pluginFolderURL + "/blank.gif";
		}
	} else {
		addListener = function(element, event, handler) {
			element.addEventListener(event, handler, false);
		};
		removeListener = function(element, event, handler) {
			element.removeEventListener(event, handler, false);
		};
		docReady = function(handler) {
			doc.readyState === "complete" ? handler() : doc.addEventListener("DOMContentLoaded", handler, false);
		};
	}
	
	
	if (!root.getBoundingClientRect || IOS_below_5) {
	
		var getScrollOffsets = function() {
			return {
				top: win.pageYOffset || root.scrollTop || doc.body.scrollTop,
				left: win.pageXOffset || root.scrollLeft || doc.body.scrollLeft
			};
		},
		
		inViewPort = params.rectangularScope ? function(x, offsets) {
			var top = 0, left = 0, 
				width = x.offsetWidth, 
				height = x.offsetHeight;
			do {
				top += x.offsetTop  || 0;
				left += x.offsetLeft || 0;
			} while (x = x.offsetParent);
			return (top <= containerHeight + offsets.top + params.rangeY && 
					top + height >= offsets.top - params.rangeY && 
					left <= containerWidth + offsets.left + params.rangeX && 
					left + width >= offsets.left - params.rangeX);
		} : function(x, offsets) {
			var top = 0;
			do {
				top += x.offsetTop || 0;
			} while (x = x.offsetParent);
			return (top <= containerHeight + offsets.top);
		}, 
		
		getRelCoords = function(x) {
			var top  = root.clientTop || doc.body.clientTop, 
				left = root.clientLeft || doc.body.clientLeft;
			do {
				top  += x.offsetTop  || 0;
				left += x.offsetLeft || 0;
			} while (x = x.offsetParent);
			return {
				top: top,
				left: left
			};
		};
		
	} else {
		
		inViewPort = params.rectangularScope ? function(img) {
			var rect = img.getBoundingClientRect();
			return (rect.top <= containerHeight + params.rangeY && 
					rect.bottom >= 0 - params.rangeY && 
					rect.left <= containerWidth + params.rangeX && 
					rect.right >= 0 - params.rangeX);
		} : function(img) {
			return img.getBoundingClientRect().top <= containerHeight + params.rangeY;
		},
		
		getRelCoords = function(img) {
			return img.getBoundingClientRect();
		};
		
	}
	
	
	var getSource = function(img) {
		return img.getAttribute(params.dataAttribute);
	};

	if (params.multiServing && params.multiServingBreakpoints instanceof Object) {
		
		params.multiServing = typeof params.multiServing === 'boolean' ? 'manual' : params.multiServing.toLowerCase();
		
		var getAttributes = function(callback) {
				var attrs = new Array(), result;
				for (var breakpointName in params.multiServingBreakpoints) {
					if (result = callback(breakpointName, params.multiServingBreakpoints[breakpointName].toLowerCase())) {
						attrs.push(result);
					}
				}
				if (attrs.length) {
					attrs.sort(function(a, b) {
						return a.value - b.value;
					});
					for (var i=0; i<attrs.length; i++) {
						multiServingSrcParams[i] = Math.abs(attrs[i].value);
						attrs[i] = attrs[i].name;
						if (params.multiServing !== 'manual') {
							attrs[i] = attrs[i].substr(1);
						}
					}
				}
				return attrs;
			},
		
		multiServingSrcParams = new Array(),
		supportsMinResolution = win.matchMedia && win.matchMedia("(min-resolution: 1dpi)").matches,
		
		multiServingAttributes = params.multiServingType.toLowerCase() === 'density' ? getAttributes(function(name, value) {
			if (typeof value === 'string' && value.substr(-3) === 'dpi') {
				delete params.multiServingBreakpoints[name];
				value = parseInt(value);
				if ((supportsMinResolution && win.matchMedia("(min-resolution: " + value + "dpi)").matches) || 
					(!supportsMinResolution && win.devicePixelRatio >= value / 96)) {
					return {name: name, value: -value};
				}
			}
		}) : getAttributes(function(name, value) {
			var width = parseInt(value);
			if (typeof value === 'string' && value.substr(-2) === 'px' && screen.width <= width) {
				return {name: name, value: width};
			}
		});
		
	}
	
	
	if (params.fadeInEffect) {
	
		var transition = function() {
			for (var i=0; i<arguments.length; i++) {
				if (arguments[i] in root.style) { 
					return arguments[i];
				}
			}
		}('transition', '-webkit-transition', '-moz-transition', '-o-transition');
		
	
		if ( transition && ( params.fadeInEffect !== "desktop" || ( !('ontouchstart' in win || 'onmsgesturechange' in win) || win.screen.width > 768 ) ) ) {
	
			if (is_chromium) {
				var style = doc.createElement("style");
					style.type = "text/css";
					style.appendChild( doc.createTextNode("img {-webkit-transform: translateZ(0)}") );
				doc.getElementsByTagName("head")[0].appendChild(style);
			}
		} else {
			params.fadeInEffect = false;
		}
		
	}
	

	if (params.backgroundColor) {
		cssText += "; background-color: " + params.backgroundColor + " !important";
	}
	
	if (params.loaderImage) {
		cssText += "; background-image: url('" + params.loaderImage + "') !important; background-position: center center; background-repeat: no-repeat !important";
	}
	
	
	var setCSSText = params.softMode ? function(img) {
		
		var width = img.getAttribute(widthAttr), 
			height = img.getAttribute(heightAttr);
		if (width && height) {
			// Find and store an image proportion.
			img.jsllProportion = width / height;
		}
		img.jsllCSSText = img.getAttribute("style") || '';
		img.style.cssText += cssText + "; height: " + (img.offsetWidth / img.jsllProportion) + "px";
		
	} : cssText ? function(img) {
		
		img.jsllCSSText = img.getAttribute("style") || '';
		img.style.cssText += "; " + cssText;
		
	} : false;
	
	function getContainerSize() {
		var oldContainerWidth = containerWidth, 
			oldContainerHeight = containerHeight;
		containerWidth = win.innerWidth || root.clientWidth || doc.body.clientWidth;
		containerHeight = win.innerHeight || root.clientHeight || doc.body.clientHeight;
		return oldContainerWidth !== containerWidth || oldContainerHeight !== containerHeight;
	}
	

	function update() {
		if ( getContainerSize() ) {
			if (params.softMode) {
				forEach(images, function(img) {
					if (img.jsllProportion) {
						img.style.height = img.offsetWidth / img.jsllProportion + "px";
					}
				});
			}
			arrange();
		} else {
			examine();
		}
	}
	
	
	function arrange() {
		try {
			images.sort(function(a, b) {
				var A = getRelCoords(a), 
					B = getRelCoords(b);
				if (A.top === B.top) {
					return A.left - B.left;
				} else {
					return A.top - B.top;
				}
			});
			examine();
		} catch(e) {
			log(e);
		}
	}
	

	function appear(img, fadeIn) {
		var source = getSource(img);
		if (source) {
			img.removeAttribute(params.dataAttribute);
			if (fadeIn) {
				var mirror = img.cloneNode(),
					cssIni = img.jsllCSSText + "; ",
					oncomplete = function() {
						forEach(['load', 'error'], function(event) {
							removeListener(img, event, oncomplete);
						});
						if (params.fadeInPreserveOpacity) {
							var opacityLimit  = getComputedStyle(mirror, '').opacity,
								effectDuration = params.fadeInDuration * 1 / opacityLimit;
						} else {
							opacityLimit  = 1;
							effectDuration = params.fadeInDuration;
						}
						img.style.cssText = cssIni + "opacity: 0 !important; ";
						mirror.parentNode.replaceChild(img, mirror);
						setTimeout(function() {
							img.style.cssText = cssIni + transition + ": opacity " + effectDuration + "ms ease-in !important; opacity: " + opacityLimit + " !important; ";
							setTimeout(function() {
								img.style.cssText = cssIni;
							}, effectDuration + 100);
						}, 16);
					};
				img.parentNode.replaceChild(mirror, img);
			} else if (cssText) {
				oncomplete = function() {
					forEach(['load', 'error'], function(event) {
						removeListener(img, event, oncomplete);
					});
					img.style.cssText = img.jsllCSSText;
				};
			}
			if (oncomplete) {
				forEach(['load', 'error'], function(event) {
					addListener(img, event, oncomplete);
				});
			}
			img.src = source;
			remainder--;
		}
	}	
	

	function examine(e, _break) {
		var last, cnt = 0;
		if (getScrollOffsets) {
			var offsets = getScrollOffsets();
		}
		_break = _break || !params.rectangularScope;
		some(images, function(img, i) {
			if ( inViewPort(img, offsets) ) {
				appear((last = img), params.fadeInEffect);
				delete images[i];
			} else if (cnt++ >= params.limit) {
				if (last) {
					forEach(['load', 'error'], function(event) {
						addListener(last, event, function() {
							examine(null, true);
						});
					});
					return true;
				}
				return _break;
			}
		});
	}

	
	function sequentialLoading() {
		clearTimeout(sequentialLoadingTimeout);
		some(images, function(img, i) {
			forEach(['load', 'error'], function(event) {
				addListener(img, event, function() {
					sequentialLoadingTimeout = setTimeout(sequentialLoading, params.sequentialLoading);
				});
			});
			appear(img, false);
			return delete images[i];
		});
	}
	
	
	this.refresh = function() {
		
		if (this.started) {
			
			images = new Array();
			
			if (multiServingAttributes && multiServingAttributes.length) {
				
				if (params.multiServing !== 'manual') {
				
					var imageFractions = new Array(),
						collection = new Array(),
						analogues = 'analogues=' + multiServingAttributes.join('+') + '&srcp=' + multiServingSrcParams.join('+'),
						rex = new RegExp('^(?:(?:https?:)?//' + location.host + '/+|/+)([^\?]+?\\.[a-zA-Z]+)$', 'gm'),
						handler = params.multiServing === 'php' ? 'handler.php' : 'apache';
				
					search(function(img, i, url) {
						imageFractions.push(url);
						collection.push(img);
					});
					
					if (imageFractions.length) {
						imageFractions = imageFractions.join('\n').replace(rex, pluginFolderURL + "/mirror/" + handler + "/$1?" + analogues).split('\n');
						forEach(collection, function(img, i) {
							img.setAttribute(params.dataAttribute, imageFractions[i]);
						});
					}
					
				} else {
					
					search(function(img, i, source) {
						img.setAttribute(params.dataAttribute, source);
					}, multiServingAttributes[0]);
					
				}
				
			}
			
			getContainerSize();
			
			search(function(img) {
				images.push(img);
				if (params.placeholder) {
					img.src = params.placeholder;
				}
				if (setCSSText && !img.jsllCSSText) {
					setCSSText(img);
				}
			});
			
			remainder = images.length;
			
			if (typeof params.sequentialLoading === "number") {
				sequentialLoading();
			}
			
			if (doc.readyState !== "complete") {
				addListener(win, 'load', arrange);
				examine();
			} else {
				arrange();
			}
			
		}
		
		return true;
		
	};
	
	
	this.abort = function() {
		
		this.started = false;
		
		removeListener(win, 'scroll', examine);
		removeListener(win, 'resize', update);
		
		if (ajaxListenerInterval) {
			clearInterval(ajaxListenerInterval);
			JSLazyLoading.ajaxListenerEnabled = false;
		}
		
		forEach(images, appear);
		
		return true;
		
	};
	
	
	this.start = function() {
		
		if (!this.started) {
			
			if (win.operamini) {
		
				this.abort();
			
			} else {
				
				this.started = true;
				this.refresh();
				
				addListener(win, 'scroll', examine);
				addListener(win, 'resize', update);
				
				if (params.ajaxListener && !JSLazyLoading.ajaxListenerEnabled) {
					JSLazyLoading.ajaxListenerEnabled = true;
					ajaxListenerInterval = setInterval(function() {
						var cnt = 0;
						search(function(img) {
							cnt++;
						});
						if (cnt !== remainder) {
							_this.refresh();
						}
					}, 100);
				}
				
			}
			
		}
		
		return true;
		
	};
	
	params.docReady ? docReady(function() {
		_this.start.call(_this);
	}) : this.start();

}