# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

globalEval = eval

# (String) => Number | Boolean | String | Array
readFromString = (str) ->
  try Converter.stringToJSValue(str)
  catch ex
    throw new Error(ex.message)

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
    js  = Converter.compileRunString(compileParams, runString, isRunResult, varNames)
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
