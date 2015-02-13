# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_ = require('lodash')

# type PrintFunc = (String) => Unit

# (PrintFunc, (Any, Boolean) => String) => PrintBundle
class PrintBundle
  # (PrintFunc, PrintFunc, PrintFunc, (() => Number|Agent) => PrintFunc) => PrintBundle
  constructor: (@print, @type, @write, @show) ->

module.exports =
  (printFunc, dump) ->
    preSpace    = (s) -> " " + s
    newLine     = (s) -> s + "\n"
    dumpWrapped = (s) -> dump(s, true)

    prependAgent =
      (thunk) -> (s) ->
        agentOrZero = thunk()
        agentStr    = if agentOrZero is 0 then "observer" else dump(agentOrZero)
        "#{agentStr}: #{s}"

    writeAfter  = (fs...) -> _.flow(fs..., printFunc)

    print = writeAfter(dump, newLine)
    type  = writeAfter(dump)
    write = writeAfter(dumpWrapped, preSpace)
    show  = (agentThunk) -> writeAfter(dumpWrapped, prependAgent(agentThunk), newLine)

    new PrintBundle(print, type, write, show)
