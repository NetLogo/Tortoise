# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks }                        = require('engine/core/typechecker')
{ DeathInterrupt, StopInterrupt } = require('util/interrupts')
{ removeRepeatable }              = require('engine/prim-checks/syntax')

class ProcedureChecks

  constructor: (@validator, @procedurePrims) ->

  # (String, Number, Number) => Unit
  runArgCountCheck: (primName, needed, given) ->
    if (given < needed)
      @validator.error(primName, 'anonymous procedure expected _ input_, but only got _', needed, given)

    return

  # (String, Array[Any]) => Any
  callReporter: (name, args...) ->
    result = @procedurePrims.callReporter(name, args...)

    if result is undefined
      @validator.error('report', 'Reached end of reporter procedure without REPORT being called.')

    result

  # (Any) => Any
  preReturnCheck: (value) ->
    if value is StopInterrupt
      if not @procedurePrims.stack().currentContext().isStopAllowed()
        @validator.error('stop', 'STOP is not allowed inside TO-REPORT.')

    else
      if value isnt DeathInterrupt and not @procedurePrims.stack().currentContext().isReportAllowed()
        @validator.error('report', 'REPORT can only be used inside TO-REPORT.')

    value

  # (Any) => Any
  report: (reporter) ->
    @preReturnCheck(reporter)

  # (String | () => Any, Array[Any]) => Any
  run: (fOrString, args...) ->
    @runCode(fOrString, false, args...)

  # (String | () => Any, Array[Any]) => Any
  runResult: (fOrString, args...) ->
    @runCode(fOrString, true, args...)

  # (Boolean, Array[Any]) => Any
  runCode: (fOrString, isRunResult, args...) ->
    if checks.isString(fOrString)
      if args.length isnt 0
        prim = if isRunResult then "runresult" else "run"
        @validator.error(prim, '_ doesn_t accept further inputs if the first is a string', prim)
      @procedurePrims.runString(fOrString, isRunResult)

    else
      @procedurePrims.runFunction(fOrString, args...)

  # () => StopInterrupt
  stop: () ->
    @preReturnCheck(@procedurePrims.stop())

module.exports = ProcedureChecks
