# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')

globalEval = eval

# (String) => Number | Boolean | String | Array
readFromString = (str) ->
  try Converter.stringToJSValue(str)
  catch ex
    throw exceptions.internal(ex.message)

runEvalCache = { }
runResultEvalCache = { }

# (String, Array[Widget], String, Boolean, Array[String], String) => Function
compileFromString = (code, widgets, runString, isRunResult, varNames, agentKind) ->
  evalCache = if isRunResult then runResultEvalCache else runEvalCache
  varString = varNames.join(' ')
  # The code compiled for a turtle isn't the code compiled for a patch, so the kind is part of the key.
  runKey    = "#{agentKind}: #{varString} => #{runString}"
  if (evalCache[runKey]?)
    evalCache[runKey]

  else
    compileParams = {
      code:         code,
      widgets:      widgets,
      commands:     [],
      reporters:    [],
      turtleShapes: [],
      linkShapes:   []
    }
    js = Converter.compileRunString(compileParams, runString, isRunResult, varNames, agentKind)
    fun = globalEval(js)
    evalCache[runKey] = fun
    fun

# (String, Array[Widget], String, Boolean, Map[String, Any], String) => Any
runFromString = (code, widgets, runString, isRunResult, procVars, agentKind) ->
  varNames  = Array.from(procVars.keys()).sort() # must be sorted as order can vary depending on procedure structure
  runFun = try compileFromString(code, widgets, runString, isRunResult, varNames, agentKind)
  catch ex
    throw exceptions.runtime(ex.message, if isRunResult then 'runresult' else 'run')

  result = runFun(varNames.map((vn) => procVars.get(vn))...)

  if isRunResult
    return result
  else
    return

module.exports =
  class EvalPrims
    # (String, Array[Widget], () => String, (String) => Any) => EvalConfig
    constructor: (code, widgets, getAgentKind, @readFromString = readFromString) ->
      @runCode = (runString, isRunResult, procVars) ->
        runFromString(code, widgets, runString, isRunResult, procVars, getAgentKind())

      @compileFromString = (runString, isRunResult, procVars) ->
        varNames  = Array.from(procVars.keys()).sort() # must be sorted
        compileFromString(code, widgets, runString, isRunResult, varNames, getAgentKind())
