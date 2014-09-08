goog.provide('engine.prim.prims');
goog.require('engine.core.abstractagentset');
goog.require('engine.core.link');
goog.require('engine.core.nobody');
goog.require('engine.core.patch');
goog.require('engine.core.patchset');
goog.require('engine.core.turtle');
goog.require('engine.core.turtleset');
goog.require('shim.lodash');
goog.require('shim.printer');
goog.require('shim.random');
goog.require('shim.strictmath');
goog.require('util.comparator');
goog.require('util.exception');
goog.require('util.typechecker');
goog.require('agents.patch');
var Prims;
engine.prim.prims = Prims = function () {
    function Prims(_dumper, _hasher) {
        this._dumper = _dumper;
        this._hasher = _hasher;
    }
    Prims.prototype.empty = function (xs) {
        return xs.length === 0;
    };
    Prims.prototype.isBreed = function (breedName, x) {
        if (x.isBreed != null && x.id !== -1) {
            return x.isBreed(breedName);
        } else {
            return false;
        }
    };
    Prims.prototype.equality = function (a, b) {
        var subsumes;
        if (a != null && b != null) {
            return a === b || (util.typechecker(a).isArray() && util.typechecker(b).isArray() ? a.length === b.length && a.every(function (_this) {
                return function (elem, i) {
                    return _this.equality(elem, b[i]);
                };
            }(this)) : a instanceof engine.core.abstractagentset && b instanceof engine.core.abstractagentset ? (subsumes = function (_this) {
                return function (xs, ys) {
                    var index, x, _i, _len;
                    for (index = _i = 0, _len = xs.length; _i < _len; index = ++_i) {
                        x = xs[index];
                        if (!_this.equality(ys[index], x)) {
                            return false;
                        }
                    }
                    return true;
                };
            }(this), a.size() === b.size() && Object.getPrototypeOf(a) === Object.getPrototypeOf(b) && subsumes(a.toArray(), b.toArray())) : a instanceof engine.core.abstractagentset && a.getBreedName != null && a.getBreedName() === b.name || b instanceof engine.core.abstractagentset && b.getBreedName != null && b.getBreedName() === a.name || a === engine.core.nobody && b.id === -1 || b === engine.core.nobody && a.id === -1 || (a instanceof engine.core.turtle || a instanceof engine.core.link) && a.compare(b) === util.comparator.EQUALS);
        } else {
            throw new util.exception.NetLogoException('Checking equality on undefined is an invalid condition');
        }
    };
    Prims.prototype.lt = function (a, b) {
        if (util.typechecker(a).isString() && util.typechecker(b).isString() || util.typechecker(a).isNumber() && util.typechecker(b).isNumber()) {
            return a < b;
        } else if (typeof a === typeof b && a.compare != null && b.compare != null) {
            return a.compare(b) === util.comparator.LESS_THAN;
        } else {
            throw new util.exception.NetLogoException('Invalid operands to `lt`');
        }
    };
    Prims.prototype.gt = function (a, b) {
        if (util.typechecker(a).isString() && util.typechecker(b).isString() || util.typechecker(a).isNumber() && util.typechecker(b).isNumber()) {
            return a > b;
        } else if (typeof a === typeof b && a.compare != null && b.compare != null) {
            return a.compare(b) === util.comparator.GREATER_THAN;
        } else {
            throw new util.exception.NetLogoException('Invalid operands to `gt`');
        }
    };
    Prims.prototype.lte = function (a, b) {
        return this.lt(a, b) || this.equality(a, b);
    };
    Prims.prototype.gte = function (a, b) {
        return this.gt(a, b) || this.equality(a, b);
    };
    Prims.prototype.random = function (n) {
        var truncated;
        truncated = n >= 0 ? Math.ceil(n) : Math.floor(n);
        if (truncated === 0) {
            return 0;
        } else if (truncated > 0) {
            return shim.random.nextLong(truncated);
        } else {
            return -shim.random.nextLong(-truncated);
        }
    };
    Prims.prototype.randomFloat = function (n) {
        return n * shim.random.nextDouble();
    };
    Prims.prototype.list = function () {
        var xs;
        xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return xs;
    };
    Prims.prototype.item = function (n, xs) {
        return xs[n];
    };
    Prims.prototype.first = function (xs) {
        return xs[0];
    };
    Prims.prototype.last = function (xs) {
        return xs[xs.length - 1];
    };
    Prims.prototype.fput = function (x, xs) {
        return [x].concat(xs);
    };
    Prims.prototype.lput = function (x, xs) {
        var result;
        result = xs.slice(0);
        result.push(x);
        return result;
    };
    Prims.prototype.butFirst = function (xs) {
        return xs.slice(1);
    };
    Prims.prototype.butLast = function (xs) {
        return xs.slice(0, xs.length - 1);
    };
    Prims.prototype.length = function (xs) {
        return xs.length;
    };
    Prims.prototype._int = function (n) {
        return n | 0;
    };
    Prims.prototype.mod = function (a, b) {
        return __modulo(a, b);
    };
    Prims.prototype.max = function (xs) {
        return Math.max.apply(Math, xs);
    };
    Prims.prototype.min = function (xs) {
        return Math.min.apply(Math, xs);
    };
    Prims.prototype.mean = function (xs) {
        return this.sum(xs) / xs.length;
    };
    Prims.prototype.sum = function (xs) {
        return xs.reduce(function (a, b) {
            return a + b;
        }, 0);
    };
    Prims.prototype.precision = function (n, places) {
        var multiplier, result;
        multiplier = Math.pow(10, places);
        result = Math.floor(n * multiplier + 0.5) / multiplier;
        if (places > 0) {
            return result;
        } else {
            return Math.round(result);
        }
    };
    Prims.prototype.reverse = function (xs) {
        if (util.typechecker(xs).isArray()) {
            return xs.slice(0).reverse();
        } else if (typeof xs === 'string') {
            return xs.split('').reverse().join('');
        } else {
            throw new util.exception.NetLogoException('can only reverse lists and strings');
        }
    };
    Prims.prototype.sort = function (xs) {
        var agentClasses, forAll;
        if (util.typechecker(xs).isArray()) {
            forAll = function (f) {
                return shim.lodash.all(xs, f);
            };
            agentClasses = [
                engine.core.turtle,
                engine.core.patch,
                engine.core.link
            ];
            if (shim.lodash(xs).isEmpty()) {
                return xs;
            } else if (forAll(function (x) {
                    return util.typechecker(x).isNumber();
                })) {
                return xs.slice(0).sort(function (x, y) {
                    return util.comparator.numericCompare(x, y).toInt;
                });
            } else if (forAll(function (x) {
                    return util.typechecker(x).isString();
                })) {
                return xs.slice(0).sort();
            } else if (shim.lodash(agentClasses).some(function (agentClass) {
                    return forAll(function (x) {
                        return x instanceof agentClass || x.name === agents.patch.PATCH_NAME;
                    });
                })) {
                return xs.slice(0).sort(function (x, y) {
                    return x.compare(y).toInt;
                });
            } else {
                throw new util.exception.NetLogoException('We don\'t know how to sort your kind here!');
            }
        } else if (xs instanceof engine.core.abstractagentset) {
            return xs.sort();
        } else {
            throw new util.exception.NetLogoException('can only sort lists and agentsets');
        }
    };
    Prims.prototype.removeDuplicates = function (xs) {
        var f, out, _ref;
        if (xs.length < 2) {
            return xs;
        } else {
            f = function (_this) {
                return function (_arg, x) {
                    var accArr, accSet, hash, values;
                    accArr = _arg[0], accSet = _arg[1];
                    hash = _this._hasher(x);
                    values = accSet[hash];
                    if (values != null) {
                        if (!shim.lodash(values).some(function (y) {
                                return _this.equality(x, y);
                            })) {
                            accArr.push(x);
                            values.push(x);
                        }
                    } else {
                        accArr.push(x);
                        accSet[hash] = [x];
                    }
                    return [
                        accArr,
                        accSet
                    ];
                };
            }(this);
            _ref = xs.reduce(f, [
                [],
                {}
            ]), out = _ref[0], _ref[1];
            return out;
        }
    };
    Prims.prototype.outputPrint = function (x) {
        shim.printer(this._dumper(x));
    };
    Prims.prototype.patchSet = function () {
        var addPatch, buildFromAgentSet, buildItems, flattened, hashIt, hashSet, head, inputs, result;
        inputs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        flattened = shim.lodash(inputs).flatten().value();
        if (shim.lodash(flattened).isEmpty()) {
            return new engine.core.patchset([]);
        } else if (flattened.length === 1) {
            head = flattened[0];
            if (head instanceof engine.core.patchset) {
                return head;
            } else if (head instanceof engine.core.patch || head.name === agents.patch.PATCH_NAME) {
                return new engine.core.patchset([head]);
            } else {
                return new engine.core.patchset([]);
            }
        } else {
            result = [];
            hashSet = {};
            hashIt = this._hasher;
            addPatch = function (p) {
                var hash;
                hash = hashIt(p);
                if (!hashSet.hasOwnProperty(hash)) {
                    result.push(p);
                    hashSet[hash] = true;
                }
            };
            buildFromAgentSet = function (agentSet) {
                return agentSet.forEach(addPatch);
            };
            buildItems = function (_this) {
                return function (inputs) {
                    var input, _i, _len, _results;
                    _results = [];
                    for (_i = 0, _len = inputs.length; _i < _len; _i++) {
                        input = inputs[_i];
                        if (util.typechecker(input).isArray()) {
                            _results.push(buildItems(input));
                        } else if (input instanceof engine.core.patch || input.name === agents.patch.PATCH_NAME) {
                            _results.push(addPatch(input));
                        } else if (input !== engine.core.nobody) {
                            _results.push(buildFromAgentSet(input));
                        } else {
                            _results.push(void 0);
                        }
                    }
                    return _results;
                };
            }(this);
            buildItems(flattened);
            return new engine.core.patchset(result);
        }
    };
    Prims.prototype.repeat = function (n, fn) {
        var _i;
        for (_i = 0; 0 <= n ? _i < n : _i > n; 0 <= n ? _i++ : _i--) {
            fn();
        }
    };
    Prims.prototype.every = function (time, fn) {
        shim.printer('Warning: The `every` primitive is not yet properly supported.');
        fn();
    };
    Prims.prototype.subtractHeadings = function (h1, h2) {
        var diff;
        if (h1 < 0 || h1 >= 360) {
            h1 = (h1 % 360 + 360) % 360;
        }
        if (h2 < 0 || h2 >= 360) {
            h2 = (h2 % 360 + 360) % 360;
        }
        diff = h1 - h2;
        if (diff > -180 && diff <= 180) {
            return diff;
        } else if (diff > 0) {
            return diff - 360;
        } else {
            return diff + 360;
        }
    };
    Prims.prototype.boom = function () {
        throw new util.exception.NetLogoException('boom!');
    };
    Prims.prototype.member = function (x, xs) {
        if (util.typechecker(xs).isArray()) {
            return shim.lodash(xs).some(function (_this) {
                return function (y) {
                    return _this.equality(x, y);
                };
            }(this));
        } else if (util.typechecker(x).isString()) {
            return xs.indexOf(x) !== -1;
        } else {
            return xs.exists(function (a) {
                return x === a;
            });
        }
    };
    Prims.prototype.position = function (x, xs) {
        var index;
        index = util.typechecker(xs).isArray() ? shim.lodash(xs).findIndex(function (_this) {
            return function (y) {
                return _this.equality(x, y);
            };
        }(this)) : xs.indexOf(x);
        if (index !== -1) {
            return index;
        } else {
            return false;
        }
    };
    Prims.prototype.remove = function (x, xs) {
        if (util.typechecker(xs).isArray()) {
            return shim.lodash(xs).filter(function (_this) {
                return function (y) {
                    return !_this.equality(x, y);
                };
            }(this)).value();
        } else {
            return xs.replace(new RegExp(x, 'g'), '');
        }
    };
    Prims.prototype.removeItem = function (n, xs) {
        var post, pre, temp;
        if (util.typechecker(xs).isArray()) {
            temp = xs.slice(0);
            temp.splice(n, 1);
            return temp;
        } else {
            pre = xs.slice(0, n);
            post = xs.slice(n + 1);
            return pre + post;
        }
    };
    Prims.prototype.replaceItem = function (n, xs, x) {
        var post, pre, temp;
        if (util.typechecker(xs).isArray()) {
            temp = xs.slice(0);
            temp.splice(n, 1, x);
            return temp;
        } else {
            pre = xs.slice(0, n);
            post = xs.slice(n + 1);
            return pre + x + post;
        }
    };
    Prims.prototype.sublist = function (xs, n1, n2) {
        return xs.slice(n1, n2);
    };
    Prims.prototype.substring = function (xs, n1, n2) {
        return xs.substr(n1, n2 - n1);
    };
    Prims.prototype.sentence = function () {
        var f, xs;
        xs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        f = function (acc, x) {
            if (util.typechecker(x).isArray()) {
                return acc.concat(x);
            } else {
                acc.push(x);
                return acc;
            }
        };
        return shim.lodash(xs).foldl(f, []);
    };
    Prims.prototype.variance = function (xs) {
        var count, mean, numbers, squareOfDifference, sum;
        numbers = shim.lodash(xs).filter(function (x) {
            return util.typechecker(x).isNumber();
        });
        count = numbers.size();
        if (count < 2) {
            throw new util.exception.NetLogoException('Can\'t find the variance of a list without at least two numbers');
        }
        sum = numbers.foldl(function (acc, x) {
            return acc + x;
        }, 0);
        mean = sum / count;
        squareOfDifference = numbers.foldl(function (acc, x) {
            return acc + shim.strictmath.pow(x - mean, 2);
        }, 0);
        return squareOfDifference / (count - 1);
    };
    Prims.prototype.breedOn = function (breedName, x) {
        var patches, turtles;
        patches = function () {
            if (x instanceof engine.core.patch || x.name === agents.patch.PATCH_NAME) {
                return [x];
            } else if (x instanceof engine.core.turtle) {
                return [x.getPatchHere()];
            } else if (x instanceof engine.core.patchset) {
                return x.toArray();
            } else if (x instanceof engine.core.turtleset) {
                return shim.lodash(x.iterator().toArray()).map(function (t) {
                    return t.getPatchHere();
                }).value();
            } else {
                throw new util.exception.NetLogoException('`breed-on` unsupported for class \'' + typeof x + '\'');
            }
        }();
        turtles = shim.lodash(patches).map(function (p) {
            // refer agents.comps.turtle-getters -- JTT (9/8/14)
            return p.turtles();
        }).flatten().filter(function (t) {
            return t.getBreedName() === breedName;
        }).value();
        return new engine.core.turtleset(turtles, breedName);
    };
    Prims.prototype.turtlesOn = function (agentsOrAgent) {
        var turtles;
        if (agentsOrAgent instanceof engine.core.abstractagentset) {
            turtles = shim.lodash(agentsOrAgent.iterator().toArray()).map(function (agent) {
                return agent.turtlesHere().toArray();
            }).flatten().value();
            return new engine.core.turtleset(turtles);
        } else {
            return agentsOrAgent.turtlesHere();
        }
    };
    Prims.prototype.oneOf = function (agentsOrList) {
        var arr;
        arr = agentsOrList instanceof engine.core.abstractagentset ? agentsOrList.iterator().toArray() : agentsOrList;
        if (arr.length === 0) {
            return engine.core.nobody;
        } else {
            return arr[shim.random.nextInt(arr.length)];
        }
    };
    Prims.prototype.nOf = function (n, agentsOrList) {
        var items, newItems;
        if (agentsOrList instanceof engine.core.abstractagentset) {
            items = agentsOrList.iterator().toArray();
            newItems = this._nOfArray(n, items);
            return agentsOrList.copyWithNewAgents(newItems);
        } else {
            throw new util.exception.NetLogoException('n-of not implemented on lists yet');
        }
    };
    Prims.prototype._nOfArray = function (n, items) {
        var i, index1, index2, j, newIndex1, newIndex2, result, _ref;
        switch (n) {
        case 0:
            return [];
        case 1:
            return [items[shim.random.nextInt(items.length)]];
        case 2:
            index1 = shim.random.nextInt(items.length);
            index2 = shim.random.nextInt(items.length - 1);
            _ref = index2 >= index1 ? [
                index1,
                index2 + 1
            ] : [
                index2,
                index1
            ], newIndex1 = _ref[0], newIndex2 = _ref[1];
            return [
                items[newIndex1],
                items[newIndex2]
            ];
        default:
            i = 0;
            j = 0;
            result = [];
            while (j < n) {
                if (shim.random.nextInt(items.length - i) < n - j) {
                    result.push(items[i]);
                    j += 1;
                }
                i += 1;
            }
            return result;
        }
    };
    return Prims;
}();
