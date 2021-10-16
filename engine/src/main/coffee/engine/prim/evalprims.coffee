# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')

globalEval = eval

# (String) => Number | Boolean | String | Array
readFromString = (str) ->
  try Converter.stringToJSValue(str)
  catch ex
    throw exceptions.internal(ex.message)

evalCache = { }

# (String, Array[Widget], String, Boolean, Map[String, Any]) => Any
runFromString = (code, widgets, runString, isRunResult, procVars) ->
  varNames  = Array.from(procVars.keys()).sort() # must be sorted as order can vary depending on procedure structure
  varString = varNames.join(' ')
  runKey    = "#{varString} => #{runString}"
  runFun    = if (evalCache[runKey]?)
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
    js  = try Converter.compileRunString(compileParams, runString, isRunResult, varNames)
    catch ex
      throw exceptions.runtime(ex.message, if isRunResult then 'runresult' else 'run')
    fun = globalEval(js)
    evalCache[runKey] = fun
    fun

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
