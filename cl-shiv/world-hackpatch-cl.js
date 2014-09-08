goog.provide('engine.core.world');
goog.require('engine.core.observer');
goog.require('engine.core.patch');
goog.require('engine.core.patchset');
goog.require('engine.core.topology.factory');
goog.require('engine.core.worldstructure.linkmanager');
goog.require('engine.core.worldstructure.ticker');
goog.require('engine.core.worldstructure.turtlemanager');
goog.require('shim.strictmath');
goog.require('util.exception');
var World;
engine.core.world = World = function () {
    World.prototype.id = 0;
    World.prototype.linkManager = void 0;
    World.prototype.observer = void 0;
    World.prototype.ticker = void 0;
    World.prototype.topology = void 0;
    World.prototype.turtleManager = void 0;
    World.prototype._patches = void 0;
    World.prototype.unbreededLinksAreDirected = void 0;
    World.prototype._patchesAllBlack = void 0;
    World.prototype._patchesWithLabels = void 0;
    World.prototype.unbreededLinksAreDirected = void 0;
    World.prototype._patchesAllBlack = void 0;
    World.prototype._patchesWithLabels = void 0;
    function World(selfManager, _updater, breedManager, globalNames, interfaceGlobalNames, turtlesOwnNames, linksOwnNames, patchesOwnNames, minPxcor, maxPxcor, minPycor, maxPycor, _patchSize, wrappingAllowedInX, wrappingAllowedInY, turtleShapeList, linkShapeList) {
        this.selfManager = selfManager;
        this._updater = _updater;
        this.breedManager = breedManager;
        this.turtlesOwnNames = turtlesOwnNames;
        this.linksOwnNames = linksOwnNames;
        this.patchesOwnNames = patchesOwnNames;
        this._declarePatchesNotAllBlack = __bind(this._declarePatchesNotAllBlack, this);
        this._setUnbreededLinksUndirected = __bind(this._setUnbreededLinksUndirected, this);
        this._setUnbreededLinksDirected = __bind(this._setUnbreededLinksDirected, this);
        this._decrementPatchLabelCount = __bind(this._decrementPatchLabelCount, this);
        this._incrementPatchLabelCount = __bind(this._incrementPatchLabelCount, this);
        this.getPatchAt = __bind(this.getPatchAt, this);
        this.patches = __bind(this.patches, this);
        this._updater.collectUpdates();
        this._updater.registerWorldState({
            worldWidth: maxPxcor - minPxcor + 1,
            worldHeight: maxPycor - minPycor + 1,
            minPxcor: minPxcor,
            minPycor: minPycor,
            maxPxcor: maxPxcor,
            maxPycor: maxPycor,
            linkBreeds: 'XXX IMPLEMENT ME',
            linkShapeList: linkShapeList,
            patchSize: _patchSize,
            patchesAllBlack: this._patchesAllBlack,
            patchesWithLabels: this._patchesWithLabels,
            ticks: -1,
            turtleBreeds: 'XXX IMPLEMENT ME',
            turtleShapeList: turtleShapeList,
            unbreededLinksAreDirected: false,
            wrappingAllowedInX: wrappingAllowedInX,
            wrappingAllowedInY: wrappingAllowedInY
        });
        this.linkManager = new engine.core.worldstructure.linkmanager(this, breedManager, _updater, this._setUnbreededLinksDirected, this._setUnbreededLinksUndirected);
        this.observer = new engine.core.observer(this._updater.updated, globalNames, interfaceGlobalNames);
        this.ticker = new engine.core.worldstructure.ticker(this._updater.updated(this));
        this.topology = null;
        this.turtleManager = new engine.core.worldstructure.turtlemanager(this, breedManager, _updater);
        this._patches = [];
        this.unbreededLinksAreDirected = false;
        this._patchesAllBlack = true;
        this._patchesWithLabels = 0;
        this.unbreededLinksAreDirected = false;
        this._patchesAllBlack = true;
        this._patchesWithLabels = 0;
        this.resize(minPxcor, maxPxcor, minPycor, maxPycor, wrappingAllowedInX, wrappingAllowedInY);
    }
    World.prototype.createPatches = function () {
        var id, nested, patch, x, y, _i, _len, _ref, _ref1;
        nested = function () {
            var _i, _ref, _ref1, _results;
            _results = [];
            for (y = _i = _ref = this.topology.maxPycor, _ref1 = this.topology.minPycor; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; y = _ref <= _ref1 ? ++_i : --_i) {
                _results.push(function () {
                    var _j, _ref2, _ref3, _results1;
                    _results1 = [];
                    for (x = _j = _ref2 = this.topology.minPxcor, _ref3 = this.topology.maxPxcor; _ref2 <= _ref3 ? _j <= _ref3 : _j >= _ref3; x = _ref2 <= _ref3 ? ++_j : --_j) {
                        id = this.topology.width * (this.topology.maxPycor - y) + x - this.topology.minPxcor;
                        //_results1.push(new engine.core.patch(id, x, y, this, this._updater.updated, this._declarePatchesNotAllBlack, this._decrementPatchLabelCount, this._incrementPatchLabelCount));
                        _results1.push(agents.patch.js_patch(id,x,y,this, new cljs.core.keyword("_declareNonBlackPatch"), this._declarePatchesNotAllBlack, new cljs.core.keyword("_decrementPatchLabelCount"), this._decrementPatchLabelCount, new cljs.core.keyword("_incrementPatchLabelCount"), this._incrementPatchLabelCount));
                    }
                    return _results1;
                }.call(this));
            }
            return _results;
        }.call(this);
        this._patches = (_ref = []).concat.apply(_ref, nested);
        _ref1 = this._patches;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            patch = _ref1[_i];
            this._updater.updated(patch)('pxcor', 'pycor', 'pcolor', 'plabel', 'plabel-color');
        }
    };
    World.prototype.links = function () {
        return this.linkManager.links();
    };
    World.prototype.turtles = function () {
        return this.turtleManager.turtles();
    };
    World.prototype.patches = function () {
        return new engine.core.patchset(this._patches);
    };
    World.prototype.resize = function (minPxcor, maxPxcor, minPycor, maxPycor, wrapsInX, wrapsInY) {
        if (wrapsInX == null) {
            wrapsInX = this.topology._wrapInX;
        }
        if (wrapsInY == null) {
            wrapsInY = this.topology._wrapInY;
        }
        if (!(minPxcor <= 0 && 0 <= maxPxcor && (minPycor <= 0 && 0 <= maxPycor))) {
            throw new util.exception.NetLogoException('You must include the point (0, 0) in the world.');
        }
        this.turtleManager._clearTurtlesSuspended();
        this.topology = engine.core.topology.factory(wrapsInX, wrapsInY, minPxcor, maxPxcor, minPycor, maxPycor, this.patches, this.getPatchAt);
        this.createPatches();
        this._declarePatchesAllBlack();
        this._resetPatchLabelCount();
        this._updater.updated(this)('width', 'height', 'minPxcor', 'minPycor', 'maxPxcor', 'maxPycor');
    };
    World.prototype.getPatchAt = function (x, y) {
        var index, trueX, trueY;
        trueX = (x - this.topology.minPxcor) % this.topology.width + this.topology.minPxcor;
        trueY = (y - this.topology.minPycor) % this.topology.height + this.topology.minPycor;
        index = (this.topology.maxPycor - shim.strictmath.round(trueY)) * this.topology.width + (shim.strictmath.round(trueX) - this.topology.minPxcor);
        return this._patches[index];
    };
    World.prototype.clearAll = function () {
        this.observer.clearCodeGlobals();
        this.turtleManager.clearTurtles();
        this.createPatches();
        this.linkManager._resetIDs();
        this._declarePatchesAllBlack();
        this._resetPatchLabelCount();
        this.ticker.clear();
    };
    World.prototype.clearPatches = function () {
        this.patches().forEach(function (patch) {
            patch = patch.reset();
        });
        this._declarePatchesAllBlack();
        this._resetPatchLabelCount();
    };
    World.prototype.getNeighbors = function (pxcor, pycor) {
        return new engine.core.patchset(this.topology.getNeighbors(pxcor, pycor));
    };
    World.prototype.getNeighbors4 = function (pxcor, pycor) {
        return new engine.core.patchset(this.topology.getNeighbors4(pxcor, pycor));
    };
    World.prototype._incrementPatchLabelCount = function () {
        this._setPatchLabelCount(function (count) {
            return count + 1;
        });
    };
    World.prototype._decrementPatchLabelCount = function () {
        this._setPatchLabelCount(function (count) {
            return count - 1;
        });
    };
    World.prototype._resetPatchLabelCount = function () {
        this._setPatchLabelCount(function () {
            return 0;
        });
    };
    World.prototype._setPatchLabelCount = function (updateCountFunc) {
        this._patchesWithLabels = updateCountFunc(this._patchesWithLabels);
        this._updater.updated(this)('patchesWithLabels');
    };
    World.prototype._setUnbreededLinksDirected = function () {
        this.unbreededLinksAreDirected = true;
        this._updater.updated(this)('unbreededLinksAreDirected');
    };
    World.prototype._setUnbreededLinksUndirected = function () {
        this.unbreededLinksAreDirected = false;
        this._updater.updated(this)('unbreededLinksAreDirected');
    };
    World.prototype._declarePatchesAllBlack = function () {
        this._patchesAllBlack = true;
        this._updater.updated(this)('patchesAllBlack');
    };
    World.prototype._declarePatchesNotAllBlack = function () {
        this._patchesAllBlack = false;
        this._updater.updated(this)('patchesAllBlack');
    };
    return World;
}();
