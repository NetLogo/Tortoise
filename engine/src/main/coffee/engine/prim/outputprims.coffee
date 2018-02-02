# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

genPrintBundle = require('./printbundle')

# type PrintFunc = (String) => Unit

module.exports.Config =
  class OutputConfig
    # (() => Unit, PrintFunc) => OutputConfig
    constructor: (@clear = (->), @write = (->)) ->

module.exports.Prims =
  class OutputPrims

    clear: undefined # () => Unit
    print: undefined # PrintFunc
    show:  undefined # (() => Number|Agent) => PrintFunc
    type:  undefined # PrintFunc
    write: undefined # PrintFunc

    # (OutputConfig, (String) => Unit, () => Unit, (Any, Boolean) => String) => OutputPrims
    constructor: ({ clear, write }, writeToStore, clearStored, dump) ->
      @clear    = (-> clearStored(); clear())
      writePlus = ((x) -> writeToStore(x); write(x))
      { @print, @show, @type, @write } = genPrintBundle(writePlus, dump)
