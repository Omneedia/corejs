App.apply(App, {
    $: function (obj, Obj) {
        if (App.isArray(obj)) {
            var elem = [];
            for (var i = 0; i < obj.length; i++) elem.push(obj[i]);
        } else {
            if (App.isElement(obj)) var elem = obj;
            else {
                if (typeof obj === "object") {
                    var appendTo = "-1";
                    var div = document.createElement(obj.type);
                    div.id = 'cmp-' + App.uuid();
                    var arr = App.getObjectProperties(obj);
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] != "type") {
                            App.setObjectProperty(div, arr[i], App.getObjectProperty(obj, arr[i]));
                        };
                    };
                    var elem = div;

                    if (Obj) {
                        App.$(elem).appendTo(App.$(Obj));
                    }
                } else {
                    if (Obj) var doc = Obj;
                    else var doc = document;
                    if (App.isElement(obj)) var elem = obj;
                    else {
                        try {
                            if (obj.indexOf('#') > -1) var elem = doc.getElementById(obj.split('#')[1]);
                            else {
                                var elem = doc.querySelectorAll(obj);
                                if (App.isNodeList(elem)) elem = Array.prototype.slice.call(elem);
                            }
                        } catch (e) {
                            var div = document.createElement('div');
                            div.innerHTML = obj;
                            var elem = [];
                            for (var z = 0; z < div.childNodes.length; z++) elem.push(div.childNodes[z]);
                        }
                    };
                };
            };
        };
        if (!App.isArray(elem)) {
            var tab = [];
            tab.push(elem);
            elem = tab;
        };
        return {
            /**
             * Animate a div using CSS
             * 
             * @param  {String}   animationName
             * 
             * bounce	flash	pulse	rubberBand
             * shake	headShake	swing	tada
             * wobble	jello	bounceIn	bounceInDown
             * bounceInLeft	bounceInRight	bounceInUp	bounceOut
             * bounceOutDown	bounceOutLeft	bounceOutRight	bounceOutUp
             * fadeIn	fadeInDown	fadeInDownBig	fadeInLeft
             * fadeInLeftBig	fadeInRight	fadeInRightBig	fadeInUp
             * fadeInUpBig	fadeOut	fadeOutDown	fadeOutDownBig
             * fadeOutLeft	fadeOutLeftBig	fadeOutRight	fadeOutRightBig
             * fadeOutUp	fadeOutUpBig	flipInX	flipInY
             * flipOutX	flipOutY	lightSpeedIn	lightSpeedOut
             * rotateIn	rotateInDownLeft	rotateInDownRight	rotateInUpLeft
             * rotateInUpRight	rotateOut	rotateOutDownLeft	rotateOutDownRight
             * rotateOutUpLeft	rotateOutUpRight	hinge	jackInTheBox
             * rollIn	rollOut	zoomIn	zoomInDown
             * zoomInLeft	zoomInRight	zoomInUp	zoomOut
             * zoomOutDown	zoomOutLeft	zoomOutRight	zoomOutUp
             * slideInDown	slideInLeft	slideInRight	slideInUp
             * slideOutDown	slideOutLeft	slideOutRight	slideOutUp
             * 
             * @param  {Function} callback
             * 
             */
            animate: function (animationName, callback) {
                var animationEnd = (function (el) {
                    var animations = {
                        animation: 'animationend',
                        OAnimation: 'oAnimationEnd',
                        MozAnimation: 'mozAnimationEnd',
                        WebkitAnimation: 'webkitAnimationEnd',
                    };

                    for (var t in animations) {
                        if (el.style[t] !== undefined) {
                            return animations[t];
                        }
                    }
                })(document.createElement('div'));

                App.$(elem).addClass('animated ' + animationName).one(animationEnd, function () {
                    App.$(elem).removeClass('animated ' + animationName);

                    if (typeof callback === 'function') callback();
                });

                return App.$(elem);
            },
            on: function (property, fn) {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) {
                        elem[i].addEventListener(property, fn);
                    }
                };
            },
            one: function (property, fn) {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) {
                        elem[i].addEventListener(property, function (el) {
                            //fn();
                            el.target.removeEventListener(el.type, arguments.callee);
                            if (fn) fn();
                        });
                    }
                };
            },
            up: function (p) {
                if (!p) return App.$(elem[0].parentNode);
                var obz = elem[0];
                while (obz) {
                    if (obz.parentNode.querySelectorAll(p).length > 0) {
                        return App.$(obz);
                    } else obz = obz.parentNode;
                };
                return false;
            },
            down: function (p) {
                if (!p) return App.$(elem[0].ChildNode);
                var obz = elem[0];
                while (obz) {
                    if (obz.ChildNode.querySelectorAll(p).length > 0) {
                        return App.$(obz);
                    } else obz = obz.ChildNode;
                };
                return false;
            },
            get: function (obj) {
                return App.$(obj, elem[0]);
            },
            attr: function (key, value) {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) {
                        if (!value) return elem[i].getAttribute(key);
                        else {
                            elem[i].setAttribute(key, value);
                        }
                    }
                };
                return App.$(elem);
            },
            dom: function () {
                if (elem.length == 1) return elem[0];
                else return elem;
            },
            css: function (key, value) {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) {
                        if (!value) return elem[i].style[key];
                        else {
                            elem[i].style[key] = value;
                        }
                    }
                };
                return App.$(elem);
            },
            html: function (xhtml) {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) {
                        if (!xhtml) return elem[i].innerHTML;
                        else elem[i].innerHTML = xhtml;
                    }
                };
                return App.$(elem);
            },
            find: function (selector) {
                var elx = elem[0].querySelectorAll(selector);
                return App.$(elx);
            },
            remove: function () {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) elem[i].parentNode.removeChild(elem[i]);
                };
                return App.$(elem);
            },
            click: function (fn) {
                for (var i = 0; i < elem.length; i++) {
                    elem[i].addEventListener('click', fn, true);
                };
                return App.$(elem);
            },
            appendTo: function (div) {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) {
                        if (div.dom) div = div.dom();
                        if (App.isString(div)) {
                            try {
                                div = document.querySelector(div);
                            } catch (e) {
                                var d = document.createElement('div');
                                d.innerHTML = div;
                                div = d;
                            }
                        };
                        if (div) div.appendChild(elem[i]);
                    };
                };
                return App.$(elem);
            },
            addClass: function (cl) {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) {
                        for (var j = 0; j < cl.split(' ').length; j++) elem[i].classList.add(cl.split(' ')[j]);
                    }
                };
                return App.$(elem[0]);
            },
            hasClass: function (cl) {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) return elem.classList.contains(className);
                };
            },
            removeClass: function (cl) {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) {
                        for (var j = 0; j < cl.split(' ').length; j++) elem[i].classList.remove(cl.split(' ')[j]);
                    }
                };
                return App.$(elem);
            },
            show: function () {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) elem[i].style.display = "";
                };
                return App.$(elem);
            },
            hide: function () {
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i]) elem[i].style.display = "none";
                };
                return App.$(elem);
            },
            delay: function (delay) {
                this._delay = delay;
                return App.$(elem);
            },
            fadeOut: function (ms) {
                if (this._delay) {
                    var me = this;
                    setTimeout(function () {
                        me.fadeOut(ms);
                    }, this._delay);
                    return;
                };

                function fade(type, ms) {
                    var isIn = type === 'in',
                        opacity = isIn ? 0 : 1,
                        interval = 50,
                        duration = ms,
                        gap = interval / duration;

                    if (isIn) {
                        App.$(elem).dom().style.display = 'inline';
                        App.$(elem).dom().style.opacity = opacity;
                    }

                    function func() {
                        opacity = isIn ? opacity + gap : opacity - gap;
                        App.$(elem).dom().style.opacity = opacity;

                        if (opacity <= 0) App.$(elem).dom().style.display = 'none'
                        if (opacity <= 0 || opacity >= 1) window.clearInterval(fading);
                    }

                    var fading = window.setInterval(func, interval);
                };
                if (!ms) var ms = 1000;
                fade('out', ms);
                return App.$(elem);
            },
            fadeIn: function (ms) {
                if (this._delay) {
                    var me = this;
                    setTimeout(function () {
                        me.fadeOut(ms);
                    }, this._delay);
                    return;
                };

                function fade(type, ms) {
                    var isIn = type === 'in',
                        opacity = isIn ? 0 : 1,
                        interval = 50,
                        duration = ms,
                        gap = interval / duration;

                    if (isIn) {
                        App.$(elem).dom().style.display = 'inline';
                        App.$(elem).dom().style.opacity = opacity;
                    }

                    function func() {
                        opacity = isIn ? opacity + gap : opacity - gap;
                        App.$(elem).dom().style.opacity = opacity;

                        if (opacity <= 0) App.$(elem).dom().style.display = 'none'
                        if (opacity <= 0 || opacity >= 1) window.clearInterval(fading);
                    }

                    var fading = window.setInterval(func, interval);
                };
                if (!ms) var ms = 1000;
                fade('in', ms);
                return App.$(elem);
            },
            is: function (el) {
                var matches = function (el, selector) {
                    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
                };
                if (el.indexOf('#')) return App.$(elem).dom() === el;
                else return matches(App.$(elem).dom(), el);
            },
            next: function () {
                return App.$(App.$(elem).dom().nextElementSibling);
            },
            prev: function () {
                return App.$(App.$(elem).dom().previousElementSibling);
            }
        }
    }
})