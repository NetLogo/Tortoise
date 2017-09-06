# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ contains, filter, foldl, isEmpty, map, tail } = require('brazierjs/array')
{ flip, id, pipeline, tee                     } = require('brazierjs/function')

module.exports = {

  dumper: undefined

  init: (workspace) ->

    logBuffer = [] # Array[String]

    # (String) => Unit
    logMessage = (str) ->
      logBuffer.push(str)
      return

    # (String*) => Unit
    logGlobals = (names...) ->

      observer    = workspace.world.observer
      globalNames = observer.varNames()
      getGlobal   = observer.getGlobal.bind(observer)

      trueNames = if isEmpty(names) then globalNames else filter(flip(contains(globalNames)))(names)

      toLogMessage = ([name, value]) -> "#{name}: #{value}"
      nameToLog    = pipeline(tee(id)(pipeline(getGlobal, (x) -> workspace.dump(x, true))), toLogMessage)
      join         = pipeline(foldl((acc, s) -> acc + "\n" + s)(""), tail) # Use `tail` to drop initial newline

      pipeline(map(nameToLog), join, logMessage)(trueNames)

      return

    # () => Array[String]
    allLogs = ->
      logBuffer[..]

    # () => Unit
    clearLogs = ->
      logBuffer = []
      return

    {
      name: "logging"
    , prims: {
           "ALL-LOGS": allLogs
      ,  "CLEAR-LOGS": clearLogs
      , "LOG-GLOBALS": logGlobals
      , "LOG-MESSAGE": logMessage
      }
    }

}
