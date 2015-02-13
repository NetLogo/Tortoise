# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

genPrintBundle = require('./printbundle')

# type PrintFunc = (String) => Unit

module.exports.Config =
  class OutputConfig
    # (() => Unit, PrintFunc) => PrintConfig
    constructor: (@clear = (->), @write = (->)) ->

module.exports.Prims =
  class OutputPrims

    clear: undefined # () => Unit
    print: undefined # PrintFunc
    show:  undefined # (() => Number|Agent) => PrintFunc
    type:  undefined # PrintFunc
    write: undefined # PrintFunc

    # (OutputConfig, (Any, Boolean) => String) => OutputPrims
    constructor: ({ @clear, write }, dump) ->
      { @print, @show, @type, @write } = genPrintBundle(write, dump)
