# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks }                        = require('engine/core/typechecker')
{ DeathInterrupt, StopInterrupt } = require('util/interrupts')
{ removeRepeatable }              = require('engine/prim-checks/syntax')

class ProcedureChecks

  constructor: (@validator, @procedurePrims) ->

  # (String, Int, Int, Number, Number) => Unit
  runArgCountCheck: (primName, sourceStart, sourceEnd, needed, given) ->
    if (given < needed)
      @validator.error(primName, sourceStart, sourceEnd, 'anonymous procedure expected _ input_, but only got _', needed, given)

    return

  # (Int, Int, String, Array[Any]) => Any
  callReporter: (sourceStart, sourceEnd, name, args...) ->
    result = @procedurePrims.callReporter(name, args...)

    if result is undefined
      @validator.error('report', sourceStart, sourceEnd, 'Reached end of reporter procedure without REPORT being called.')

    result

  # (Int, Int, Any) => Any
  preReturnCheck: (sourceStart, sourceEnd, value) ->
    if value is StopInterrupt
      if not @procedurePrims.stack().currentContext().isStopAllowed()
        @validator.error('stop', sourceStart, sourceEnd, 'STOP is not allowed inside TO-REPORT.')

    else
      if value isnt DeathInterrupt and not @procedurePrims.stack().currentContext().isReportAllowed()
        @validator.error('report', sourceStart, sourceEnd, 'REPORT can only be used inside TO-REPORT.')

    value

  # (Int, Int, Any) => Any
  report: (sourceStart, sourceEnd, reporter) ->
    @preReturnCheck(sourceStart, sourceEnd, reporter)

  # (Int, Int, String | () => Any, Array[Any]) => Any
  run: (sourceStart, sourceEnd, fOrString, args...) ->
    @runCode(sourceStart, sourceEnd, fOrString, false, args...)

  # (Int, Int, String | () => Any, Array[Any]) => Any
  runResult: (sourceStart, sourceEnd, fOrString, args...) ->
    @runCode(sourceStart, sourceEnd, fOrString, true, args...)

  # (Int, Int, String | () => Any, Boolean, Array[Any]) => Any
  runCode: (sourceStart, sourceEnd, fOrString, isRunResult, args...) ->
    if checks.isString(fOrString)
      if args.length isnt 0
        prim = if isRunResult then "runresult" else "run"
        @validator.error(prim, sourceStart, sourceEnd, '_ doesn_t accept further inputs if the first is a string', prim)
      @procedurePrims.runString(fOrString, isRunResult)

    else
      @procedurePrims.runFunction(fOrString, args...)

  # (Int, Int, ) => StopInterrupt
  stop: (sourceStart, sourceEnd) ->
    @preReturnCheck(sourceStart, sourceEnd, @procedurePrims.stop())

module.exports = ProcedureChecks
