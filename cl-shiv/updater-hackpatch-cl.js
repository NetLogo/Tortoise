goog.provide('engine.updater');
goog.require('engine.core.link');
goog.require('engine.core.observer');
goog.require('engine.core.patch');
goog.require('engine.core.turtle');
goog.require('engine.core.world');
goog.require('util.exception');
goog.require('agents.patch');
var Update, Updater, ignored;
ignored = [
    '',
    ''
];
Update = function () {
    function Update(turtles, patches, links, observer, world) {
        this.turtles = turtles != null ? turtles : {};
        this.patches = patches != null ? patches : {};
        this.links = links != null ? links : {};
        this.observer = observer != null ? observer : {};
        this.world = world != null ? world : {};
    }
    return Update;
}();
engine.updater = Updater = function () {
    Updater.prototype._updates = void 0;
    function Updater() {
        this.updated = __bind(this.updated, this);
        this.registerDeadTurtle = __bind(this.registerDeadTurtle, this);
        this.registerDeadLink = __bind(this.registerDeadLink, this);
        this._flushUpdates();
    }
    Updater.prototype.collectUpdates = function () {
        var temp;
        temp = this._updates;
        this._flushUpdates();
        return temp;
    };
    Updater.prototype.registerDeadLink = function (id) {
        this._update('links', id, { WHO: -1 });
    };
    Updater.prototype.registerDeadTurtle = function (id) {
        this._update('turtles', id, { WHO: -1 });
    };
    Updater.prototype.registerWorldState = function (state, id) {
        if (id == null) {
            id = 0;
        }
        this._update('world', id, state);
    };
    Updater.prototype.updated = function (obj) {
        return function (_this) {
            return function () {
                var entry, entryUpdate, mapping, objMap, update, v, value, varName, vars, _i, _len, _ref;
                vars = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                update = _this._updates[0];
                _ref = function () {
                    if (obj instanceof engine.core.turtle) {
                        return [
                            update.turtles,
                            this._turtleMap(obj)
                        ];
                    } else if (obj instanceof engine.core.patch) {
                        return [
                            update.patches,
                            this._patchMap(obj)
                        ];
                    } else if (obj instanceof engine.core.link) {
                        return [
                            update.links,
                            this._linkMap(obj)
                        ];
                    } else if (obj instanceof engine.core.world) {
                        return [
                            update.world,
                            this._worldMap(obj)
                        ];
                    } else if (obj instanceof engine.core.observer) {
                        return [
                            update.observer,
                            this._observerMap(obj)
                        ];
                    } else if (obj.name === agents.patch.PATCH_NAME) {
                        return [
                            update.patches,
                            this._cljsPatchMap(obj)
                        ];
                    } else {
                        throw new util.exception.NetLogoException('Unrecognized update type');
                    }
                }.call(_this), entry = _ref[0], objMap = _ref[1];
                entryUpdate = entry[obj.id] || {};
                if (entryUpdate['WHO'] < 0) {
                    delete entryUpdate['WHO'];
                }
                for (_i = 0, _len = vars.length; _i < _len; _i++) {
                    v = vars[_i];
                    mapping = objMap[v];
                    if (mapping != null) {
                        if (mapping !== ignored) {
                            varName = mapping[0], value = mapping[1];
                            entryUpdate[varName] = value;
                            entry[obj.id] = entryUpdate;
                        }
                    } else {
                        throw new util.exception.NetLogoException('Unknown ' + obj.constructor.name + ' variable for update: ' + v);
                    }
                }
            };
        }(this);
    };
    Updater.prototype._turtleMap = function (turtle) {
        return {
            breed: [
                'BREED',
                turtle.getBreedName()
            ],
            color: [
                'COLOR',
                turtle._color
            ],
            heading: [
                'HEADING',
                turtle._heading
            ],
            id: [
                'WHO',
                turtle.id
            ],
            'label-color': [
                'LABEL-COLOR',
                turtle._labelcolor
            ],
            'hidden?': [
                'HIDDEN?',
                turtle._hidden
            ],
            label: [
                'LABEL',
                turtle._label.toString()
            ],
            'pen-size': [
                'PEN-SIZE',
                turtle.penManager.getSize()
            ],
            'pen-mode': [
                'PEN-MODE',
                turtle.penManager.getMode().toString()
            ],
            shape: [
                'SHAPE',
                turtle._shape
            ],
            size: [
                'SIZE',
                turtle._size
            ],
            xcor: [
                'XCOR',
                turtle.xcor
            ],
            ycor: [
                'YCOR',
                turtle.ycor
            ]
        };
    };
    Updater.prototype._patchMap = function (patch) {
        return {
            id: [
                'WHO',
                patch.id
            ],
            pcolor: [
                'PCOLOR',
                patch._pcolor
            ],
            plabel: [
                'PLABEL',
                patch._plabel.toString()
            ],
            'plabel-color': [
                'PLABEL-COLOR',
                patch._plabelcolor
            ],
            pxcor: [
                'PXCOR',
                patch.pxcor
            ],
            pycor: [
                'PYCOR',
                patch.pycor
            ]
        };
    };
    Updater.prototype._cljsPatchMap = function(cljs_patch) {
      return {
        id:             [ 'WHO', cljs_patch.id ],
        pcolor:         [ 'PCOLOR', cljs_patch['get-var']('pcolor') ],
        plabel:         [ 'PLABEL', cljs_patch['get-var']('plabel').toString() ],
        'plabel-color': [ 'PLABEL-COLOR', cljs_patch['get-var']('plabel-color') ],
        pxcor:          [ 'PXCOR', cljs_patch.pxcor ],
        pycor:          [ 'PYCOR', cljs_patch.pycor ]
      }
    }
    Updater.prototype._linkMap = function (link) {
        return {
            breed: [
                'BREED',
                link.getBreedName()
            ],
            color: [
                'COLOR',
                link._color
            ],
            end1: [
                'END1',
                link.end1.id
            ],
            end2: [
                'END2',
                link.end2.id
            ],
            heading: [
                'HEADING',
                link.getHeading()
            ],
            'hidden?': [
                'HIDDEN?',
                link._isHidden
            ],
            id: [
                'ID',
                link.id
            ],
            label: [
                'LABEL',
                link._label.toString()
            ],
            'label-color': [
                'LABEL-COLOR',
                link._labelcolor
            ],
            midpointx: [
                'MIDPOINTX',
                link.getMidpointX()
            ],
            midpointy: [
                'MIDPOINTY',
                link.getMidpointY()
            ],
            shape: [
                'SHAPE',
                link._shape
            ],
            size: [
                'SIZE',
                link.getSize()
            ],
            thickness: [
                'THICKNESS',
                link._thickness
            ],
            'tie-mode': [
                'TIE-MODE',
                link._tiemode
            ],
            lcolor: ignored,
            llabel: ignored,
            llabelcolor: ignored,
            lhidden: ignored,
            lbreed: ignored,
            lshape: ignored
        };
    };
    Updater.prototype._worldMap = function (world) {
        return {
            height: [
                'worldHeight',
                world.topology.height
            ],
            id: [
                'WHO',
                world.id
            ],
            patchesAllBlack: [
                'patchesAllBlack',
                world._patchesAllBlack
            ],
            patchesWithLabels: [
                'patchesWithLabels',
                world._patchesWithLabels
            ],
            maxPxcor: [
                'MAXPXCOR',
                world.topology.maxPxcor
            ],
            maxPycor: [
                'MAXPYCOR',
                world.topology.maxPycor
            ],
            minPxcor: [
                'MINPXCOR',
                world.topology.minPxcor
            ],
            minPycor: [
                'MINPYCOR',
                world.topology.minPycor
            ],
            ticks: [
                'ticks',
                world.ticker._count
            ],
            unbreededLinksAreDirected: [
                'unbreededLinksAreDirected',
                world.unbreededLinksAreDirected
            ],
            width: [
                'worldWidth',
                world.topology.width
            ]
        };
    };
    Updater.prototype._observerMap = function (observer) {
        return {
            id: [
                'WHO',
                observer.id
            ],
            perspective: [
                'perspective',
                observer._perspective
            ],
            targetAgent: [
                'targetAgent',
                observer._targetAgent
            ]
        };
    };
    Updater.prototype._update = function (agentType, id, newAgent) {
        this._updates[0][agentType][id] = newAgent;
    };
    Updater.prototype._flushUpdates = function () {
        this._updates = [new Update()];
    };
    return Updater;
}();
