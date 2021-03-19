# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class ProcedureContext
  # It might seem weird to track these seperately and just as numbers, but at the moment
  # there isn't really any extra context information that we need.  -Jeremy B March 2021
  _askDepth:  0 # Int
  _taskDepth: 0 # Int

  # Map[String, Any]
  _stringRunLetVars: new Map()

  constructor: (@name) ->

  # This is for procedure arguments only, so as to skip the ask/task checks.  -Jeremy B March 2021
  # (String, Any) => Unit
  registerStringRunArg: (name, value) ->
    @_stringRunLetVars.set(name, value)
    return

  # (String, Any) => Unit
  registerStringRunVar: (name, value) ->
    # `run` with strings only sees proc args and let vars, not those defined inside `ask`
    # blocks or anonymous procedures.  -Jeremy B March 2021
    if @_askDepth is 0 and @_taskDepth is 0
      @_stringRunLetVars.set(name, value)
    return

  # (String, Any) => Unit
  updateStringRunVar: (name, value) ->
    if @_stringRunLetVars.has(name)
      @_stringRunLetVars.set(name, value)
    return

  # () => Map[String, Any]
  stringRunVars: () ->
    if @_taskDepth is 0
      new Map(@_stringRunLetVars)
    else
      new Map()

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
  isReportAllowed: () -> false
  isStopAllowed:   () -> true

  trace: () ->
    { type: "command", name: @name }

class ReporterContext extends ProcedureContext
  isReportAllowed: () -> true
  isStopAllowed:   () -> @isInsideAsk()

  trace: () ->
    { type: "reporter", name: @name }

class PlotContext extends ProcedureContext
  isReportAllowed: () -> false
  isStopAllowed:   () -> true

  trace: () ->
    { type: "plot", name: @name }

  # In the plot context, no lets allowed.  -Jeremy B March 2021
  registerStringRunVar: () -> return
  updateStringRunVar:   () -> return

class RawContext extends ProcedureContext
  constructor: () ->
    super("")

  trace: () ->
    { type: "raw", name: "" }

  isReportAllowed: () -> true
  isStopAllowed:   () -> true

  # In the raw context, no lets allowed.  -Jeremy B March 2021
  registerStringRunVar: () -> return
  updateStringRunVar:   () -> return

class ProcedureStack
  # Array[ProcedureContext]
  _stack: [new RawContext()]

  # () => Array[{ type: "command" | "reporter" | "plot" | "raw", name: String }]
  trace: () ->
    @_stack.map( (context) -> context.trace() ).filter( (frame) -> frame.type isnt "raw" ).reverse()

  # () => ProcedureContext
  currentContext: () ->
    @_stack[@_stack.length - 1]

  # () => Unit
  startCommand: (name) ->
    @_stack.push(new CommandContext(name))
    return

  # () => Unit
  startReporter: (name) ->
    @_stack.push(new ReporterContext(name))
    return

  # () => Unit
  startPlot: (name) ->
    @_stack.push(new PlotContext(name))
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
