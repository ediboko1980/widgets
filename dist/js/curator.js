;(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		// Cheeky wrapper to add root to the factory call
		var factoryWrap = function () {
			var argsCopy = [].slice.call(arguments);
			argsCopy.unshift(root);
			return factory.apply(this, argsCopy);
		};
		define(['jquery', 'curator'], factoryWrap);
	} else if (typeof exports === 'object') {
		module.exports = factory(root, require('jquery'));
	} else {
		root.Curator = factory(root, root.jQuery || root.Zepto);
	}
}(this, function(root, $) {

	if ($ == undefined) {
		window.alert ("jQuery not found\n\nThe Curator Widget is running in dependency mode - this requires jQuery of Zepto. Try disabling DEPENDENCY MODE in the Admin on the Publish page." );
		return false;
	}

	'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Debouncing function from John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
// Copy pasted from http://paulirish.com/2009/throttled-smartresize-jquery-event-handler/

(function ($, sr) {
    var debounce = function debounce(func, threshold, execAsap) {
        var timeout;
        return function debounced() {
            var obj = this,
                args = arguments;

            function delayed() {
                if (!execAsap) func.apply(obj, args);
                timeout = null;
            }
            if (timeout) clearTimeout(timeout);else if (execAsap) func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 150);
        };
    };
    $.fn[sr] = function (fn) {
        return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
    };
})($, 'smartresize');

/**
 * Based on the awesome jQuery Grid-A-Licious(tm)
 *
 * Terms of Use - jQuery Grid-A-Licious(tm)
 * under the MIT (http://www.opensource.org/licenses/mit-license.php) License.
 *
 * Original Version Copyright 2008-2012 Andreas Pihlström (Suprb). All rights reserved.
 * (http://suprb.com/apps/gridalicious/)
 *
 */

(function ($) {

    var defaultSettings = {
        selector: '.item',
        width: 225,
        gutter: 20,
        animate: false,
        animationOptions: {
            speed: 200,
            duration: 300,
            effect: 'fadeInOnAppear',
            queue: true,
            complete: function complete() {}
        }
    };

    var WaterfallRender = function () {
        function WaterfallRender(options, element) {
            _classCallCheck(this, WaterfallRender);

            this.element = $(element);
            this._init(options);
        }

        _createClass(WaterfallRender, [{
            key: '_init',
            value: function _init(options) {
                var container = this;
                this.name = this._setName(5);
                this.gridArr = [];
                this.gridArrAppend = [];
                this.gridArrPrepend = [];
                this.setArr = false;
                this.setGrid = false;
                this.cols = 0;
                this.itemCount = 0;
                this.isPrepending = false;
                this.appendCount = 0;
                this.resetCount = true;
                this.ifCallback = true;
                this.box = this.element;
                this.boxWidth = this.box.width();
                this.options = $.extend(true, {}, defaultSettings, options);
                this.gridArr = $.makeArray(this.box.find(this.options.selector));
                this.isResizing = false;
                this.w = 0;
                this.boxArr = [];

                // this.offscreenRender = $('<div class="grid-rendered"></div>').appendTo('body');

                // build columns
                this._setCols();
                // build grid
                this._renderGrid('append');
                // add class 'gridalicious' to container
                $(this.box).addClass('gridalicious');
                // add smartresize
                $(window).smartresize(function () {
                    container.resize();
                });
            }
        }, {
            key: '_setName',
            value: function _setName(length, current) {
                current = current ? current : '';
                return length ? this._setName(--length, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 60)) + current) : current;
            }
        }, {
            key: '_setCols',
            value: function _setCols() {
                // calculate columns
                this.cols = Math.floor(this.box.width() / this.options.width);
                //If Cols lower than 1, the grid disappears
                if (this.cols < 1) {
                    this.cols = 1;
                }
                diff = (this.box.width() - this.cols * this.options.width - this.options.gutter) / this.cols;
                w = (this.options.width + diff) / this.box.width() * 100;
                this.w = w;
                this.colHeights = new Array(this.cols);
                this.colHeights.fill(0);
                this.colItems = new Array(this.cols);
                this.colItems.fill([]);

                // add columns to box
                for (var i = 0; i < this.cols; i++) {
                    var div = $('<div></div>').addClass('galcolumn').attr('id', 'item' + i + this.name).css({
                        'width': w + '%',
                        'paddingLeft': this.options.gutter,
                        'paddingBottom': this.options.gutter,
                        'float': 'left',
                        '-webkit-box-sizing': 'border-box',
                        '-moz-box-sizing': 'border-box',
                        '-o-box-sizing': 'border-box',
                        'box-sizing': 'border-box'
                    });
                    this.box.append(div);
                }
            }
        }, {
            key: '_renderGrid',
            value: function _renderGrid(method, arr, count, prepArray) {
                var items = [];
                var boxes = [];
                var prependArray = [];
                var itemCount = 0;
                var appendCount = this.appendCount;
                var gutter = this.options.gutter;
                var cols = this.cols;
                var name = this.name;
                var i = 0;
                var w = $('.galcolumn').width();

                // if arr
                if (arr) {
                    boxes = arr;
                    // if append
                    if (method == "append") {
                        // get total of items to append
                        appendCount += count;
                        // set itemCount to last count of appened items
                        itemCount = this.appendCount;
                    }
                    // if prepend
                    if (method == "prepend") {
                        // set itemCount
                        this.isPrepending = true;
                        itemCount = Math.round(count % cols);
                        if (itemCount <= 0) itemCount = cols;
                    }
                    // called by _updateAfterPrepend()
                    if (method == "renderAfterPrepend") {
                        // get total of items that was previously prepended
                        appendCount += count;
                        // set itemCount by counting previous prepended items
                        itemCount = count;
                    }
                } else {
                    boxes = this.gridArr;
                    appendCount = $(this.gridArr).size();
                }

                // push out the items to the columns
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = boxes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var item = _step.value;

                        var width = '100%';

                        // if you want something not to be "responsive", add the class "not-responsive" to the selector container
                        if (item.hasClass('not-responsive')) {
                            width = 'auto';
                        }

                        item.css({
                            'zoom': '1',
                            'filter': 'alpha(opacity=0)',
                            'opacity': '0'
                        });

                        // find shortest col
                        var shortestCol = 0;
                        for (var _i = 1; _i < this.colHeights.length; _i++) {
                            if (this.colHeights[_i] < this.colHeights[shortestCol]) {
                                shortestCol = _i;
                            }
                        }

                        // prepend or append to shortest column
                        if (method == 'prepend') {
                            $("#item" + shortestCol + name).prepend(item);
                            items.push(item);
                        } else {
                            $("#item" + shortestCol + name).append(item);
                            items.push(item);
                            if (appendCount >= cols) {
                                appendCount = appendCount - cols;
                            }
                        }

                        // update col heights
                        this.colItems[shortestCol].push(item);
                        this.colHeights[shortestCol] += item.height();
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                this.appendCount = appendCount;

                if (method == "append" || method == "prepend") {
                    if (method == "prepend") {
                        // render old items and reverse the new items
                        this._updateAfterPrepend(this.gridArr, boxes);
                    }
                    this._renderItem(items);
                    this.isPrepending = false;
                } else {
                    this._renderItem(this.gridArr);
                }
            }
        }, {
            key: '_collectItems',
            value: function _collectItems() {
                var collection = [];
                $(this.box).find(this.options.selector).each(function (i) {
                    collection.push($(this));
                });
                return collection;
            }
        }, {
            key: '_renderItem',
            value: function _renderItem(items) {

                var speed = this.options.animationOptions.speed;
                var effect = this.options.animationOptions.effect;
                var duration = this.options.animationOptions.duration;
                var queue = this.options.animationOptions.queue;
                var animate = this.options.animate;
                var complete = this.options.animationOptions.complete;

                var i = 0;
                var t = 0;

                // animate
                if (animate === true && !this.isResizing) {

                    // fadeInOnAppear
                    if (queue === true && effect == "fadeInOnAppear") {
                        if (this.isPrepending) items.reverse();
                        $.each(items, function (index, value) {
                            setTimeout(function () {
                                $(value).animate({
                                    opacity: '1.0'
                                }, duration);
                                t++;
                                if (t == items.length) {
                                    complete.call(undefined, items);
                                }
                            }, i * speed);
                            i++;
                        });
                    } else if (queue === false && effect == "fadeInOnAppear") {
                        if (this.isPrepending) items.reverse();
                        $.each(items, function (index, value) {
                            $(value).animate({
                                opacity: '1.0'
                            }, duration);
                            t++;
                            if (t == items.length) {
                                if (this.ifCallback) {
                                    complete.call(undefined, items);
                                }
                            }
                        });
                    }

                    // no effect but queued
                    if (queue === true && !effect) {
                        $.each(items, function (index, value) {
                            $(value).css({
                                'opacity': '1',
                                'filter': 'alpha(opacity=100)'
                            });
                            t++;
                            if (t == items.length) {
                                if (this.ifCallback) {
                                    complete.call(undefined, items);
                                }
                            }
                        });
                    }

                    // don not animate & no queue
                } else {
                    $.each(items, function (index, value) {
                        $(value).css({
                            'opacity': '1',
                            'filter': 'alpha(opacity=100)'
                        });
                    });
                    if (this.ifCallback) {
                        complete.call(items);
                    }
                }
            }
        }, {
            key: '_updateAfterPrepend',
            value: function _updateAfterPrepend(prevItems, newItems) {
                var gridArr = this.gridArr;
                // add new items to gridArr
                $.each(newItems, function (index, value) {
                    gridArr.unshift(value);
                });
                this.gridArr = gridArr;
            }
        }, {
            key: 'resize',
            value: function resize() {
                if (this.box.width() === this.boxWidth) {
                    return;
                }

                var newCols = Math.floor(this.box.width() / this.options.width);
                if (this.cols === newCols) {
                    // nothings changed yet
                    return;
                }

                // delete columns in box
                this.box.find($('.galcolumn')).remove();
                // build columns
                this._setCols();
                // build grid
                this.ifCallback = false;
                this.isResizing = true;
                this._renderGrid('append');
                this.ifCallback = true;
                this.isResizing = false;
                this.boxWidth = this.box.width();
            }
        }, {
            key: 'append',
            value: function append(items) {
                var gridArr = this.gridArr;
                var gridArrAppend = this.gridArrPrepend;
                $.each(items, function (index, value) {
                    gridArr.push(value);
                    gridArrAppend.push(value);
                });
                this._renderGrid('append', items, $(items).size());
            }
        }, {
            key: 'prepend',
            value: function prepend(items) {
                this.ifCallback = false;
                this._renderGrid('prepend', items, $(items).size());
                this.ifCallback = true;
            }
        }]);

        return WaterfallRender;
    }();

    $.fn.waterfall = function (options, e) {
        if (typeof options === 'string') {
            this.each(function () {
                var container = $.data(this, 'WaterfallRender');
                container[options].apply(container, [e]);
            });
        } else {
            this.each(function () {
                $.data(this, 'WaterfallRender', new WaterfallRender(options, this));
            });
        }
        return this;
    };
})($);

var Factory = function Factory() {};
var slice = Array.prototype.slice;

var augment = function augment(base, body) {
    var uber = Factory.prototype = typeof base === "function" ? base.prototype : base;
    var prototype = new Factory(),
        properties = body.apply(prototype, slice.call(arguments, 2).concat(uber));
    if ((typeof properties === 'undefined' ? 'undefined' : _typeof(properties)) === "object") for (var key in properties) {
        prototype[key] = properties[key];
    }if (!prototype.hasOwnProperty("constructor")) return prototype;
    var constructor = prototype.constructor;
    constructor.prototype = prototype;
    return constructor;
};

augment.defclass = function (prototype) {
    var constructor = prototype.constructor;
    constructor.prototype = prototype;
    return constructor;
};

augment.extend = function (base, body) {
    return augment(base, function (uber) {
        this.uber = uber;
        return body;
    });
};

// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed

(function () {
    var _tmplCache = {};

    var helpers = {
        networkIcon: function networkIcon() {
            return this.data.network_name.toLowerCase();
        },
        networkName: function networkName() {
            return this.data.network_name.toLowerCase();
        },
        userUrl: function userUrl() {
            if (this.data.user_url && this.data.user_url != '') {
                return this.data.user_url;
            }
            if (this.data.originator_user_url && this.data.originator_user_url != '') {
                return this.data.originator_user_url;
            }
            if (this.data.userUrl && this.data.userUrl != '') {
                return this.data.userUrl;
            }

            var netId = this.data.network_id + '';
            if (netId === '1') {
                return 'http://twitter.com/' + this.data.user_screen_name;
            } else if (netId === '2') {
                return 'http://instagram.com/' + this.data.user_screen_name;
            } else if (netId === '3') {
                return 'http://facebook.com/' + this.data.user_screen_name;
            }

            return '#';
        },
        parseText: function parseText(s) {
            if (this.data.is_html) {
                return s;
            } else {
                if (this.data.network_name === 'Twitter') {
                    s = Curator.StringUtils.linksToHref(s);
                    s = Curator.StringUtils.twitterLinks(s);
                } else if (this.data.network_name === 'Instagram') {
                    s = Curator.StringUtils.linksToHref(s);
                    s = Curator.StringUtils.instagramLinks(s);
                } else if (this.data.network_name === 'Facebook') {
                    s = Curator.StringUtils.linksToHref(s);
                    s = Curator.StringUtils.facebookLinks(s);
                } else {
                    s = Curator.StringUtils.linksToHref(s);
                }

                return helpers.nl2br(s);
            }
        },
        nl2br: function nl2br(s) {
            s = s.trim();
            s = s.replace(/(?:\r\n|\r|\n)/g, '<br />');

            return s;
        },
        contentImageClasses: function contentImageClasses() {
            return this.data.image ? 'crt-post-has-image' : 'crt-post-content-image-hidden';
        },
        contentTextClasses: function contentTextClasses() {
            return this.data.text ? 'crt-post-has-text' : 'crt-post-content-text-hidden';
        },
        fuzzyDate: function fuzzyDate(dateString) {
            var date = Date.parse(dateString + ' UTC');
            var delta = Math.round((new Date() - date) / 1000);

            var minute = 60,
                hour = minute * 60,
                day = hour * 24,
                week = day * 7,
                month = day * 30;

            var fuzzy;

            if (delta < 30) {
                fuzzy = 'Just now';
            } else if (delta < minute) {
                fuzzy = delta + ' seconds ago';
            } else if (delta < 2 * minute) {
                fuzzy = 'a minute ago.';
            } else if (delta < hour) {
                fuzzy = Math.floor(delta / minute) + ' minutes ago';
            } else if (Math.floor(delta / hour) == 1) {
                fuzzy = '1 hour ago.';
            } else if (delta < day) {
                fuzzy = Math.floor(delta / hour) + ' hours ago';
            } else if (delta < day * 2) {
                fuzzy = 'Yesterday';
            } else if (delta < week) {
                fuzzy = 'This week';
            } else if (delta < week * 2) {
                fuzzy = 'Last week';
            } else if (delta < month) {
                fuzzy = 'This month';
            } else {
                fuzzy = date;
            }

            return fuzzy;
        },
        prettyDate: function prettyDate(time) {
            var date = Curator.DateUtils.dateFromString(time);

            var diff = (new Date().getTime() - date.getTime()) / 1000;
            var day_diff = Math.floor(diff / 86400);
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate();

            if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) return year.toString() + '-' + (month < 10 ? '0' + month.toString() : month.toString()) + '-' + (day < 10 ? '0' + day.toString() : day.toString());

            var r = day_diff == 0 && (diff < 60 && "just now" || diff < 120 && "1 minute ago" || diff < 3600 && Math.floor(diff / 60) + " minutes ago" || diff < 7200 && "1 hour ago" || diff < 86400 && Math.floor(diff / 3600) + " hours ago") || day_diff == 1 && "Yesterday" || day_diff < 7 && day_diff + " days ago" || day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago";
            return r;
        }
    };

    root.parseTemplate = function (str, data) {
        /// <summary>
        /// Client side template parser that uses &lt;#= #&gt; and &lt;# code #&gt; expressions.
        /// and # # code blocks for template expansion.
        /// NOTE: chokes on single quotes in the document in some situations
        ///       use &amp;rsquo; for literals in text and avoid any single quote
        ///       attribute delimiters.
        /// </summary>
        /// <param name="str" type="string">The text of the template to expand</param>
        /// <param name="data" type="var">
        /// Any data that is to be merged. Pass an object and
        /// that object's properties are visible as variables.
        /// </param>
        /// <returns type="string" />
        var err = "";
        try {
            var func = _tmplCache[str];
            if (!func) {
                var strComp = str.replace(/[\r\t\n]/g, " ").replace(/'(?=[^%]*%>)/g, "\t").split("'").join("\\'").split("\t").join("'").replace(/<%=(.+?)%>/g, "',$1,'").split("<%").join("');").split("%>").join("p.push('");
                var strFunc = "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + strComp + "');}return p.join('');";
                func = new Function("obj", strFunc); // jshint ignore:line
                _tmplCache[str] = func;
            }
            helpers.data = data;
            return func.call(helpers, data);
        } catch (e) {
            window.console.log('Template parse error: ' + e.message);
            err = e.message;
        }
        return " # ERROR: " + err + " # ";
    };
})();
// jQuery.XDomainRequest.js
// Author: Jason Moon - @JSONMOON
// IE8+
// https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest/blob/master/jQuery.XDomainRequest.js


if (!$.support.cors && $.ajaxTransport && window.XDomainRequest) {
    var httpRegEx = /^https?:\/\//i;
    var getOrPostRegEx = /^get|post$/i;
    var sameSchemeRegEx = new RegExp('^' + window.location.protocol, 'i');
    var htmlRegEx = /text\/html/i;
    var jsonRegEx = /\/json/i;
    var xmlRegEx = /\/xml/i;

    // ajaxTransport exists in jQuery 1.5+
    $.ajaxTransport('text html xml json', function (options, userOptions, jqXHR) {
        jqXHR = jqXHR;
        // XDomainRequests must be: asynchronous, GET or POST methods, HTTP or HTTPS protocol, and same scheme as calling page
        if (options.crossDomain && options.async && getOrPostRegEx.test(options.type) && httpRegEx.test(options.url) && sameSchemeRegEx.test(options.url)) {
            var xdr = null;
            var userType = (userOptions.dataType || '').toLowerCase();
            return {
                send: function send(headers, complete) {
                    xdr = new window.XDomainRequest();
                    if (/^\d+$/.test(userOptions.timeout)) {
                        xdr.timeout = userOptions.timeout;
                    }
                    xdr.ontimeout = function () {
                        complete(500, 'timeout');
                    };
                    xdr.onload = function () {
                        var allResponseHeaders = 'Content-Length: ' + xdr.responseText.length + '\r\nContent-Type: ' + xdr.contentType;
                        var status = {
                            code: 200,
                            message: 'success'
                        };
                        var responses = {
                            text: xdr.responseText
                        };
                        try {
                            if (userType === 'html' || htmlRegEx.test(xdr.contentType)) {
                                responses.html = xdr.responseText;
                            } else if (userType === 'json' || userType !== 'text' && jsonRegEx.test(xdr.contentType)) {
                                try {
                                    responses.json = $.parseJSON(xdr.responseText);
                                } catch (e) {
                                    status.code = 500;
                                    status.message = 'parseerror';
                                    //throw 'Invalid JSON: ' + xdr.responseText;
                                }
                            } else if (userType === 'xml' || userType !== 'text' && xmlRegEx.test(xdr.contentType)) {
                                var doc = new window.ActiveXObject('Microsoft.XMLDOM');
                                doc.async = false;
                                try {
                                    doc.loadXML(xdr.responseText);
                                } catch (e) {
                                    doc = undefined;
                                }
                                if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {
                                    status.code = 500;
                                    status.message = 'parseerror';
                                    throw 'Invalid XML: ' + xdr.responseText;
                                }
                                responses.xml = doc;
                            }
                        } catch (parseMessage) {
                            throw parseMessage;
                        } finally {
                            complete(status.code, status.message, responses, allResponseHeaders);
                        }
                    };
                    // set an empty handler for 'onprogress' so requests don't get aborted
                    xdr.onprogress = function () {};
                    xdr.onerror = function () {
                        complete(500, 'error', {
                            text: xdr.responseText
                        });
                    };
                    var postData = '';
                    if (userOptions.data) {
                        postData = $.type(userOptions.data) === 'string' ? userOptions.data : $.param(userOptions.data);
                    }
                    xdr.open(options.type, options.url);
                    xdr.send(postData);
                },
                abort: function abort() {
                    if (xdr) {
                        xdr.abort();
                    }
                }
            };
        }
    });
}
// Test $ exists

var Curator = {
    debug: false,
    SOURCE_TYPES: ['twitter', 'instagram'],

    log: function log(s) {

        if (window.console && Curator.debug) {
            window.console.log(s);
        }
    },

    alert: function alert(s) {
        if (window.alert) {
            window.alert(s);
        }
    },

    checkContainer: function checkContainer(container) {
        Curator.log("Curator->checkContainer: " + container);
        if ($(container).length === 0) {
            if (window.console) {
                window.console.log('Curator could not find the element ' + container + '. Please ensure this element existings in your HTML code. Exiting.');
            }
            return false;
        }
        return true;
    },

    checkPowered: function checkPowered(jQuerytag) {
        Curator.log("Curator->checkPowered");
        var h = jQuerytag.html();
        // Curator.log (h);
        if (h.indexOf('Curator') > 0) {
            return true;
        } else {
            Curator.alert('Container is missing Powered by Curator');
            return false;
        }
    },

    loadCSS: function loadCSS(config) {
        try {
            var sheet = Curator.createSheet(config);

            var headerBgs = '.crt-post .crt-post-header, .crt-post .crt-post-header .social-icon';
            var headerTexts = '.crt-post .crt-post-header, .crt-post .crt-post-share, .crt-post .crt-post-header .crt-post-name a, .crt-post .crt-post-share a, .crt-post .crt-post-header .social-icon i';
            var bodyBgs = '.crt-post';
            var bodyTexts = '.crt-post .crt-post-content-text';

            // add new rules
            Curator.addCSSRule(sheet, headerBgs, 'background-color:' + config.colours.headerBg);
            Curator.addCSSRule(sheet, headerTexts, 'color:' + config.colours.headerText);
            Curator.addCSSRule(sheet, bodyBgs, 'background-color:' + config.colours.bodyBg);
            Curator.addCSSRule(sheet, bodyTexts, 'color:' + config.colours.bodyText);
        } catch (err) {
            console.log('CURATOR UNABLE TO LOAD CSS');
            console.log(err.message);
        }
    },

    addCSSRule: function addCSSRule(sheet, selector, rules, index) {
        if ('insertRule' in sheet) {
            sheet.insertRule(selector + '{' + rules + '}', 0);
        } else if ('addRule' in sheet) {
            sheet.addRule(selector, rules);
        }
    },

    createSheet: function createSheet() {
        var style = document.createElement("style");
        // WebKit hack :(
        style.appendChild(document.createTextNode(""));
        document.head.appendChild(style);
        return style.sheet;
    },

    loadWidget: function loadWidget(config, template) {
        if (template) {
            Curator.Templates.postTemplate = template;
        }

        var ConstructorClass = window.Curator[config.type];
        window.curatorWidget = new ConstructorClass(config);
    },

    Templates: {},

    Config: {
        Defaults: {
            apiEndpoint: 'https://api.curator.io/v1',
            feedId: '',
            postsPerPage: 12,
            maxPosts: 0,
            debug: false,
            postTemplate: '#post-template',
            onPostsLoaded: function onPostsLoaded() {},
            filter: {
                show: false,
                label: 'Show:'
            }
        }
    },

    augment: augment
};

if ($ === undefined) {
    Curator.alert('Curator requires jQuery. \n\nPlease include jQuery in your HTML before the Curator widget script tag.\n\nVisit http://jquery.com/download/ to get the latest version');
}

var EventBus = function () {
    function EventBus() {
        _classCallCheck(this, EventBus);

        this.listeners = {};
    }

    _createClass(EventBus, [{
        key: 'on',
        value: function on(type, callback, scope) {
            var args = [];
            var numOfArgs = arguments.length;
            for (var i = 0; i < numOfArgs; i++) {
                args.push(arguments[i]);
            }
            args = args.length > 3 ? args.splice(3, args.length - 1) : [];
            if (typeof this.listeners[type] != "undefined") {
                this.listeners[type].push({ scope: scope, callback: callback, args: args });
            } else {
                this.listeners[type] = [{ scope: scope, callback: callback, args: args }];
            }
        }
    }, {
        key: 'off',
        value: function off(type, callback, scope) {
            if (typeof this.listeners[type] != "undefined") {
                var numOfCallbacks = this.listeners[type].length;
                var newArray = [];
                for (var i = 0; i < numOfCallbacks; i++) {
                    var listener = this.listeners[type][i];
                    if (listener.scope == scope && listener.callback == callback) {} else {
                        newArray.push(listener);
                    }
                }
                this.listeners[type] = newArray;
            }
        }
    }, {
        key: 'has',
        value: function has(type, callback, scope) {
            if (typeof this.listeners[type] != "undefined") {
                var numOfCallbacks = this.listeners[type].length;
                if (callback === undefined && scope === undefined) {
                    return numOfCallbacks > 0;
                }
                for (var i = 0; i < numOfCallbacks; i++) {
                    var listener = this.listeners[type][i];
                    if ((scope ? listener.scope == scope : true) && listener.callback == callback) {
                        return true;
                    }
                }
            }
            return false;
        }
    }, {
        key: 'trigger',
        value: function trigger(type, target) {
            var numOfListeners = 0;
            var event = {
                type: type,
                target: target
            };
            var args = [];
            var numOfArgs = arguments.length;
            for (var i = 0; i < numOfArgs; i++) {
                args.push(arguments[i]);
            }
            args = args.length > 2 ? args.splice(2, args.length - 1) : [];
            args = [event].concat(args);
            if (typeof this.listeners[type] != "undefined") {
                var numOfCallbacks = this.listeners[type].length;
                for (var _i2 = 0; _i2 < numOfCallbacks; _i2++) {
                    var listener = this.listeners[type][_i2];
                    if (listener && listener.callback) {
                        var concatArgs = args.concat(listener.args);
                        listener.callback.apply(listener.scope, concatArgs);
                        numOfListeners += 1;
                    }
                }
            }
        }
    }, {
        key: 'getEvents',
        value: function getEvents() {
            var str = "";
            for (var type in this.listeners) {
                var numOfCallbacks = this.listeners[type].length;
                for (var i = 0; i < numOfCallbacks; i++) {
                    var listener = this.listeners[type][i];
                    str += listener.scope && listener.scope.className ? listener.scope.className : "anonymous";
                    str += " listen for '" + type + "'\n";
                }
            }
            return str;
        }
    }]);

    return EventBus;
}();

Curator.EventBus = new EventBus();

(function ($) {
    // Default styling

    var defaults = {
        circular: false,
        speed: 5000,
        duration: 700,
        minWidth: 250,
        panesVisible: null,
        moveAmount: 0,
        autoPlay: false,
        useCss: true
    };

    if ($.zepto) {
        defaults.easing = 'ease-in-out';
    }
    // console.log (defaults);

    var css = {
        viewport: {
            'width': '100%', // viewport needs to be fluid
            // 'overflow': 'hidden',
            'position': 'relative'
        },

        pane_stage: {
            'width': '100%', // viewport needs to be fluid
            'overflow': 'hidden',
            'position': 'relative',
            'height': 0
        },

        pane_slider: {
            'width': '0%', // will be set to (number of panes * 100)
            'list-style': 'none',
            'position': 'relative',
            'overflow': 'hidden',
            'padding': '0',
            'left': '0'
        },

        pane: {
            'width': '0%', // will be set to (100 / number of images)
            'position': 'relative',
            'float': 'left'
        }
    };

    var Carousel = function () {
        function Carousel(container, options) {
            var _this = this;

            _classCallCheck(this, Carousel);

            Curator.log('Carousel->construct');

            this.current_position = 0;
            this.animating = false;
            this.timeout = null;
            this.FAKE_NUM = 0;
            this.PANES_VISIBLE = 0;

            this.options = $.extend([], defaults, options);

            this.$viewport = $(container); // <div> slider, known as $viewport

            this.$panes = this.$viewport.children();
            this.$panes.detach();

            this.$pane_stage = $('<div class="ctr-carousel-stage"></div>').appendTo(this.$viewport);
            this.$pane_slider = $('<div class="ctr-carousel-slider"></div>').appendTo(this.$pane_stage);

            // this.$pane_slider.append(this.$panes);

            this.$viewport.css(css.viewport); // set css on viewport
            this.$pane_slider.css(css.pane_slider); // set css on pane slider
            this.$pane_stage.css(css.pane_stage); // set css on pane slider

            this.addControls();
            this.update();

            $(window).smartresize(function () {
                _this.resize();
                _this.move(_this.current_position, true);

                // reset animation timer
                if (_this.options.autoPlay) {
                    _this.animate();
                }
            });
        }

        _createClass(Carousel, [{
            key: 'update',
            value: function update() {
                this.$panes = this.$pane_slider.children(); // <li> list items, known as $panes
                this.NUM_PANES = this.options.circular ? this.$panes.length + 1 : this.$panes.length;

                if (this.NUM_PANES > 0) {
                    this.resize();
                    this.move(this.current_position, true);

                    if (!this.animating) {
                        if (this.options.autoPlay) {
                            this.animate();
                        }
                    }
                }
            }
        }, {
            key: 'add',
            value: function add($els) {
                var $panes = [];
                //
                // $.each($els,(i, $pane)=> {
                //     let p = $pane.wrapAll('<div class="crt-carousel-col"></div>').parent();
                //     $panes.push(p)
                // });

                this.$pane_slider.append($els);
                this.$panes = this.$pane_slider.children();
            }
        }, {
            key: 'resize',
            value: function resize() {
                var _this2 = this;

                var PANE_WRAPPER_WIDTH = this.options.infinite ? (this.NUM_PANES + 1) * 100 + '%' : this.NUM_PANES * 100 + '%'; // % width of slider (total panes * 100)

                this.$pane_slider.css({ width: PANE_WRAPPER_WIDTH }); // set css on pane slider

                this.VIEWPORT_WIDTH = this.$viewport.width();

                if (this.options.panesVisible) {
                    // TODO - change to check if it's a function or a number
                    this.PANES_VISIBLE = this.options.panesVisible();
                    this.PANE_WIDTH = this.VIEWPORT_WIDTH / this.PANES_VISIBLE;
                } else {
                    this.PANES_VISIBLE = this.VIEWPORT_WIDTH < this.options.minWidth ? 1 : Math.floor(this.VIEWPORT_WIDTH / this.options.minWidth);
                    this.PANE_WIDTH = this.VIEWPORT_WIDTH / this.PANES_VISIBLE;
                }

                if (this.options.infinite) {

                    this.$panes.filter('.crt-clone').remove();

                    for (var i = this.NUM_PANES - 1; i > this.NUM_PANES - 1 - this.PANES_VISIBLE; i--) {
                        // console.log(i);
                        var first = this.$panes.eq(i).clone();
                        first.addClass('crt-clone');
                        first.css('opacity', '1');
                        // Should probably move this out to an event
                        first.find('.crt-post-image').css({ opacity: 1 });
                        this.$pane_slider.prepend(first);
                        this.FAKE_NUM = this.PANES_VISIBLE;
                    }
                    this.$panes = this.$pane_slider.children();
                }

                this.$panes.each(function (index, pane) {
                    $(pane).css($.extend(css.pane, { width: _this2.PANE_WIDTH + 'px' }));
                });
            }
        }, {
            key: 'destroy',
            value: function destroy() {}
        }, {
            key: 'animate',
            value: function animate() {
                var _this3 = this;

                this.animating = true;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(function () {
                    _this3.next();
                }, this.options.speed);
            }
        }, {
            key: 'next',
            value: function next() {
                var move = this.options.moveAmount ? this.options.moveAmount : this.PANES_VISIBLE;
                this.move(this.current_position + move, false);
            }
        }, {
            key: 'prev',
            value: function prev() {
                var move = this.options.moveAmount ? this.options.moveAmount : this.PANES_VISIBLE;
                this.move(this.current_position - move, false);
            }
        }, {
            key: 'move',
            value: function move(i, noAnimate) {
                var _this4 = this;

                // console.log(i);

                this.current_position = i;

                var maxPos = this.NUM_PANES - this.PANES_VISIBLE;

                // if (this.options.infinite)
                // {
                // 	let mod = this.NUM_PANES % this.PANES_VISIBLE;
                // }

                if (this.current_position < 0) {
                    this.current_position = 0;
                } else if (this.current_position > maxPos) {
                    this.current_position = maxPos;
                }

                var curIncFake = this.FAKE_NUM + this.current_position;
                var left = curIncFake * this.PANE_WIDTH;
                // console.log('move');
                // console.log(curIncFake);
                var panesInView = this.PANES_VISIBLE;
                var max = this.options.infinite ? this.PANE_WIDTH * this.NUM_PANES : this.PANE_WIDTH * this.NUM_PANES - this.VIEWPORT_WIDTH;

                this.currentLeft = left;

                //console.log(left+":"+max);

                if (left < 0) {
                    this.currentLeft = 0;
                } else if (left > max) {
                    this.currentLeft = max;
                } else {
                    this.currentLeft = left;
                }

                if (noAnimate) {
                    this.$pane_slider.css({
                        left: 0 - this.currentLeft + 'px'
                    });
                    this.moveComplete();
                } else {
                    var options = {
                        duration: this.options.duration,
                        complete: function complete() {
                            _this4.moveComplete();
                        }
                    };
                    if (this.options.easing) {
                        options.easing = this.options.easing;
                    }
                    this.$pane_slider.animate({
                        left: 0 - this.currentLeft + 'px'
                    }, options);
                }
            }
        }, {
            key: 'moveComplete',
            value: function moveComplete() {
                var _this5 = this;

                // console.log ('moveComplete');
                // console.log (this.current_position);
                // console.log (this.NUM_PANES - this.PANES_VISIBLE);
                if (this.options.infinite && this.current_position >= this.NUM_PANES - this.PANES_VISIBLE) {
                    // console.log('IIIII');
                    // infinite and we're off the end!
                    // re-e-wind, the crowd says 'bo selecta!'
                    this.$pane_slider.css({ left: 0 });
                    this.current_position = 0 - this.PANES_VISIBLE;
                    this.currentLeft = 0;
                }

                setTimeout(function () {
                    var paneMaxHieght = 0;
                    for (var i = _this5.current_position; i < _this5.current_position + _this5.PANES_VISIBLE; i++) {
                        var p = $(_this5.$panes[i]).children('.crt-post');
                        var h = p.height();
                        if (h > paneMaxHieght) {
                            paneMaxHieght = h;
                        }
                        console.log(p);
                        console.log(i + ":" + h);
                    }
                    _this5.$pane_stage.animate({ height: paneMaxHieght }, 300);
                }, 50);

                this.$viewport.trigger('curatorCarousel:changed', [this, this.current_position]);

                if (this.options.autoPlay) {
                    this.animate();
                }
            }
        }, {
            key: 'addControls',
            value: function addControls() {
                this.$viewport.append('<button type="button" data-role="none" class="crt-panel-prev crt-panel-arrow" aria-label="Previous" role="button" aria-disabled="false">Previous</button>');
                this.$viewport.append('<button type="button" data-role="none" class="crt-panel-next crt-panel-arrow" aria-label="Next" role="button" aria-disabled="false">Next</button>');

                this.$viewport.on('click', '.crt-panel-prev', this.prev.bind(this));
                this.$viewport.on('click', '.crt-panel-next', this.next.bind(this));
            }
        }, {
            key: 'method',
            value: function method() {
                var m = arguments[0];
                // let args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
                if (m == 'update') {
                    this.update();
                } else if (m == 'add') {
                    this.add(arguments[1]);
                } else if (m == 'destroy') {
                    this.destroy();
                } else {}
            }
        }]);

        return Carousel;
    }();

    var carousels = {};
    function rand() {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    }

    $.extend($.fn, {
        curatorCarousel: function curatorCarousel(options) {
            var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);

            $.each(this, function (index, item) {
                var id = $(item).data('carousel');

                if (carousels[id]) {
                    carousels[id].method.apply(carousels[id], args);
                } else {
                    id = rand();
                    carousels[id] = new Carousel(item, options);
                    $(item).data('carousel', id);
                }
            });

            return this;
        }
    });

    window.CCarousel = Carousel;
})($);

var Client = function () {
    function Client() {
        _classCallCheck(this, Client);

        Curator.log('Client->construct');
    }

    _createClass(Client, [{
        key: 'setOptions',
        value: function setOptions(options, defaults) {

            this.options = $.extend(true, {}, defaults, options);

            if (options.debug) {
                Curator.debug = true;
            }

            // Curator.log(this.options);

            return true;
        }
    }, {
        key: 'init',
        value: function init() {

            if (!Curator.checkContainer(this.options.container)) {
                return false;
            }

            this.$container = $(this.options.container);

            this.createFeed();
            this.createFilter();
            this.createPopupManager();

            return true;
        }
    }, {
        key: 'createFeed',
        value: function createFeed() {
            var _this6 = this;

            this.feed = new Curator.Feed(this);
            this.feed.on('postsLoaded', function (event) {
                _this6.onPostsLoaded(event.target);
            });
            this.feed.on('postsFailed', function (event) {
                _this6.onPostsFail(event.target);
            });
        }
    }, {
        key: 'createPopupManager',
        value: function createPopupManager() {
            this.popupManager = new Curator.PopupManager(this);
        }
    }, {
        key: 'createFilter',
        value: function createFilter() {
            if (this.options.filter && this.options.filter.show) {
                this.filter = new Curator.Filter(this);
            }
        }
    }, {
        key: 'loadPosts',
        value: function loadPosts(page) {
            this.feed.loadPosts(page);
        }
    }, {
        key: 'createPostElements',
        value: function createPostElements(posts) {
            var that = this;
            var postElements = [];
            $(posts).each(function () {
                var p = that.createPostElement(this);
                postElements.push(p.$el);
            });
            return postElements;
        }
    }, {
        key: 'createPostElement',
        value: function createPostElement(postJson) {
            var post = new Curator.Post(postJson, this.options, this);
            $(post).bind('postClick', this.onPostClick.bind(this));
            $(post).bind('postReadMoreClick', this.onPostClick.bind(this));

            if (this.options.onPostCreated) {
                this.options.onPostCreated(post);
            }

            return post;
        }
    }, {
        key: 'onPostsLoaded',
        value: function onPostsLoaded(event) {
            Curator.log('Client->onPostsLoaded');
            Curator.log(event.target);
        }
    }, {
        key: 'onPostsFail',
        value: function onPostsFail(event) {
            Curator.log('Client->onPostsLoadedFail');
            Curator.log(event.target);
        }
    }, {
        key: 'onPostClick',
        value: function onPostClick(ev, post) {
            this.popupManager.showPopup(post);
        }
    }, {
        key: 'track',
        value: function track(a) {
            Curator.log('Feed->track ' + a);

            $.ajax({
                url: this.getUrl('/track/' + this.options.feedId),
                dataType: 'json',
                data: { a: a },
                success: function success(data) {
                    Curator.log('Feed->track success');
                    Curator.log(data);
                },
                error: function error(jqXHR, textStatus, errorThrown) {
                    Curator.log('Feed->_loadPosts fail');
                    Curator.log(textStatus);
                    Curator.log(errorThrown);
                }
            });
        }
    }, {
        key: 'getUrl',
        value: function getUrl(trail) {
            return this.options.apiEndpoint + trail;
        }
    }]);

    return Client;
}();

Curator.Client = Client;
$.support.cors = true;

var defaults = {
    postsPerPage: 24,
    feedId: 'xxx',
    feedParams: {},
    debug: false,
    apiEndpoint: 'https://api.curator.io/v1',
    onPostsLoaded: function onPostsLoaded(data) {
        Curator.log('Feed->onPostsLoaded');
        Curator.log(data);
    },
    onPostsFail: function onPostsFail(data) {
        Curator.log('Feed->onPostsFail failed with message');
        Curator.log(data.message);
    }
};

var Feed = function (_EventBus) {
    _inherits(Feed, _EventBus);

    function Feed(client) {
        _classCallCheck(this, Feed);

        var _this7 = _possibleConstructorReturn(this, (Feed.__proto__ || Object.getPrototypeOf(Feed)).call(this));

        Curator.log('Feed->init with options');

        _this7.client = client;

        _this7.posts = [];
        _this7.currentPage = 0;
        _this7.postsLoaded = 0;
        _this7.postCount = 0;
        _this7.loading = false;

        _this7.options = _this7.client.options;

        _this7.feedBase = _this7.options.apiEndpoint + '/feed';
        return _this7;
    }

    _createClass(Feed, [{
        key: 'loadPosts',
        value: function loadPosts(page, paramsIn) {
            page = page || 0;
            Curator.log('Feed->loadPosts ' + this.loading);
            if (this.loading) {
                return false;
            }
            this.currentPage = page;

            var params = $.extend({}, this.options.feedParams, paramsIn);

            params.limit = this.options.postsPerPage;
            params.offset = page * this.options.postsPerPage;

            this._loadPosts(params);
        }
    }, {
        key: 'loadMore',
        value: function loadMore(paramsIn) {
            Curator.log('Feed->loadMore ' + this.loading);
            if (this.loading) {
                return false;
            }

            var params = {
                limit: this.options.postsPerPage
            };
            $.extend(params, this.options.feedParams, paramsIn);

            params.offset = this.posts.length;

            this._loadPosts(params);
        }
    }, {
        key: '_loadPosts',
        value: function _loadPosts(params) {
            var _this8 = this;

            Curator.log('Feed->_loadPosts');

            this.loading = true;

            $.ajax({
                url: this.getUrl('/posts'),
                dataType: 'json',
                data: params,
                success: function success(data) {
                    Curator.log('Feed->_loadPosts success');

                    if (data.success) {
                        _this8.postCount = data.postCount;
                        _this8.postsLoaded += data.posts.length;

                        _this8.posts = _this8.posts.concat(data.posts);
                        _this8.networks = data.networks;

                        _this8.trigger('postsLoaded', data.posts);
                    } else {
                        _this8.trigger('postsFailed', data.posts);
                    }
                    _this8.loading = false;
                },
                error: function error(jqXHR, textStatus, errorThrown) {
                    Curator.log('Feed->_loadPosts fail');
                    Curator.log(textStatus);
                    Curator.log(errorThrown);

                    _this8.trigger('postsFailed', []);
                    _this8.loading = false;
                }
            });
        }
    }, {
        key: 'loadPost',
        value: function loadPost(id, successCallback, failCallback) {
            failCallback = failCallback || function () {};
            $.get(this.getUrl('/post/' + id), {}, function (data) {
                if (data.success) {
                    successCallback(data.post);
                } else {
                    failCallback();
                }
            });
        }
    }, {
        key: 'inappropriatePost',
        value: function inappropriatePost(id, reason, success, failure) {
            var params = {
                reason: reason
                // where: {
                //     id: {'=': id}
                // }
            };

            $.post(this.getUrl('/post/' + id + '/inappropriate'), params, function (data, textStatus, jqXHR) {
                data = $.parseJSON(data);

                if (data.success === true) {
                    success();
                } else {
                    failure(jqXHR);
                }
            });
        }
    }, {
        key: 'lovePost',
        value: function lovePost(id, success, failure) {
            var params = {};

            $.post(this.getUrl('/post/' + id + '/love'), params, function (data, textStatus, jqXHR) {
                data = $.parseJSON(data);

                if (data.success === true) {
                    success(data.loves);
                } else {
                    failure(jqXHR);
                }
            });
        }
    }, {
        key: 'getUrl',
        value: function getUrl(trail) {
            return this.feedBase + '/' + this.options.feedId + trail;
        }
    }]);

    return Feed;
}(EventBus);

Curator.Feed = Feed;
/**
* ==================================================================
* Filter
* ==================================================================
*/

Curator.Templates.filterTemplate = ' <div class="crt-filter"> \
<div class="crt-filter-network">\
<label>Show:</label> \
<ul class="networks">\
</ul>\
</div> \
</div>';

var Filter = function () {
    function Filter(client) {
        var _this9 = this;

        _classCallCheck(this, Filter);

        Curator.log('Filter->construct');

        this.client = client;

        this.$filter = Curator.Template.render('#filterTemplate', {});
        this.$filterNetworks = this.$filter.find('.networks');

        this.client.$container.append(this.$filter);

        this.$filter.find('.crt-filter-network label').text(this.client.options.filter.label);

        this.$filter.on('click', '.crt-filter-network a', function (ev) {
            ev.preventDefault();
            console.log(ev);
            var t = $(ev.target);
            var networkId = t.data('network');

            _this9.$filter.find('.crt-filter-network li').removeClass('active');
            t.parent().addClass('active');

            Curator.EventBus.trigger('crt:filter:change');

            if (networkId) {
                _this9.client.feed.loadPosts(0, { network_id: networkId });
            } else {
                _this9.client.feed.loadPosts(0, {});
            }
        });

        this.client.feed.on('postsLoaded', function (event) {
            _this9.onPostsLoaded(event.target);
        });
    }

    _createClass(Filter, [{
        key: 'onPostsLoaded',
        value: function onPostsLoaded() {
            console.log("Asd");

            if (!this.filtersLoaded) {
                this.$filterNetworks.append('<li class="active"><a href="#" data-network="0"> All</a></li>');

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.client.feed.networks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var id = _step2.value;

                        var network = Curator.Networks[id];
                        console.log(network);
                        this.$filterNetworks.append('<li><a href="#" data-network="' + id + '"><i class="' + network.icon + '"></i> ' + network.name + '</a></li>');
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                this.filtersLoaded = true;
            }
        }
    }]);

    return Filter;
}();

Curator.Filter = Filter;
Curator.Networks = {
    1: {
        name: 'Twitter',
        icon: 'crt-icon-twitter'
    },
    2: {
        name: 'Instagram',
        icon: 'crt-icon-instagram'
    },
    3: {
        name: 'Facebook',
        icon: 'crt-icon-facebook'
    },
    4: {
        name: 'Pinterest',
        icon: 'crt-icon-pinterest'
    },
    5: {
        name: 'Google',
        icon: 'crt-icon-google'
    },
    6: {
        name: 'Vine',
        icon: 'crt-icon-vine'
    },
    7: {
        name: 'Flickr',
        icon: 'crt-icon-flickr'
    },
    8: {
        name: 'Youtube',
        icon: 'crt-icon-youtube'
    },
    9: {
        name: 'Tumblr',
        icon: 'crt-icon-tumblr'
    },
    10: {
        name: 'RSS',
        icon: 'crt-icon-rss'
    },
    11: {
        name: 'LinkedIn',
        icon: 'crt-icon-linkedin'
    }
};
/**
* ==================================================================
* Popup
* ==================================================================
*/

Curator.PopupInappropriate = function (post, feed) {
    this.init(post, feed);
};

$.extend(Curator.PopupInappropriate.prototype, {
    feed: null,
    post: null,

    init: function init(post, feed) {
        var that = this;

        this.feed = feed;
        this.post = post;

        this.jQueryel = $('.mark-bubble');

        $('.mark-close').click(function (e) {
            e.preventDefault();
            $(this).parent().fadeOut('slow');
        });

        $('.mark-bubble .submit').click(function () {
            var $input = that.$el.find('input.text');

            var reason = $.trim($input.val());

            if (reason) {
                $input.disabled = true;
                $(this).hide();

                that.$el.find('.waiting').show();

                feed.inappropriatePost(that.post.id, reason, function () {
                    $input.val('');
                    that.$el.find('.waiting').hide();
                    that.$el.find('.title').html('Thank you');
                    that.$el.find('input.text').hide();
                    that.$el.find('input.text').html('');
                    that.$el.find('.success-message').html('This message has been marked as inappropriate').show();
                }, function () {
                    that.$el.find('.waiting').hide();
                    that.$el.find('.title').html('Oops');
                    that.$el.find('input.text').hide();
                    that.$el.find('input.text').html('');
                    that.$el.find('.success-message').html('It looks like a problem has occurred. Please try again later').show();
                });
            }
        });

        this.$el.fadeIn('slow');
    }
});
/**
* ==================================================================
* Popup Manager
* ==================================================================
*/

var PopupManager = function () {
    function PopupManager(client) {
        _classCallCheck(this, PopupManager);

        Curator.log("PopupManager->init ");

        this.client = client;
        this.templateId = '#popup-wrapper-template';

        this.$wrapper = Curator.Template.render(this.templateId, {});
        this.$popupContainer = this.$wrapper.find('.crt-popup-container');
        this.$underlay = this.$wrapper.find('.crt-popup-underlay');

        $('body').append(this.$wrapper);
        this.$underlay.click(this.onUnderlayClick.bind(this));
        //this.$popupContainer.click(this.onUnderlayClick.bind(this));
    }

    _createClass(PopupManager, [{
        key: 'showPopup',
        value: function showPopup(post) {
            var _this10 = this;

            if (this.popup) {
                this.popup.hide(function () {
                    _this10.popup.destroy();
                    _this10.showPopup2(post);
                });
            } else {
                this.showPopup2(post);
            }
        }
    }, {
        key: 'showPopup2',
        value: function showPopup2(post) {
            this.popup = new Curator.Popup(this, post, this.feed);
            this.$popupContainer.append(this.popup.$popup);

            this.$wrapper.show();

            if (this.$underlay.css('display') !== 'block') {
                this.$underlay.fadeIn();
            }
            this.popup.show();

            $('body').addClass('crt-popup-visible');

            this.currentPostNum = 0;
            for (var i = 0; i < this.posts.length; i++) {
                // console.log (post.json.id +":"+this.posts[i].id);
                if (post.json.id == this.posts[i].id) {
                    this.currentPostNum = i;
                    Curator.log('Found post ' + i);
                    break;
                }
            }

            this.client.track('popup:show');
        }
    }, {
        key: 'setPosts',
        value: function setPosts(posts) {
            this.posts = posts;
        }
    }, {
        key: 'onClose',
        value: function onClose() {
            this.hide();
        }
    }, {
        key: 'onPrevious',
        value: function onPrevious() {
            this.currentPostNum -= 1;
            this.currentPostNum = this.currentPostNum >= 0 ? this.currentPostNum : this.posts.length - 1; // loop back to start

            this.showPopup({ json: this.posts[this.currentPostNum] });
        }
    }, {
        key: 'onNext',
        value: function onNext() {
            this.currentPostNum += 1;
            this.currentPostNum = this.currentPostNum < this.posts.length ? this.currentPostNum : 0; // loop back to start

            this.showPopup({ json: this.posts[this.currentPostNum] });
        }
    }, {
        key: 'onUnderlayClick',
        value: function onUnderlayClick(e) {
            Curator.log('PopupManager->onUnderlayClick');
            e.preventDefault();

            this.popup.hide(function () {
                this.hide();
            }.bind(this));
        }
    }, {
        key: 'hide',
        value: function hide() {
            var _this11 = this;

            Curator.log('PopupManager->hide');
            this.client.track('popup:hide');
            $('body').removeClass('crt-popup-visible');
            this.currentPostNum = 0;
            this.popup = null;
            this.$underlay.fadeOut(function () {
                _this11.$underlay.css({ 'display': '', 'opacity': '' });
                _this11.$wrapper.hide();
            });
        }
    }, {
        key: 'destroy',
        value: function destroy() {

            this.$underlay.remove();

            delete this.$popup;
            delete this.$underlay;
        }
    }]);

    return PopupManager;
}();

Curator.PopupManager = PopupManager;
/**
* ==================================================================
* Popup
* ==================================================================
*/

var Popup = function () {
    function Popup(popupManager, post, feed) {
        _classCallCheck(this, Popup);

        Curator.log("Popup->init ");

        this.popupManager = popupManager;
        this.json = post.json;
        this.feed = feed;

        this.templateId = '#popup-template';
        this.videoPlaying = false;

        this.$popup = Curator.Template.render(this.templateId, this.json);

        if (this.json.image) {
            this.$popup.addClass('has-image');
        }

        if (this.json.video) {
            this.$popup.addClass('has-video');
        }

        if (this.json.video && this.json.video.indexOf('youtu') >= 0) {
            // youtube
            this.$popup.find('video').remove();
            // this.$popup.removeClass('has-image');

            var youTubeId = Curator.StringUtils.youtubeVideoId(this.json.video);

            var src = '<iframe id="ytplayer" type="text/html" width="615" height="615" \
            src="https://www.youtube.com/embed/' + youTubeId + '?autoplay=0&rel=0&showinfo" \
            frameborder="0"></iframe>';

            this.$popup.find('.crt-video-container img').remove();
            this.$popup.find('.crt-video-container a').remove();
            this.$popup.find('.crt-video-container').append(src);
        }

        this.$popup.on('click', ' .crt-close', this.onClose.bind(this));
        this.$popup.on('click', ' .crt-previous', this.onPrevious.bind(this));
        this.$popup.on('click', ' .crt-next', this.onNext.bind(this));
        this.$popup.on('click', ' .crt-play', this.onPlay.bind(this));
        this.$popup.on('click', '.crt-share-facebook', this.onShareFacebookClick.bind(this));
        this.$popup.on('click', '.crt-share-twitter', this.onShareTwitterClick.bind(this));
    }

    _createClass(Popup, [{
        key: 'onShareFacebookClick',
        value: function onShareFacebookClick(ev) {
            ev.preventDefault();
            Curator.SocialFacebook.share(this.json);
            this.widget.track('share:facebook');
            return false;
        }
    }, {
        key: 'onShareTwitterClick',
        value: function onShareTwitterClick(ev) {
            ev.preventDefault();
            Curator.SocialTwitter.share(this.json);
            this.widget.track('share:twitter');
            return false;
        }
    }, {
        key: 'onClose',
        value: function onClose(e) {
            e.preventDefault();
            var that = this;
            this.hide(function () {
                that.popupManager.onClose();
            });
        }
    }, {
        key: 'onPrevious',
        value: function onPrevious(e) {
            e.preventDefault();

            this.popupManager.onPrevious();
        }
    }, {
        key: 'onNext',
        value: function onNext(e) {
            e.preventDefault();

            this.popupManager.onNext();
        }
    }, {
        key: 'onPlay',
        value: function onPlay(e) {
            Curator.log('Popup->onPlay');
            e.preventDefault();

            this.videoPlaying = !this.videoPlaying;

            if (this.videoPlaying) {
                this.$popup.find('video')[0].play();
                this.popupManager.client.track('video:play');
            } else {
                this.$popup.find('video')[0].pause();
                this.popupManager.client.track('video:pause');
            }

            Curator.log(this.videoPlaying);

            this.$popup.toggleClass('video-playing', this.videoPlaying);
        }
    }, {
        key: 'show',
        value: function show() {
            //
            // let post = this.json;
            // let mediaUrl = post.image,
            //     text = post.text;
            //
            // if (mediaUrl) {
            //     let $imageWrapper = that.$el.find('div.main-image-wrapper');
            //     this.loadMainImage(mediaUrl, $imageWrapper, ['main-image']);
            // }
            //
            // let $socialIcon = this.$el.find('.social-icon');
            // $socialIcon.attr('class', 'social-icon');
            // $socialIcon.addClass(Curator.SOURCE_TYPES[post.sourceType]);
            //
            // //format the date
            // let date = Curator.Utils.dateAsDayMonthYear(post.sourceCreateAt);
            //
            // this.$el.find('input.discovery-id').val(post.id);
            // this.$el.find('div.full-name span').html(post.user_full_name);
            // this.$el.find('div.username span').html('@' + post.user_screen_name);
            // this.$el.find('div.date span').html(date);
            // this.$el.find('div.love-indicator span').html(post.loves);
            // this.$el.find('div.side-text span').html(text);
            //
            // this.wrapper.show();
            this.$popup.fadeIn(function () {
                // that.$popup.find('.crt-popup').animate({width:950}, function () {
                //     $('.popup .content').fadeIn('slow');
                // });
            });
        }
    }, {
        key: 'hide',
        value: function hide(callback) {
            Curator.log('Popup->hide');
            var that = this;
            this.$popup.fadeOut(function () {
                that.destroy();
                callback();
            });
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            if (this.$popup && this.$popup.length) {
                this.$popup.remove();

                if (this.$popup.find('video').length) {
                    this.$popup.find('video')[0].pause();
                }
            }

            delete this.$popup;
        }
    }]);

    return Popup;
}();

Curator.Popup = Popup;

/**
* ==================================================================
* Post
* ==================================================================
*/

var Post = function () {
    function Post(postJson, options, widget) {
        var _this12 = this;

        _classCallCheck(this, Post);

        this.options = options;
        this.widget = widget;

        this.templateId = this.options.postTemplate;

        this.json = postJson;
        this.$el = Curator.Template.render(this.templateId, postJson);

        this.$el.find('.crt-share-facebook').click(this.onShareFacebookClick.bind(this));
        this.$el.find('.crt-share-twitter').click(this.onShareTwitterClick.bind(this));
        // this.$el.find('.crt-hitarea').click(this.onPostClick.bind(this));
        this.$el.find('.crt-post-read-more-button').click(this.onReadMoreClick.bind(this));
        // this.$el.on('click','.crt-post-text-body a',this.onLinkClick.bind(this));
        this.$el.click(this.onPostClick.bind(this));
        this.$post = this.$el.find('.crt-post');
        this.$image = this.$el.find('.crt-post-image');
        this.$imageContainer = this.$el.find('.crt-image-c');
        this.$image.css({ opacity: 0 });

        if (this.json.image) {
            this.$image.on('load', this.onImageLoaded.bind(this));
            this.$image.on('error', this.onImageError.bind(this));
        } else {
            // no image ... call this.onImageLoaded
            setTimeout(function () {
                console.log('asdasd');
                _this12.setHeight();
            }, 100);
        }

        if (this.json.image_width > 0) {
            var p = this.json.image_height / this.json.image_width * 100;
            this.$imageContainer.addClass('crt-image-responsive').css('padding-bottom', p + '%');
        }

        this.$image.data('dims', this.json.image_width + ':' + this.json.image_height);

        this.$post = this.$el.find('.crt-post');

        if (this.json.video) {
            this.$post.addClass('has-video');
        }
    }

    _createClass(Post, [{
        key: 'onShareFacebookClick',
        value: function onShareFacebookClick(ev) {
            ev.preventDefault();
            Curator.SocialFacebook.share(this.json);
            this.widget.track('share:facebook');
            return false;
        }
    }, {
        key: 'onShareTwitterClick',
        value: function onShareTwitterClick(ev) {
            ev.preventDefault();
            Curator.SocialTwitter.share(this.json);
            this.widget.track('share:twitter');
            return false;
        }
    }, {
        key: 'onPostClick',
        value: function onPostClick(ev) {

            var target = $(ev.target);

            if (target.is('a') && target.attr('href') !== '#') {
                this.widget.track('click:link');
            } else {
                ev.preventDefault();
                $(this).trigger('postClick', this, this.json, ev);
            }
        }
    }, {
        key: 'onImageLoaded',
        value: function onImageLoaded() {
            this.$image.animate({ opacity: 1 });

            this.setHeight();
        }
    }, {
        key: 'onImageError',
        value: function onImageError() {
            // Unable to load image!!!
            this.$image.hide();

            this.setHeight();
        }
    }, {
        key: 'setHeight',
        value: function setHeight() {
            var height = this.$post.height();
            console.log(height);
            if (this.options.maxHeight && this.options.maxHeight > 0 && height > this.options.maxHeight) {
                this.$post.css({ maxHeight: this.options.maxHeight }).addClass('crt-post-max-height');
            }
        }
    }, {
        key: 'onReadMoreClick',
        value: function onReadMoreClick(ev) {
            ev.preventDefault();
            this.widget.track('click:read-more');
            $(this).trigger('postReadMoreClick', this, this.json, ev);
        }
    }]);

    return Post;
}();

Curator.Post = Post;
/* global FB */

Curator.SocialFacebook = {
    share: function share(post) {
        var obj = post;
        obj.url = Curator.Utils.postUrl(post);
        var cb = function cb() {};

        // Disabling for now - doesn't work - seems to get error "Can't Load URL: The domain of this URL isn't
        // included in the app's domains"
        var useJSSDK = false; // window.FB
        if (useJSSDK) {
            window.FB.ui({
                method: 'feed',
                link: obj.url,
                picture: obj.image,
                name: obj.user_screen_name,
                description: obj.text
            }, cb);
        } else {
            var url = "https://www.facebook.com/sharer/sharer.php?u={{url}}&d={{text}}";
            var url2 = Curator.Utils.tinyparser(url, obj);
            Curator.Utils.popup(url2, 'twitter', '600', '430', '0');
        }
    }
};

Curator.SocialPinterest = {
    share: function share(post) {
        var obj = post;
        obj.url = Curator.Utils.postUrl(post);
        var url = "http://pinterest.com/pin/create/button/?url={{url}}&media={{image}}&description={{text}}";
        Curator.Utils.popup(Curator.Utils.tinyparser(url, obj), 'pintrest', '600', '270', '0');
    }
};

Curator.SocialTwitter = {
    share: function share(post) {
        var obj = post;
        obj.url = Curator.Utils.postUrl(post);

        var url = "http://twitter.com/share?url={{url}}&text={{text}}&hashtags={{hashtags}}";
        var url2 = Curator.Utils.tinyparser(url, obj);
        // console.log(obj);
        // console.log(url);
        // console.log(url2);
        Curator.Utils.popup(url2, 'twitter', '600', '430', '0');
    }
};

Curator.Templates.postTemplate = ' \
<div class="crt-post-c">\
    <div class="crt-post-bg"></div> \
    <div class="crt-post post<%=id%> crt-post-<%=this.networkIcon()%>"> \
        <div class="crt-post-header"> \
            <span class="crt-social-icon"><i class="crt-icon-<%=this.networkIcon()%>"></i></span> \
            <img src="<%=user_image%>"  /> \
            <div class="crt-post-name">\
            <div class="crt-post-fullname"><%=user_full_name%></div>\
            <div class="crt-post-username"><a href="<%=this.userUrl()%>" target="_blank">@<%=user_screen_name%></a></div>\
            </div> \
        </div> \
        <div class="crt-post-content"> \
            <div class="crt-image crt-hitarea crt-post-content-image <%=this.contentImageClasses()%>" > \
                <div class="crt-image-c"><img src="<%=image%>" class="crt-post-image" /></div> \
                <span class="crt-play"><i class="crt-play-icon"></i></span> \
            </div> \
            <div class="text crt-post-content-text <%=this.contentTextClasses()%>"> \
                <div class="crt-post-text-body"><%=this.parseText(text)%></div> \
            </div> \
        </div> \
        <div class="crt-post-footer">\
            <div class="crt-date"><%=this.prettyDate(source_created_at)%></div> \
            <div class="crt-post-share"><span class="ctr-share-hint"></span><a href="#" class="crt-share-facebook"><i class="crt-icon-facebook"></i></a>  <a href="#" class="crt-share-twitter"><i class="crt-icon-twitter"></i></a></div>\
        </div> \
        <div class="crt-post-read-more"><a href="#" class="crt-post-read-more-button">Read more</a> </div> \
    </div>\
</div>';

Curator.Templates.popupWrapperTemplate = ' \
<div class="crt-popup-wrapper"> \
    <div class="crt-popup-wrapper-c"> \
        <div class="crt-popup-underlay"></div> \
        <div class="crt-popup-container"></div> \
    </div> \
</div>';

Curator.Templates.popupTemplate = ' \
<div class="crt-popup"> \
    <a href="#" class="crt-close crt-icon-cancel"></a> \
    <a href="#" class="crt-next crt-icon-right-open"></a> \
    <a href="#" class="crt-previous crt-icon-left-open"></a> \
    <div class="crt-popup-left">  \
        <div class="crt-video"> \
            <div class="crt-video-container">\
                <video preload="none">\
                <source src="<%=video%>" type="video/mp4" >\
                </video>\
                <img src="<%=image%>" />\
                <a href="javascript:;" class="crt-play"><i class="crt-play-icon"></i></a> \
            </div> \
        </div> \
        <div class="crt-image"> \
            <img src="<%=image%>" /> \
        </div> \
    </div> \
    <div class="crt-popup-right"> \
        <div class="crt-popup-header"> \
            <span class="crt-social-icon"><i class="crt-icon-<%=this.networkIcon()%>"></i></span> \
            <img src="<%=user_image%>"  /> \
            <div class="crt-post-name"><span><%=user_full_name%></span><br/><a href="<%=this.userUrl()%>" target="_blank">@<%=user_screen_name%></a></div> \
        </div> \
        <div class="crt-popup-text <%=this.contentTextClasses()%>"> \
            <div class="crt-popup-text-container"> \
                <p class="crt-date"><%=this.prettyDate(source_created_at)%></p> \
                <div class="crt-popup-text-body"><%=this.parseText(text)%></div> \
            </div> \
        </div> \
        <div class="crt-popup-footer">\
            <div class="crt-post-share"><span class="ctr-share-hint"></span><a href="#" class="crt-share-facebook"><i class="crt-icon-facebook"></i></a>  <a href="#" class="crt-share-twitter"><i class="crt-icon-twitter"></i></a></div>\
        </div> \
    </div> \
</div>';

Curator.Templates.popupUnderlayTemplate = '';

Curator.Template = {
    camelize: function camelize(s) {
        return s.replace(/(?:^|[-_])(\w)/g, function (_, c) {
            return c ? c.toUpperCase() : '';
        });
    },
    render: function render(templateId, data) {
        var cam = this.camelize(templateId).substring(1);
        var source = '';

        // console.log (cam);
        // console.log (data);

        if (Curator.Templates[cam] !== undefined) {
            source = Curator.Templates[cam];
        } else if ($(templateId).length === 1) {
            source = $(templateId).html();
        }

        if (source === '') {
            throw new Error('could not find template ' + templateId + '(' + cam + ')');
        }

        var tmpl = window.parseTemplate(source, data);
        if ($.parseHTML) {
            // breaks with jquery < 1.8
            tmpl = $.parseHTML(tmpl);
        }
        return $(tmpl).filter('div');
    }
};

Curator.Track = {

    track: function track(action) {
        $.ajax({
            url: this.getUrl('/posts'),
            dataType: 'json',
            data: params,
            success: function success(data) {
                Curator.log('Feed->_loadPosts success');

                if (data.success) {
                    that.postCount = data.postCount;
                    that.postsLoaded += data.posts.length;

                    that.posts = that.posts.concat(data.posts);

                    if (that.options.onPostsLoaded) {
                        that.options.onPostsLoaded(data.posts);
                    }
                } else {
                    if (that.options.onPostsFail) {
                        that.options.onPostsFail(data);
                    }
                }
                that.loading = false;
            },
            error: function error(jqXHR, textStatus, errorThrown) {
                Curator.log('Feed->_loadPosts fail');
                Curator.log(textStatus);
                Curator.log(errorThrown);

                if (that.options.onPostsFail) {
                    that.options.onPostsFail();
                }
                that.loading = false;
            }
        });
    },

    getUrl: function getUrl(trail) {
        return this.feedBase + '/' + this.options.feedId + trail;
    }
};

Curator.Utils = {

    postUrl: function postUrl(post) {

        console.log(post.url);

        if (post.url && post.url !== "" && post.url !== "''") {
            // instagram
            return post.url;
        }

        console.log(post.url);
        if (post.network_id + "" === "1") {
            // twitter
            return 'https://twitter.com/' + post.user_screen_name + '/status/' + post.source_identifier;
        }

        return '';
    },

    center: function center(elementWidth, elementHeight, bound) {
        var s = window.screen,
            b = bound || {},
            bH = b.height || s.height,
            bW = b.width || s.height,
            w = elementWidth,
            h = elementHeight;

        return {
            top: bH ? (bH - h) / 2 : 0,
            left: bW ? (bW - w) / 2 : 0
        };
    },

    popup: function popup(mypage, myname, w, h, scroll) {

        var position = this.center(w, h),
            settings = 'height=' + h + ',width=' + w + ',top=' + position.top + ',left=' + position.left + ',scrollbars=' + scroll + ',resizable';

        window.open(mypage, myname, settings);
    },

    tinyparser: function tinyparser(string, obj) {

        return string.replace(/\{\{(.*?)\}\}/g, function (a, b) {
            return obj && typeof obj[b] !== "undefined" ? encodeURIComponent(obj[b]) : "";
        });
    }
};

Curator.DateUtils = {
    /**
     * Parse a date string in form DD/MM/YYYY HH:MM::SS - returns as UTC
     */
    dateFromString: function dateFromString(time) {
        dtstr = time.replace(/\D/g, " ");
        var dtcomps = dtstr.split(" ");

        // modify month between 1 based ISO 8601 and zero based Date
        dtcomps[1]--;

        var date = new Date(Date.UTC(dtcomps[0], dtcomps[1], dtcomps[2], dtcomps[3], dtcomps[4], dtcomps[5]));

        return date;
    },

    /**
     * Format the date as DD/MM/YYYY
     */
    dateAsDayMonthYear: function dateAsDayMonthYear(strEpoch) {
        var myDate = new Date(parseInt(strEpoch, 10));
        // console.log(myDate.toGMTString()+"<br>"+myDate.toLocaleString());

        var day = myDate.getDate() + '';
        var month = myDate.getMonth() + 1 + '';
        var year = myDate.getFullYear() + '';

        day = day.length === 1 ? '0' + day : day;
        month = month.length === 1 ? '0' + month : month;

        var created = day + '/' + month + '/' + year;

        return created;
    },

    /**
     * Convert the date into a time array
     */
    dateAsTimeArray: function dateAsTimeArray(strEpoch) {
        var myDate = new Date(parseInt(strEpoch, 10));

        var hours = myDate.getHours() + '';
        var mins = myDate.getMinutes() + '';
        var ampm = void 0;

        if (hours >= 12) {
            ampm = 'PM';
            if (hours > 12) {
                hours = hours - 12 + '';
            }
        } else {
            ampm = 'AM';
        }

        hours = hours.length === 1 ? '0' + hours : hours; //console.log(hours.length);
        mins = mins.length === 1 ? '0' + mins : mins; //console.log(mins);

        var array = [parseInt(hours.charAt(0), 10), parseInt(hours.charAt(1), 10), parseInt(mins.charAt(0), 10), parseInt(mins.charAt(1), 10), ampm];

        return array;
    }
};

Curator.StringUtils = {

    twitterLinks: function twitterLinks(s) {
        s = s.replace(/[@]+[A-Za-z0-9-_]+/g, function (u) {
            var username = u.replace("@", "");
            return Curator.StringUtils.url("https://twitter.com/" + username, u);
        });
        s = s.replace(/[#]+[A-Za-z0-9-_]+/g, function (t) {
            var tag = t.replace("#", "%23");
            return Curator.StringUtils.url("https://twitter.com/search?q=" + tag, t);
        });

        return s;
    },

    instagramLinks: function instagramLinks(s) {
        s = s.replace(/[@]+[A-Za-z0-9-_]+/g, function (u) {
            var username = u.replace("@", "");
            return Curator.StringUtils.url("https://www.instagram.com/" + username + '/', u);
        });
        s = s.replace(/[#]+[A-Za-z0-9-_]+/g, function (t) {
            var tag = t.replace("#", "");
            return Curator.StringUtils.url("https://www.instagram.com/explore/tags/" + tag + '/', t);
        });

        return s;
    },

    facebookLinks: function facebookLinks(s) {
        s = s.replace(/[@]+[A-Za-z0-9-_]+/g, function (u) {
            var username = u.replace("@", "");
            return Curator.StringUtils.url("https://www.facebook.com/" + username + '/', u);
        });
        s = s.replace(/[#]+[A-Za-z0-9-_]+/g, function (t) {
            var tag = t.replace("#", "%23");
            return Curator.StringUtils.url("https://www.facebook.com/search/top/?q=" + tag, t);
        });

        return s;
    },

    linksToHref: function linksToHref(s) {
        s = s.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function (url) {
            return Curator.StringUtils.url(url);
        });

        return s;
    },

    url: function url(s, t) {
        t = t || s;
        return '<a href="' + s + '" target="_blank">' + t + '</a>';
    },

    youtubeVideoId: function youtubeVideoId(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        return match && match[7].length == 11 ? match[7] : false;
    }
};

Curator.Config.Waterfall = $.extend({}, Curator.Config.Defaults, {
    scroll: 'more',
    waterfall: {
        gridWidth: 250,
        animate: true,
        animateSpeed: 400
    }
});

var Waterfall = function (_Curator$Client) {
    _inherits(Waterfall, _Curator$Client);

    function Waterfall(options) {
        _classCallCheck(this, Waterfall);

        var _this13 = _possibleConstructorReturn(this, (Waterfall.__proto__ || Object.getPrototypeOf(Waterfall)).call(this));

        _this13.setOptions(options, Curator.Config.Waterfall);

        Curator.log("Waterfall->init with options:");
        Curator.log(_this13.options);

        if (_this13.init(_this13)) {
            _this13.$scroll = $('<div class="crt-feed-scroll"></div>').appendTo(_this13.$container);
            _this13.$feed = $('<div class="crt-feed"></div>').appendTo(_this13.$scroll);
            _this13.$container.addClass('crt-feed-container');

            if (_this13.options.scroll == 'continuous') {
                $(_this13.$scroll).scroll(function () {
                    var height = _this13.$scroll.height();
                    var cHeight = _this13.$feed.height();
                    var scrollTop = _this13.$scroll.scrollTop();
                    if (scrollTop >= cHeight - height) {
                        _this13.loadMorePosts();
                    }
                });
            } else if (_this13.options.scroll == 'none') {
                // no scroll - use javascript to trigger loading
            } else {
                // default to more
                _this13.$more = $('<div class="crt-feed-more"><a href="#"><span>Load more</span></a></div>').appendTo(_this13.$scroll);
                _this13.$more.find('a').on('click', function (ev) {
                    ev.preventDefault();
                    _this13.loadMorePosts();
                });
            }

            _this13.$feed.waterfall({
                selector: '.crt-post-c',
                gutter: 0,
                width: _this13.options.waterfall.gridWidth,
                animate: _this13.options.waterfall.animate,
                animationOptions: {
                    speed: _this13.options.waterfall.animateSpeed / 2,
                    duration: _this13.options.waterfall.animateSpeed
                }
            });

            Curator.EventBus.on('crt:filter:change', function (event) {
                _this13.$feed.find('.crt-post-c').remove();
            });

            // Load first set of posts
            _this13.loadPosts(0);
        }
        return _this13;
    }

    _createClass(Waterfall, [{
        key: 'loadPosts',
        value: function loadPosts(page, clear) {
            Curator.log('Waterfall->loadPage');
            if (clear) {
                this.$feed.find('.crt-post-c').remove();
            }
            this.feed.loadPosts(page);
        }
    }, {
        key: 'loadMorePosts',
        value: function loadMorePosts() {
            Curator.log('Waterfall->loadMorePosts');

            this.feed.loadPosts(this.feed.currentPage + 1);
        }
    }, {
        key: 'onPostsLoaded',
        value: function onPostsLoaded(posts) {
            Curator.log("Waterfall->onPostsLoaded");
            Curator.log(posts);

            var postElements = this.createPostElements(posts);

            //this.$feed.append(postElements);
            this.$feed.waterfall('append', postElements);

            var that = this;
            $.each(postElements, function (i) {
                var post = this;
                if (that.options.waterfall.showReadMore) {
                    post.find('.crt-post').addClass('crt-post-show-read-more');
                }
            });

            this.popupManager.setPosts(posts);

            this.loading = false;
            this.options.onPostsLoaded(this, posts);
        }
    }, {
        key: 'onPostsFailed',
        value: function onPostsFailed(data) {
            this.loading = false;
            this.$feed.html('<p style="text-align: center">' + data.message + '</p>');
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            //this.$feed.slick('unslick');
            this.$feed.remove();
            this.$scroll.remove();
            if (this.$more) {
                this.$more.remove();
            }
            this.$container.removeClass('crt-feed-container');

            delete this.$feed;
            delete this.$scroll;
            delete this.$container;
            delete this.options;
            delete this.totalPostsLoaded;
            delete this.loading;
            delete this.allLoaded;

            // TODO add code to cascade destroy down to Feed & Posts
            // unregistering events etc
            delete this.feed;
        }
    }]);

    return Waterfall;
}(Curator.Client);

Curator.Waterfall = Waterfall;

Curator.Config.Carousel = $.extend({}, Curator.Config.Defaults, {
    scroll: 'more',
    carousel: {
        autoPlay: true,
        autoLoad: true
    }
});

var Carousel = function (_Client) {
    _inherits(Carousel, _Client);

    function Carousel(options) {
        _classCallCheck(this, Carousel);

        var _this14 = _possibleConstructorReturn(this, (Carousel.__proto__ || Object.getPrototypeOf(Carousel)).call(this));

        _this14.setOptions(options, Curator.Config.Carousel);

        _this14.containerHeight = 0;
        _this14.loading = false;
        _this14.posts = [];
        _this14.firstLoad = true;

        Curator.log("Carousel->init with options:");
        Curator.log(_this14.options);

        if (_this14.init(_this14)) {

            _this14.allLoaded = false;

            var _that = _this14;

            // this.$wrapper = $('<div class="crt-carousel-wrapper"></div>').appendTo(this.$container);
            _this14.$feed = $('<div class="crt-feed"></div>').appendTo(_this14.$container);
            _this14.$container.addClass('crt-carousel');

            _this14.carousel = new window.CCarousel(_this14.$feed, _this14.options.carousel);
            _this14.$feed.on('curatorCarousel:changed', function (event, carousel, currentSlide) {
                console.log('curatorCarousel:changed ' + currentSlide);
                // console.log('curatorCarousel:changed '+(that.feed.postsLoaded-carousel.PANES_VISIBLE));
                // console.log(carousel.PANES_VISIBLE);
                if (_that.options.carousel.autoLoad) {
                    // if (currentSlide >= that.feed.postsLoaded - carousel.PANES_VISIBLE) {
                    _that.loadMorePosts();
                    // }
                }
            });

            // load first set of posts
            _this14.loadPosts(0);
        }
        return _this14;
    }

    _createClass(Carousel, [{
        key: 'loadMorePosts',
        value: function loadMorePosts() {
            Curator.log('Carousel->loadMorePosts');

            if (this.feed.postCount > this.feed.postsLoaded) {
                this.feed.loadPosts(this.feed.currentPage + 1);
            }
        }
    }, {
        key: 'onPostsLoaded',
        value: function onPostsLoaded(posts) {
            Curator.log("Carousel->onPostsLoaded");

            this.loading = false;

            if (posts.length === 0) {
                this.allLoaded = true;
            } else {
                var _that2 = this;
                var $els = [];
                $(posts).each(function (i) {
                    var p = _that2.createPostElement(this);
                    $els.push(p.$el);

                    if (_that2.options.animate && _that2.firstLoad) {
                        p.$el.css({ opacity: 0 });
                        setTimeout(function () {
                            console.log(i);
                            p.$el.css({ opacity: 0 }).animate({ opacity: 1 });
                        }, i * 100);
                    }
                });

                this.carousel.add($els);
                this.carousel.update();

                // that.$feed.c().trigger('add.owl.carousel',$(p.$el));

                this.popupManager.setPosts(posts);

                this.options.onPostsLoaded(this, posts);
            }
            this.firstLoad = false;
        }
    }, {
        key: 'onPostsFail',
        value: function onPostsFail(data) {
            Curator.log("Carousel->onPostsFail");
            this.loading = false;
            this.$feed.html('<p style="text-align: center">' + data.message + '</p>');
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.carousel.destroy();
            this.$feed.remove();
            this.$container.removeClass('crt-carousel');

            delete this.$feed;
            delete this.$container;
            delete this.options;
            delete this.feed.postsLoaded;
            delete this.loading;
            delete this.allLoaded;

            // TODO add code to cascade destroy down to Feed & Posts
            // unregistering events etc
            delete this.feed;
        }
    }]);

    return Carousel;
}(Client);

Curator.Carousel = Carousel;

Curator.Config.Panel = $.extend({}, Curator.Config.Defaults, {
    panel: {
        // speed: 500,
        autoPlay: true,
        autoLoad: true,
        moveAmount: 1,
        fixedHeight: false,
        infinite: true,
        minWidth: 2000
    }
});

var Panel = function (_Curator$Client2) {
    _inherits(Panel, _Curator$Client2);

    function Panel(options) {
        _classCallCheck(this, Panel);

        var _this15 = _possibleConstructorReturn(this, (Panel.__proto__ || Object.getPrototypeOf(Panel)).call(this));

        _this15.setOptions(options, Curator.Config.Panel);

        Curator.log("Panel->init with options:");
        Curator.log(_this15.options);

        _this15.containerHeight = 0;
        _this15.loading = false;
        _this15.feed = null;
        _this15.$container = null;
        _this15.$feed = null;
        _this15.posts = [];

        if (_this15.init(_this15)) {
            _this15.allLoaded = false;

            _this15.$feed = $('<div class="crt-feed"></div>').appendTo(_this15.$container);
            _this15.$container.addClass('crt-panel');

            if (_this15.options.panel.fixedHeight) {
                _this15.$container.addClass('crt-panel-fixed-height');
            }

            _this15.$feed.curatorCarousel(_this15.options.panel);
            _this15.$feed.on('curatorCarousel:changed', function (event, carousel, currentSlide) {
                if (!_this15.allLoaded && _this15.options.panel.autoLoad) {
                    if (currentSlide >= _this15.feed.postsLoaded - 4) {
                        _this15.loadMorePosts();
                    }
                }
            });

            // load first set of posts
            _this15.loadPosts(0);
        }
        return _this15;
    }

    _createClass(Panel, [{
        key: 'loadMorePosts',
        value: function loadMorePosts() {
            Curator.log('Carousel->loadMorePosts');

            this.feed.loadPosts(this.feed.currentPage + 1);
        }
    }, {
        key: 'onPostsLoaded',
        value: function onPostsLoaded(posts) {
            Curator.log("Carousel->onPostsLoaded");

            this.loading = false;

            if (posts.length === 0) {
                this.allLoaded = true;
            } else {
                var _that3 = this;
                var $els = [];
                $(posts).each(function () {
                    var p = _that3.createPostElement(this);
                    $els.push(p.$el);
                });

                _that3.$feed.curatorCarousel('add', $els);
                _that3.$feed.curatorCarousel('update');

                this.popupManager.setPosts(posts);

                this.options.onPostsLoaded(this, posts);
            }
        }
    }, {
        key: 'onPostsFail',
        value: function onPostsFail(data) {
            Curator.log("Carousel->onPostsFail");
            this.loading = false;
            this.$feed.html('<p style="text-align: center">' + data.message + '</p>');
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.$feed.curatorCarousel('destroy');
            this.$feed.remove();
            this.$container.removeClass('crt-panel');

            delete this.$feed;
            delete this.$container;
            delete this.options;
            delete this.feed.postsLoaded;
            delete this.loading;
            delete this.allLoaded;

            // TODO add code to cascade destroy down to Feed & Posts
            // unregistering events etc
            delete this.feed;
        }
    }]);

    return Panel;
}(Curator.Client);

Curator.Panel = Panel;

Curator.Config.Grid = $.extend({}, Curator.Config.Defaults, {
    postTemplate: '#gridPostTemplate',
    grid: {
        minWidth: 200,
        rows: 3
    }
});

Curator.Templates.gridPostTemplate = ' \
<div class="crt-post-c">\
    <div class="crt-post post<%=id%> <%=this.contentImageClasses()%> <%=this.contentTextClasses()%>"> \
        <div class="crt-post-content"> \
            <div class="crt-hitarea" > \
                <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" class="spacer" /> \
                <div class="crt-post-content-image" style="background-image: url(<%=image%>);"> </div> \
                <div class="crt-post-content-text-c"> \
                    <div class="crt-post-content-text"> \
                        <%=this.parseText(text)%> \
                    </div> \
                </div> \
                <a href="javascript:;" class="crt-play"><i class="crt-play-icon"></i></a> \
                <span class="crt-social-icon crt-social-icon-normal"><i class="crt-icon-<%=this.networkIcon()%>"></i></span> \
                <div class="crt-post-hover">\
                    <div class="crt-post-header"> \
                        <img src="<%=user_image%>"  /> \
                        <div class="crt-post-name"><span><%=user_full_name%></span><br/><a href="<%=this.userUrl()%>" target="_blank">@<%=user_screen_name%></a></div> \
                    </div> \
                    <div class="crt-post-hover-text"> \
                        <%=this.parseText(text)%> \
                    </div> \
                    <span class="crt-social-icon crt-social-icon-hover"><i class="crt-icon-<%=this.networkIcon()%>"></i></span> \
                </div> \
            </div> \
        </div> \
    </div>\
</div>';

Curator.Templates.gridFeedTemplate = ' \
<div class="crt-feed-window">\
    <div class="crt-feed"></div>\
</div>\
<div class="crt-feed-more"><a href="#">Load more</a></div>';

var Grid = function (_Client2) {
    _inherits(Grid, _Client2);

    function Grid(options) {
        _classCallCheck(this, Grid);

        var _this16 = _possibleConstructorReturn(this, (Grid.__proto__ || Object.getPrototypeOf(Grid)).call(this));

        _this16.setOptions(options, Curator.Config.Grid);

        Curator.log("Grid->init with options:");
        Curator.log(_this16.options);

        _this16.containerHeight = 0;
        _this16.loading = false;
        _this16.feed = null;
        _this16.$container = null;
        _this16.$feed = null;
        _this16.posts = [];
        _this16.totalPostsLoaded = 0;
        _this16.allLoaded = false;
        _this16.previousCol = 0;
        _this16.page = 0;
        _this16.rowsShowing = 0;

        if (_this16.init(_this16)) {

            var tmpl = Curator.Template.render('#gridFeedTemplate', {});
            _this16.$container.append(tmpl);
            _this16.$feed = _this16.$container.find('.crt-feed');
            _this16.$feedWindow = _this16.$container.find('.crt-feed-window');
            _this16.$loadMore = _this16.$container.find('.crt-feed-more a');

            _this16.$container.addClass('crt-grid');

            var cols = Math.floor(_this16.$container.width() / _this16.options.grid.minWidth);
            var postsNeeded = cols * (_this16.options.grid.rows + 1); // get 1 extra row just in case

            if (_this16.options.grid.showLoadMore) {
                // this.$feed.css({
                //     position:'absolute',
                //     left:0,
                //     top:0,
                //     width:'100%'
                // });
                _this16.$feedWindow.css({
                    'position': 'relative'
                });
                // postsNeeded = cols *  (this.options.grid.rows * 2); //
                _this16.$loadMore.click(_this16.onMoreClicked.bind(_this16));
            } else {
                _this16.$loadMore.hide();
            }

            _this16.rowsShowing = _this16.options.grid.rows;

            _this16.feed.options.postsPerPage = postsNeeded;
            _this16.loadPosts(0);
        }

        var to = null;
        var that = _this16;
        $(window).resize(function () {
            clearTimeout(to);
            to = setTimeout(function () {
                that.updateLayout();
            }, 100);
        });
        _this16.updateLayout();

        $(window).on('curatorCssLoaded', function () {
            clearTimeout(to);
            to = setTimeout(function () {
                that.updateLayout();
            }, 100);
        });

        $(document).on('ready', function () {
            clearTimeout(to);
            to = setTimeout(function () {
                that.updateLayout();
            }, 100);
        });
        return _this16;
    }

    _createClass(Grid, [{
        key: 'onPostsLoaded',
        value: function onPostsLoaded(posts) {
            Curator.log("Grid->onPostsLoaded");

            this.loading = false;

            if (posts.length === 0) {
                this.allLoaded = true;
            } else {
                var _that4 = this;
                var postElements = [];
                $(posts).each(function (i) {
                    var p = _that4.createPostElement.call(_that4, this);
                    postElements.push(p.$el);
                    _that4.$feed.append(p.$el);

                    if (_that4.options.animate) {
                        p.$el.css({ opacity: 0 });
                        setTimeout(function () {
                            p.$el.css({ opacity: 0 }).animate({ opacity: 1 });
                        }, i * 100);
                    }
                });

                this.popupManager.setPosts(posts);

                this.options.onPostsLoaded(this, posts);

                this.updateHeight();
            }
        }
    }, {
        key: 'createPostElement',
        value: function createPostElement(postJson) {
            var post = new Curator.Post(postJson, this.options);
            $(post).bind('postClick', $.proxy(this.onPostClick, this));

            if (this.options.onPostCreated) {
                this.options.onPostCreated(post);
            }

            return post;
        }
    }, {
        key: 'onPostsFailed',
        value: function onPostsFailed(data) {
            Curator.log("Grid->onPostsFailed");
            this.loading = false;
            this.$feed.html('<p style="text-align: center">' + data.message + '</p>');
        }
    }, {
        key: 'onPostClick',
        value: function onPostClick(ev, post) {
            this.popupManager.showPopup(post);
        }
    }, {
        key: 'onMoreClicked',
        value: function onMoreClicked(ev) {
            ev.preventDefault();

            this.rowsShowing = this.rowsShowing + this.options.grid.rows;

            this.updateHeight(true);

            this.feed.loadMore();
        }
    }, {
        key: 'updateLayout',
        value: function updateLayout() {
            var cols = Math.floor(this.$container.width() / this.options.grid.minWidth);
            var postsNeeded = cols * this.options.grid.rows;

            this.$container.removeClass('crt-grid-col' + this.previousCol);
            this.previousCol = cols;
            this.$container.addClass('crt-grid-col' + this.previousCol);

            if (postsNeeded > this.feed.postsLoaded) {
                this.loadPosts(this.feed.currentPage + 1);
            }

            this.updateHeight();
        }
    }, {
        key: 'updateHeight',
        value: function updateHeight(animate) {
            var postHeight = this.$container.find('.crt-post-c').width();
            this.$feedWindow.css({ 'overflow': 'hidden' });

            var maxRows = Math.ceil(this.feed.postCount / this.previousCol);
            var rows = this.rowsShowing < maxRows ? this.rowsShowing : maxRows;

            if (animate) {
                this.$feedWindow.animate({ height: rows * postHeight });
            } else {
                this.$feedWindow.height(rows * postHeight);
            }

            if (this.options.grid.showLoadMore) {
                if (this.rowsShowing >= maxRows) {
                    this.$loadMore.hide();
                } else {
                    this.$loadMore.show();
                }
            }
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.$container.empty().removeClass('crt-grid').removeClass('crt-grid-col' + this.previousCol).css({ 'height': '', 'overflow': '' });

            delete this.$feed;
            delete this.$container;
            delete this.options;
            delete this.totalPostsLoaded;
            delete this.loading;
            delete this.allLoaded;

            // TODO add code to cascade destroy down to Feed & Posts
            // unregistering events etc
            delete this.feed;
        }
    }]);

    return Grid;
}(Client);

Curator.Grid = Grid;

var widgetDefaults = {
    feedId: '',
    postsPerPage: 12,
    maxPosts: 0,
    apiEndpoint: 'https://api.curator.io/v1',
    onPostsLoaded: function onPostsLoaded() {}
};

Curator.Custom = Curator.augment.extend(Curator.Client, {
    containerHeight: 0,
    loading: false,
    feed: null,
    $container: null,
    $feed: null,
    posts: [],
    totalPostsLoaded: 0,
    allLoaded: false,

    constructor: function constructor(options) {
        this.uber.setOptions.call(this, options, widgetDefaults);

        Curator.log("Panel->init with options:");
        Curator.log(this.options);

        if (this.uber.init.call(this)) {
            this.$feed = $('<div class="crt-feed"></div>').appendTo(this.$container);
            this.$container.addClass('crt-custom');

            this.loadPosts(0);
        }
    },

    onPostsLoaded: function onPostsLoaded(posts) {
        Curator.log("Custom->onPostsLoaded");

        this.loading = false;

        if (posts.length === 0) {
            this.allLoaded = true;
        } else {
            var that = this;
            var postElements = [];
            $(posts).each(function () {
                var p = that.createPostElement(this);
                postElements.push(p.$el);
                that.$feed.append(p.$el);
            });

            this.popupManager.setPosts(posts);

            this.options.onPostsLoaded(this, posts);
        }
    },

    onPostsFailed: function onPostsFailed(data) {
        Curator.log("Custom->onPostsFailed");
        this.loading = false;
        this.$feed.html('<p style="text-align: center">' + data.message + '</p>');
    },

    onPostClick: function onPostClick(ev, post) {
        this.popupManager.showPopup(post);
    },

    destroy: function destroy() {
        this.$feed.remove();
        this.$container.removeClass('crt-custom');

        delete this.$feed;
        delete this.$container;
        delete this.options;
        delete this.totalPostsLoaded;
        delete this.loading;
        delete this.allLoaded;

        // TODO add code to cascade destroy down to Feed & Posts
        // unregistering events etc
        delete this.feed;
    }

});

	return Curator;
}));