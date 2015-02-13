# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

genPrintBundle = require('./printbundle')

# type PrintFunc = (String) => Unit

module.exports.Config =
  class PrintConfig
    # (PrintFunc) => PrintConfig
    constructor: (@write = (->)) ->

module.exports.Prims =
  class PrintPrims

    print: undefined # PrintFunc
    show:  undefined # (() => Number|Agent) => PrintFunc
    type:  undefined # PrintFunc
    write: undefined # PrintFunc

    # (PrintConfig, (Any, Boolean) => String) => PrintPrims
    constructor: ({ write }, dump) ->
      { @print, @show, @type, @write } = genPrintBundle(write, dump)
