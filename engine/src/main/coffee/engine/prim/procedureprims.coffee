# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ ProcedureStack } = require('./procedure-context')
{ StopInterrupt }  = require('util/interrupts')

class ProcedurePrims
  _commands:  new Map()
  _reporters: new Map()

  _stack: new ProcedureStack()

  constructor: (@evalPrims, @plotManager, @rng) ->

  stack: () ->
    @_stack

  # (String, () => Unit) => Unit
  defineCommand: (name, command) ->
    @_commands.set(name, command)
    return

  # (String, () => Any) => Unit
  defineReporter: (name, reporter) ->
    @_reporters.set(name, reporter)
    return

  # (Agentset, () => Any, Boolean) => Unit | DeathInterrupt
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
    @_stack.startCommand()
    try
      @_commands.get(name)(args...)
    finally
      @_stack.endCall()

  # (String, Array[Any]) => Any
  callReporter: (name, args...) ->
    @_stack.startReporter()
    try
      @_reporters.get(name)(args...)
    finally
      @_stack.endCall()

  # (String, String | undefined, () => Any) => Any
  runInPlotContext: (plotName, penName, f) ->
    @_stack.startPlot()
    try
      @rng.withClone( () => @plotManager.withTemporaryContext(plotName, penName)(f) )
    finally
      @_stack.endCall()

  # (String) => Any
  readFromString: (str) ->
    @evalPrims.readFromString(str)

  # (String, Boolean) => Any
  runString: (str, isRunResult) ->
    @evalPrims.runCode(str, isRunResult, @_stack.currentContext().stringRunVars())

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
