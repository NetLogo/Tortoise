goog.provide('engine.core.observer');
goog.require('engine.core.patch');
goog.require('engine.core.turtle');
goog.require('engine.core.structure.variablemanager');
goog.require('shim.lodash');
goog.require('agents.patch')
var Observer;
engine.core.observer = Observer = function () {
    Observer.prototype.id = 0;
    Observer.prototype._varManager = void 0;
    Observer.prototype._perspective = void 0;
    Observer.prototype._targetAgent = void 0;
    Observer.prototype._codeGlobalNames = void 0;
    Observer.prototype._updateVarsByName = void 0;
    function Observer(genUpdate, _globalNames, _interfaceGlobalNames) {
        this._globalNames = _globalNames;
        this._interfaceGlobalNames = _interfaceGlobalNames;
        this._updateVarsByName = genUpdate(this);
        this.resetPerspective();
        this._varManager = new engine.core.structure.variablemanager(this._globalNames);
        this._codeGlobalNames = shim.lodash(this._globalNames).difference(this._interfaceGlobalNames);
    }
    Observer.prototype.watch = function (agent) {
        this._perspective = 3;
        this._targetAgent = agent instanceof engine.core.turtle ? [
            1,
            agent.id
        ] : agent instanceof engine.core.patch ? [
            2,
            agent.id
        ] : agent.name === agents.patch.PATCH_NAME ? [
            2,
            agent.id
        ] : [
            0,
            -1
        ];
        this._updatePerspective();
    };
    Observer.prototype.resetPerspective = function () {
        this._perspective = 0;
        this._targetAgent = null;
        this._updatePerspective();
    };
    Observer.prototype.getGlobal = function (varName) {
        return this._varManager[varName];
    };
    Observer.prototype.setGlobal = function (varName, value) {
        this._varManager[varName] = value;
    };
    Observer.prototype.clearCodeGlobals = function () {
        shim.lodash(this._codeGlobalNames).forEach(function (_this) {
            return function (name) {
                _this._varManager[name] = 0;
            };
        }(this));
    };
    Observer.prototype._updatePerspective = function () {
        this._updateVarsByName('perspective', 'targetAgent');
    };
    return Observer;
}();
