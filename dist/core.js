/**
 * omneedia Framework
 * CORE JS
 * Copyright 2016-2019 Stéphane Zucatti
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this 
 * software and associated documentation files (the "Software"), to deal in the Software 
 * without restriction, including without limitation the rights to use, copy, modify, 
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to 
 * permit persons to whom the Software is furnished to do so, subject to the following 
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE 
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE 
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */

(function (global, document, modules, factories, init) { // eslint-disable-line

    "use strict"

    global.App = global.App || {
        version: '0.0.8',
        versionDetail: {
            major: 0,
            minor: 0,
            patch: 8
        },
        unload: function (name) {
            delete modules[name]
            // This probably doesn't exist, but just in case
            delete factories[name]
        },

        defined: function (name) {
            return name in modules
        },

        required: function (name) {
            return name in modules && !(name in factories)
        },

        module: function (name, value) {
            if (name in modules) {
                throw Error("Module already defined: " + name)
            }

            modules[name] = value != null ? value : {}
            // This probably doesn't exist, but just in case
            delete factories[name]
        },
        load: function (ns, name, callback) {
            if (callback == null) {
                callback = name
                name = ns
                ns = null
            }

            function load() {
                if (ns != null) {
                    try {
                        ns = init(ns)
                    } catch (e) {
                        return callback(e)
                    }
                }

                callback(null, ns)
            }

            if (document != null) {
                var el = document.createElement("script")

                el.src = name

                el.onload = function (ev) {
                    ev.preventDefault()
                    ev.stopPropagation()

                    // Remove the node after it loads.
                    document.body.removeChild(el)
                    load()
                }

                el.onerror = function (ev) {
                    ev.preventDefault()
                    ev.stopPropagation()

                    // Remove the node after it loads.
                    document.body.removeChild(el)
                    callback(ev)
                }

                document.body.appendChild(el)
            } else {
                setTimeout(function () {
                    try {
                        importScripts(name)
                    } catch (e) {
                        return callback(e)
                    }

                    load()
                }, 0)
            }
        },
        loader: function (ll, ndx, cb) {
            if (!cb) {
                cb = ndx;
                ndx = 0
            };
            if (!ll[ndx]) return cb();
            var me = this;
            this.load(ll[ndx], function () {
                me.loader(ll, ndx + 1, cb);
            })
        }
    }
})(this, this.document, Object.create(null), Object.create(null));

/**
 * Copies all the properties of config to obj.
 * @param {Object} obj The receiver of the properties
 * @param {Object} config The source of the properties
 * @param {Object} defaults A different object that will also be applied for default values
 * @return {Object} returns obj
 * @member App apply
 */
App.apply = function (o, c, defaults) {
    // no "this" reference for friendly out of scope calls
    if (defaults) {
        App.apply(o, defaults);
    }
    if (o && c && typeof c == 'object') {
        for (var p in c) {
            o[p] = c[p];
        }
    }
    return o;
};

/**
 * Current Script Path
 *
 * Get the dir path to the currently executing script file
 * which is always the last one in the scripts array with
 * an [src] attr
 */
App.apply(App, {
    global: (function () {
        return this;
    })(),
    current: {
        path: function () {
            var scripts = document.querySelectorAll('script[src]');
            var currentScript = scripts[scripts.length - 1].src;
            var currentScriptChunks = currentScript.split('/');
            var currentScriptFile = currentScriptChunks[currentScriptChunks.length - 1];
            return currentScript.replace(currentScriptFile, '');
        },
        file: function () {
            var scripts = document.querySelectorAll('script[src]');
            var currentScript = scripts[scripts.length - 1].src;
            var currentScriptChunks = currentScript.split('/');
            var currentScriptFile = currentScriptChunks[currentScriptChunks.length - 1];
            return currentScriptFile;
        }
    },
    log: function (typ, str) {
        if (!str) {
            str = typ;
            typ = "log";
        };
        var date = new Date();
        var time = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + (date.getDay() + 1)).slice(-2) + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        var script = "Script: " + App.current.file();
        if ((typeof str === "object") && (str !== null)) {
            str = JSON.stringify(str, null, 4);
        };
        if (typ.toLowerCase() == "log") {
            console.log('%c  LOG  ', 'border:1px solid green;padding:5px;margin-bottom:4px;font-weight:bold;background-color:#FFFFFF;font-size:14px;padding:0px;color:green', '\t' + time + '\n\t\t\t' + script + '\n\n', str, '\n\n');
        }
        if (typ.toLowerCase() == "err") {
            console.log('%c  ERR  ', 'border:1px solid red;padding:5px;margin-bottom:4px;font-weight:bold;background-color:#FFFFFF;font-size:14px;padding:0px;color:red', '\t' + time + '\n\t\t\t' + script + '\n\n', str, '\n\n');
        }
    },
    classManager: {
        modules: [],
        callback: function () {
            console.log('rrrr');
        },
        add: function (ns) {
            if (this.modules.indexOf(ns) == -1) this.modules.push(ns);
        },
        isRegistered: function (ns) {
            try {
                var p = window.eval(ns);
                if (p) return true;
                else return false;
            } catch (e) {
                return false;
            }
        },
        register: function (ns, cb) {
            App.require(ns, function () {
                setTimeout(function () {
                    var temoin = false;
                    for (var i = 0; i < ns.length; i++) {
                        if (!App.classManager.isRegistered(ns[i])) temoin = true;
                    };
                    if (temoin === false) return cb();
                }, 100);
            });
        }
    },
    namespaceCache: {},
    namespace: function (namespace, constructor, extend) {
        var cache = App.namespaceCache,
            ns = cache[namespace],
            i, n, part, parts, partials;
        if (!ns) {
            ns = App.global;

            if (namespace) {
                partials = [];
                parts = namespace.split('.');
                for (i = 0, n = parts.length; i < n; ++i) {
                    part = parts[i];
                    if (constructor) {
                        if (extend) ns = ns[part] || (ns[part] = (function () {
                            var _p = eval(extend);
                            _p.apply(this, arguments);
                            return constructor;
                        })());
                        else ns = ns[part] || (ns[part] = constructor);
                    } else ns = ns[part] || (ns[part] = {});
                    partials.push(part);
                    cache[partials.join('.')] = ns; // build up prefixes as we go
                }
            }
        };
        return ns;
    },
    require: function (o, cb, ndx) {
        function lpath(x) {
            function inArray(t, x) {
                for (var i = 0; i < t.length; i++) {
                    if (t[i] == x.substr(0, t[i].length)) {
                        var js = App.files.paths[t[i]] + x.split(t[i])[1].replace(/\./g, '/') + '.js';
                        for (var el in App.files.paths) {
                            if (el.indexOf('#') > -1) {
                                var replace = el;
                                var re = new RegExp(replace, "g");
                                var value = App.files.paths[el];
                                if (value == "./") value = App.base;
                                js = js.replace(re, value);
                            }
                        };
                        if (js.indexOf('file') > -1) {
                            var _uri = js.split('file:///')[1];
                            js = "file:///" + _uri.replace(/([^:]\/)\/+/g, "$1");
                        } else {
                            var _uri = js.split('://');
                            js = _uri[0] + '://' + _uri[1].replace(/([^:]\/)\/+/g, "$1");
                        };
                        return js;
                    };
                };
                return x;
            };
            var tabs = [];
            for (var el in App.files.paths) tabs.push(el);
            return inArray(tabs, x);
        };
        if (!ndx) ndx = 0;
        if (!o[ndx]) return cb();
        var item = o[ndx];
        if (App.classManager.isRegistered(item)) return App.require(o, cb, ndx + 1);
        if (item.indexOf('.') > -1) {
            var uri = lpath(item);
            App.load(uri, function (err) {
                if (err) return App.log('ERR', item + ' not found.');
                App.require(o, cb, ndx + 1);
            })
        }
    },
    application: function (o) {
        if (!o) return App.log("ERR", "Application must be defined");

        var prepend = "https://unpkg.com/";
        if (App.current.path().indexOf(prepend) > -1)
            App.base = prepend + '@omneedia/core@' + App.version + '/dist';
        else
            App.base = App.current.path();

        App.load(App.base + '/core/loader.js', function (err) {
            if (!App.files) return App.log("ERR", "Omneedia Framework [" + App.version + "] not found");
            App.files.cdn = App.base;
            if (o.paths) App.apply(App.files.paths, o.paths);
            window.onload = function () {
                function loading(o, ndx, cb) {
                    if (!o[ndx]) return cb();
                    App.load(o[ndx].url, function (e) {
                        App.module(o[ndx].module, window.eval(o[ndx].module));
                        loading(o, ndx + 1, cb);
                    });
                };
                var tabs = [];
                for (var el in App.files.dependencies) tabs.push({
                    module: el,
                    url: prepend + App.files.dependencies[el]
                });

                loading(tabs, 0, function () {

                    tabs = [];
                    for (var i = 0; i < App.files.js.length; i++) tabs.push(App.files.cdn + '/core/js/' + App.files.js[i] + ".js");

                    App.loader(tabs, function (err) {
                        init = function () {
                            var tabs = [];
                            for (var el in o.dependencies) tabs.push({
                                module: el,
                                url: prepend + o.dependencies[el]
                            });
                            loading(tabs, 0, function () {
                                if (o.require) {
                                    App.classManager.register(o.require, o.launch);
                                } else o.launch();
                            });
                        };
                        if (o.require) App.classManager.register(o.require, init);
                        else init();
                    });

                });

            }
        });
    }
});