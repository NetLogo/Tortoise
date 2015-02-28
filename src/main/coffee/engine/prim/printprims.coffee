# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_ = require('lodash')

# type PrintFunc = (String) => Unit

module.exports.Config =
  class PrintConfig
    # (PrintFunc) => PrintConfig
    constructor: (@write = (->)) ->

module.exports.Prims =
  class PrintPrims

    @print: undefined # PrintFunc
    @show:  undefined # (() => Number|Agent) => PrintFunc
    @type:  undefined # PrintFunc
    @write: undefined # PrintFunc

    # (PrintConfig, (Any, Boolean) => String) => PrintPrims
    constructor: ({ write }, dump) ->
      preSpace    = (s) -> " " + s
      newLine     = (s) -> s + "\n"
      dumpWrapped = (s) -> dump(s, true)

      prependAgent =
        (thunk) -> (s) ->
          agentOrZero = thunk()
          agentStr    = if agentOrZero is 0 then "observer" else dump(agentOrZero)
          "#{agentStr}: #{s}"

      writeAfter  = (fs...) -> _.flow(fs..., write)

      @print = writeAfter(dump, newLine)
      @type  = writeAfter(dump)
      @write = writeAfter(dumpWrapped, preSpace)

      @show = (agentThunk) -> writeAfter(dumpWrapped, prependAgent(agentThunk), newLine)
