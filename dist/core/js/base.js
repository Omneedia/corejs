Object.create || (Object.create = function () {
    function F() {}
    return function (o) {
        if (1 !== arguments.length) throw new Error("Object.create implementation only accepts one parameter.");
        F.prototype = o;
        return new F();
    };
}());

function inheritPrototype(childObject, parentObject) {
    // As discussed above, we use the Crockford’s method to copy the properties and methods from the parentObject onto the childObject
    // So the copyOfParent object now has everything the parentObject has 
    var copyOfParent = Object.create(parentObject.prototype);

    //Then we set the constructor of this new object to point to the childObject.
    // Why do we manually set the copyOfParent constructor here, see the explanation immediately following this code block.
    copyOfParent.constructor = childObject;

    // Then we set the childObject prototype to copyOfParent, so that the childObject can in turn inherit everything from copyOfParent (from parentObject)
    childObject.prototype = copyOfParent;
}

App.apply(App, {
    extend: function (destination, source) {
        for (var k in source) {
            if (source.hasOwnProperty(k)) {
                destination[k] = source[k];
            }
        }
        return destination;
    },
    isEmpty: function (value, allowEmptyString) {
            return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (App.isArray(value) && value.length === 0);
        }
        /**
         * Returns true if the passed value is a NodeList, false otherwise.
         *
         * @param {Object} target The target to test
         * @return {Boolean}
         * @method
         */
        ,
    isNodeList: function (nodes) {
        return NodeList.prototype.isPrototypeOf(nodes)
    },
    /**
     * Returns true if the passed value is a JavaScript Array, false otherwise.
     *
     * @param {Object} target The target to test
     * @return {Boolean}
     * @method
     */
    isArray: ('isArray' in Array) ? Array.isArray : function (value) {
        return toString.call(value) === '[object Array]';
    },
    /**
     * Returns true if the passed value is a JavaScript Date object, false otherwise.
     * @param {Object} object The object to test
     * @return {Boolean}
     */
    isDate: function (value) {
        return toString.call(value) === '[object Date]';
    },
    /**
     * Returns true if the passed value is a JavaScript Object, false otherwise.
     * @param {Object} value The value to test
     * @return {Boolean}
     * @method
     */
    isObject: (toString.call(null) === '[object Object]') ? function (value) {
        // check ownerDocument here as well to exclude DOM nodes
        return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
    } : function (value) {
        return toString.call(value) === '[object Object]';
    },
    /**
     * @private
     */
    isSimpleObject: function (value) {
        return value instanceof Object && value.constructor === Object;
    },
    /**
     * Returns true if the passed value is a JavaScript 'primitive', a string, number or boolean.
     * @param {Object} value The value to test
     * @return {Boolean}
     */
    isPrimitive: function (value) {
        var type = typeof value;
        return type === 'string' || type === 'number' || type === 'boolean';
    },
    /**
     * Returns true if the passed value is a JavaScript Function, false otherwise.
     * @param {Object} value The value to test
     * @return {Boolean}
     * @method
     */
    isFunction:
        // Safari 3.x and 4.x returns 'function' for typeof <NodeList>, hence we need to fall back to using
        // Object.prototype.toString (slower)
        (typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function') ? function (value) {
            return !!value && toString.call(value) === '[object Function]';
        } : function (value) {
            return !!value && typeof value === 'function';
        },
    /**
     * Returns true if the passed value is a number. Returns false for non-finite numbers.
     * @param {Object} value The value to test
     * @return {Boolean}
     */
    isNumber: function (value) {
        return typeof value === 'number' && isFinite(value);
    },
    /**
     * Validates that a value is numeric.
     * @param {Object} value Examples: 1, '1', '2.34'
     * @return {Boolean} True if numeric, false otherwise
     */
    isNumeric: function (value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },
    /**
     * Returns true if the passed value is a string.
     * @param {Object} value The value to test
     * @return {Boolean}
     */
    isString: function (value) {
        return typeof value === 'string';
    },
    /**
     * Returns true if the passed value is a boolean.
     *
     * @param {Object} value The value to test
     * @return {Boolean}
     */
    isBoolean: function (value) {
        return typeof value === 'boolean';
    },
    /**
     * Returns true if the passed value is an HTMLElement
     * @param {Object} value The value to test
     * @return {Boolean}
     */
    isElement: function (value) {
        return value ? value.nodeType === 1 : false;
    },
    /**
     * Returns true if the passed value is a TextNode
     * @param {Object} value The value to test
     * @return {Boolean}
     */
    isTextNode: function (value) {
        return value ? value.nodeName === "#text" : false;
    },
    /**
     * Returns true if the passed value is defined.
     * @param {Object} value The value to test
     * @return {Boolean}
     */
    isDefined: function (value) {
        return typeof value !== 'undefined';
    },
    /**
     * Returns `true` if the passed value is iterable, that is, if elements of it are addressable using array
     * notation with numeric indices, `false` otherwise.
     *
     * Arrays and function `arguments` objects are iterable. Also HTML collections such as `NodeList` and `HTMLCollection'
     * are iterable.
     *
     * @param {Object} value The value to test
     * @return {Boolean}
     */
    isIterable: function (value) {
        // To be iterable, the object must have a numeric length property and must not be a string or function.
        if (!value || typeof value.length !== 'number' || typeof value === 'string' || App.isFunction(value)) {
            return false;
        }
        // Certain "standard" collections in IE (such as document.images) do not offer the correct
        // Javascript Object interface; specifically, they lack the propertyIsEnumerable method.
        // And the item property while it does exist is not typeof "function"
        if (!value.propertyIsEnumerable) {
            return !!value.item;
        }
        // If it is a regular, interrogatable JS object (not an IE ActiveX object), then...
        // If it has its own property called "length", but not enumerable, it's iterable
        if (value.hasOwnProperty('length') && !value.propertyIsEnumerable('length')) {
            return true;
        }
        // Test against whitelist which includes known iterable collection types
        return iterableRe.test(toString.call(value));
    }
});

App.apply(App, {
    create: function (ns, o) {
        try {
            var item = window.eval(ns);
            return new item(o);
        } catch (e) {
            App.error(ns + ' not found.', e);
        }
    },
    define: function (namespace, o, cb) {
        var me = this;

        init = function () {

            var x = function (arg0) {
                for (var el in o.properties) this[el] = o.properties[el];
                //for (var el in o.methods) this[el] = o.methods[el];
                if (o.extend) {
                    if (App.isArray(o.extend)) {
                        for (var i = 0; i < o.extend.length; i++) {
                            if (App.isString(o.extend[i])) var xtd = window.eval(o.extend[i]);
                            else var xtd = o.extend[i];
                            xtd.call(this);
                        }
                    } else {
                        if (App.isString(o.extend)) var xtd = window.eval(o.extend);
                        else var xtd = o.extend;
                        xtd.call(this);
                    }

                };
                if (arg0) {
                    for (var el in arg0) {
                        this[el] = arg0[el];
                    }
                };
                o.$this = this;
                o.constructor.call(null, o);
            };

            App.classManager.add(namespace);

            if (o.extend) {

                if (App.isArray(o.extend)) {
                    for (var i = 0; i < o.extend.length; i++) {
                        if (App.isString(o.extend[i])) var xtd = window.eval(o.extend[i]);
                        else var xtd = o.extend[i];
                        App.extend(x.prototype, xtd);
                    }
                } else {
                    if (App.isString(o.extend)) var xtd = window.eval(o.extend);
                    else var xtd = o.extend;
                    x.prototype = Object.create(xtd.prototype);
                };
                x.prototype.constructor = x;
            } else x.prototype = new Object();

            for (var el in o.properties) x.prototype[el] = o.properties[el];
            for (var el in o.methods) x.prototype[el] = o.methods[el];

            App.namespace(namespace, x);

            if (cb) cb(x);
        };
        if (o.dependencies) {
            var prepend = App.cdn.pkg;

            function loading(o, ndx, cb) {
                if (!o[ndx]) return cb();
                App.load(o[ndx].url, function (e) {
                    loading(o, ndx + 1, cb);
                });
            };
            var tabs = [];
            for (var el in o.dependencies) tabs.push({
                module: el,
                url: prepend + o.dependencies[el]
            });
            loading(tabs, 0, function () {
                if (o.require) return App.require(o.require, init);
                else init();
            });
        } else {
            if (o.require) return App.require(o.require, init);
            else init();
        }
    }
});

App.apply(App, {
    widget: function (w) {

    }
});