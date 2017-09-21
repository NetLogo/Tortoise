# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

globalEval = eval

readFromString = (str) ->
  try Converter.stringToJSValue(str)
  catch ex
    throw new Error(ex.message)

evalCache = { }

scalaJSEvalCode = (code, widgets, runString, isRunResult, procVars) ->
  varNames  = Object.keys(procVars).sort() # must be sorted as order can vary depending on procedure structure
  varString = varNames.join(' ')
  runKey    = "#{varString} => #{runString}"
  runFun    = if(evalCache[runKey]?)
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
    js  = Converter.compileRunString(compileParams, runString, isRunResult, varString)
    fun = globalEval(js)
    evalCache[runKey] = fun
    fun

  result = runFun(varNames.map((vn) => procVars[vn]))

  if isRunResult
    return result
  else
    return

module.exports =
  class EvalPrims
    # (String, Array[Widget], (String) => Any) => EvalConfig
    constructor: (code, widgets, @readFromString = readFromString) ->
      @runCode = (runString, isRunResult, procVars) ->
        scalaJSEvalCode(code, widgets, runString, isRunResult, procVars)
