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

# (String, Array[Widget], String, Boolean, Array[String]) => Function
compileFromString = (code, widgets, runString, isRunResult, varNames) ->
  evalCache = if isRunResult then runResultEvalCache else runEvalCache
  varString = varNames.join(' ')
  runKey    = "#{varString} => #{runString}"
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
    js = Converter.compileRunString(compileParams, runString, isRunResult, varNames)
    fun = globalEval(js)
    evalCache[runKey] = fun
    fun

# (String, Array[Widget], String, Boolean, Map[String, Any]) => Any
runFromString = (code, widgets, runString, isRunResult, procVars) ->
  varNames  = Array.from(procVars.keys()).sort() # must be sorted as order can vary depending on procedure structure
  runFun = try compileFromString(code, widgets, runString, isRunResult, varNames)
  catch ex
    throw exceptions.runtime(ex.message, if isRunResult then 'runresult' else 'run')

  result = runFun(varNames.map((vn) => procVars.get(vn))...)

  if isRunResult
    return result
  else
    return

module.exports =
  class EvalPrims
    # (String, Array[Widget], (String) => Any) => EvalConfig
    constructor: (code, widgets, @readFromString = readFromString) ->
      @runCode = (runString, isRunResult, procVars) ->
        runFromString(code, widgets, runString, isRunResult, procVars)

      @compileFromString = (runString, isRunResult, procVars) ->
        varNames  = Array.from(procVars.keys()).sort() # must be sorted
        compileFromString(code, widgets, runString, isRunResult, varNames)
