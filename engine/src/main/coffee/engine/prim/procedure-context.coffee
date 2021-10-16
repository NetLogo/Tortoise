# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class ProcedureContext
  # It might seem weird to track these seperately and just as numbers, but at the moment
  # there isn't really any extra context information that we need.  -Jeremy B March 2021
  _askDepth:  0 # Int
  _taskDepth: 0 # Int

  # Map[String, Any]
  _stringRunLetVars: null

  constructor: (@name) ->
    @_stringRunLetVars = new Map()

  # This is for procedure arguments only, so as to skip the ask/task checks.  -Jeremy B March 2021
  # (String, Any) => Unit
  registerStringRunArg: (name, value) ->
    @_stringRunLetVars.set(name, value)
    return

  # (String, Any) => Unit
  registerStringRunVar: (name, value) ->
    # `run` with strings only sees proc args and let vars, not those defined inside `ask`
    # blocks or anonymous procedures.  -Jeremy B March 2021
    if not (@isInsideAsk() or @isInsideTask())
      @_stringRunLetVars.set(name, value)
    return

  # (String, Any) => Unit
  updateStringRunVar: (name, value) ->
    if @_stringRunLetVars.has(name)
      @_stringRunLetVars.set(name, value)
    return

  # () => Map[String, Any]
  stringRunVars: () ->
    if @isInsideTask()
      new Map()
    else
      new Map(@_stringRunLetVars)

  # () => Unit
  startAsk: () ->
    @_askDepth = @_askDepth + 1
    return

  # () => Unit
  endAsk: () ->
    @_askDepth = @_askDepth - 1
    return

  # () => Unit
  startTask: () ->
    @_taskDepth = @_taskDepth + 1
    return

  # () => Unit
  endTask: () ->
    @_taskDepth = @_taskDepth - 1
    return

  # () => Boolean
  isInsideAsk: () ->
    @_askDepth isnt 0

  # () => Boolean
  isInsideTask: () ->
    @_taskDepth isnt 0

class CommandContext extends ProcedureContext
  constructor: (name, @location) ->
    super(name)

  isReportAllowed: () -> false
  isStopAllowed:   () -> true

  trace: () ->
    { type: "command", name: @name, location: @location }

class ReporterContext extends ProcedureContext
  constructor: (name, @location) ->
    super(name)

  isReportAllowed: () -> true
  isStopAllowed:   () -> @isInsideAsk()

  trace: () ->
    { type: "reporter", name: @name, location: @location }

class PlotContext extends ProcedureContext
  isReportAllowed: () -> false
  isStopAllowed:   () -> true

  trace: () ->
    { type: "plot", name: @name }

  # In the plot context, no lets allowed.  -Jeremy B March 2021
  registerStringRunVar: () -> return
  updateStringRunVar:   () -> return

class StringTaskContext extends ProcedureContext
  constructor: (outerContext) ->
    super("")
    @_askDepth = outerContext._askDepth
    @_taskDepth = outerContext._taskDepth
    @_stringRunLetVars = new Map(outerContext._stringRunLetVars)
    return

class StringCommandTaskContext extends StringTaskContext
  isReportAllowed: () -> false
  isStopAllowed:   () -> true

  trace: () ->
    { type: "run" }

class StringReporterTaskContext extends StringTaskContext
  isReportAllowed: () -> false
  isStopAllowed:   () -> false

  trace: () ->
    { type: "runresult" }

  # String reporter should be a single expression, no lets allowed.  -Jeremy B September 2021
  registerStringRunVar: () -> return
  updateStringRunVar:   () -> return

class RawContext extends ProcedureContext
  constructor: () ->
    super("")

  trace: () ->
    { type: "raw" }

  isReportAllowed: () -> true
  isStopAllowed:   () -> true

  # In the raw context, no lets allowed.  -Jeremy B March 2021
  registerStringRunVar: () -> return
  updateStringRunVar:   () -> return

class ProcedureStack
  # Array[ProcedureContext]
  _stack: null

  constructor: () ->
    @_stack = [new RawContext()]

  # () => Array[{ type: "command" | "reporter" | "run" | "runresult" | "plot" | "raw", name: String }]
  trace: () ->
    @_stack.map( (context) -> context.trace() ).filter( (frame) -> frame.type isnt "raw" ).reverse()

  # () => ProcedureContext
  currentContext: () ->
    @_stack[@_stack.length - 1]

  # (Command) => Unit
  startCommand: (command) ->
    @_stack.push(new CommandContext(command.name, command.location))
    return

  # (Reporter) => Unit
  startReporter: (reporter) ->
    @_stack.push(new ReporterContext(reporter.name, reporter.location))
    return

  # (String) => Unit
  startPlot: (name) ->
    @_stack.push(new PlotContext(name))
    return

  startStringCommandTask: () ->
    @_stack.push(new StringCommandTaskContext(@currentContext()))
    return

  startStringReporterTask: () ->
    @_stack.push(new StringReporterTaskContext(@currentContext()))
    return

  # () => Unit
  endCall: () ->
    @_stack.pop()
    return

  # () => Unit
  reset: () ->
    @_stack = [new RawContext()]
    return

module.exports = { CommandContext, ReporterContext, RawContext, ProcedureStack }
