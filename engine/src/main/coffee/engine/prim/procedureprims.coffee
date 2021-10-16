# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ Command, Reporter } = require('./procedure')
{ ProcedureStack }    = require('./procedure-context')
{ StopInterrupt }     = require('util/interrupts')

class ProcedurePrims
  _commands:  null # Map[String, Reporter]
  _reporters: null # Map[String, Command]
  _stack:     null # ProcedureStack

  constructor: (@evalPrims, @plotManager, @rng) ->
    @_commands  = new Map()
    @_reporters = new Map()
    @_stack     = new ProcedureStack()

  # () => ProcedureStack
  stack: () ->
    @_stack

  # (String, Int, Int, () => Unit) => Unit
  defineCommand: (name, start, end, command) ->
    @_commands.set(name, new Command(name, start, end, command))
    return

  # (String, Int, Int, () => Any) => Unit
  defineReporter: (name, start, end, reporter) ->
    @_reporters.set(name, new Reporter(name, start, end, reporter))
    return

  # (Agent|AgentSet, () => Any, Boolean) => Unit | DeathInterrupt
  ask: (agents, f, shuffle) ->
    @_stack.currentContext().startAsk()
    try
      agents.ask(f, shuffle)
    finally
      @_stack.currentContext().endAsk()

  # (String) => Boolean
  hasCommand: (name) ->
    @_commands.has(name)

  # (String) => Boolean
  hasReporter: (name) ->
    @_reporters.has(name)

  # (String, Array[Any]) => StopInterrupt | undefined
  callCommand: (name, args...) ->
    command = @_commands.get(name)
    @_stack.startCommand(command)
    try
      command.call(args...)
    finally
      @_stack.endCall()

  # (String, Array[Any]) => Any
  callReporter: (name, args...) ->
    reporter = @_reporters.get(name)
    @_stack.startReporter(reporter)
    try
      reporter.call(args...)
    finally
      @_stack.endCall()

  # (String, String | undefined, () => Any) => Any
  runInPlotContext: (plotName, penName, f) ->
    @_stack.startPlot(plotName)
    try
      @rng.withClone( () => @plotManager.withTemporaryContext(plotName, penName)(f) )
    finally
      @_stack.endCall()

  # (String) => Any
  readFromString: (str) ->
    @evalPrims.readFromString(str)

  # (String, Boolean) => Any
  runString: (str, isRunResult) ->
    if isRunResult
      @_stack.startStringReporterTask()
    else
      @_stack.startStringCommandTask()

    try
      @evalPrims.runCode(str, isRunResult, @_stack.currentContext().stringRunVars())
    finally
      @_stack.endCall()

  # (() => Any, Array[Any]) => Any
  runFunction: (f, args...) ->
    try
      @_stack.currentContext().startTask()
      f(args...)
    finally
      @_stack.currentContext().endTask()

  # () => StopInterrupt
  stop: () ->
    return StopInterrupt

module.exports = ProcedurePrims
