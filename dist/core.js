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
        version: '0.0.9',
        versionDetail: {
            major: 0,
            minor: 0,
            patch: 9
        },
        cdn: {
            pkg: "https://unpkg.com/"
        },
        dependencies: [],
        scripts: [],
        load: function (name, callback) {
            var module;
            if (typeof name === "object") {
                module = name.module;
                name = name.url;
            } else {
                module = -1;
            };

            if (App.scripts.indexOf(name) > -1) {
                if (module != -1) {
                    if (App.dependencies.indexOf(module) == -1) App.dependencies.push(module);
                };
                return callback();
            };

            name = App.getPath(name);

            var el = document.createElement("script")

            el.src = name

            el.onload = function (ev) {

                ev.preventDefault();
                ev.stopPropagation();

                // Remove the node after it loads.
                App.scripts.push(name);
                if (module != -1) App.dependencies.push(module);
                document.getElementsByTagName('head')[0].removeChild(el);
                callback();
            }

            el.onerror = function (ev) {

                ev.preventDefault();
                ev.stopPropagation();

                // Remove the node after it loads.
                document.getElementsByTagName('head')[0].removeChild(el);
                callback(ev);
            };

            document.getElementsByTagName('head')[0].appendChild(el);
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
    error: function (str, o) {
        var date = new Date();
        var time = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + (date.getDay() + 1)).slice(-2) + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        var stacks = [
            '"\\n%c  ERR  %c\t' + time + '\\n\\n%c ' + str + '\\n' + '"',
            '"border:1px solid red;padding:5px;margin-bottom:4px;font-weight:bold;background-color:#FFFFFF;font-size:14px;padding:0px;color:red"',
            '"font-weight:bold"',
            '"color:blue;font-weight:;font-size:14px"'
        ];
        window.eval('console.log(' + stacks.join(',') + ')');
    },
    classManager: {
        modules: [],
        callback: function () {

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
                    else App.classManager.register(ns, cb);
                }, 10);
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
    getPath: function (x) {
        function inArray(t, x) {
            for (var i = 0; i < t.length; i++) {
                if (t[i] == x.substr(0, t[i].length)) {
                    if (x.indexOf('.') == -1)
                        var js = x + '.js';
                    else
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
            if (x.indexOf('file') > -1) {
                var _uri = x.split('file:///')[1];
                x = "file:///" + _uri.replace(/([^:]\/)\/+/g, "$1");
            } else {
                var _uri = x.split('://');
                x = _uri[0] + '://' + _uri[1].replace(/([^:]\/)\/+/g, "$1");
            };
            return x;
        };
        var tabs = [];
        if (App.files) {
            for (var el in App.files.paths) tabs.push(el);
        };
        return inArray(tabs, x);
    },
    require: function (o, cb, ndx) {
        if (!ndx) ndx = 0;
        if (!o[ndx]) return cb();
        var item = o[ndx];
        if (App.classManager.isRegistered(item)) return App.require(o, cb, ndx + 1);
        if (item.indexOf('.') > -1) {
            var uri = App.getPath(item);
            App.load(uri, function (err) {
                if (err) return App.log('ERR', item + ' not found.');
                App.require(o, cb, ndx + 1);
            })
        }
    },
    application: function (o) {
        if (!o) return App.error("Application must be defined");

        var prepend = App.cdn.pkg;
        if (App.current.path().indexOf(prepend) > -1)
            App.base = prepend + '@omneedia/core@' + App.version + '/dist';
        else
            App.base = App.current.path();

        App.load(App.base + '/core/loader.js', function (err) {

            if (!App.files) return App.error("Omneedia Framework [" + App.version + "] not found");
            App.files.cdn = App.base;
            if (o.paths) App.apply(App.files.paths, o.paths);
            window.addEventListener('load', function () {
                var tabs = [];
                for (var el in App.files.dependencies) tabs.push({
                    module: el,
                    url: prepend + App.files.dependencies[el]
                });

                App.loader(tabs, function () {

                    tabs = [];
                    for (var i = 0; i < App.files.js.length; i++) tabs.push(App.files.js[i]);

                    App.loader(tabs, function (err) {
                        init = function () {
                            var tabs = [];
                            for (var el in o.dependencies) tabs.push({
                                module: el,
                                url: prepend + o.dependencies[el]
                            });
                            App.loader(tabs, function () {
                                if (o.require) {
                                    App.classManager.register(o.require, o.launch);
                                } else o.launch();
                            });
                        };
                        if (o.require) App.classManager.register(o.require, init);
                        else init();
                    });

                });

            });
        });
    }
});