# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

AgentKinds = require('engine/core/agentkinds')

{ exceptionFactory: exceptions } = require('util/exception')

module.exports =
  class SelfManager

    # type SelfType = Number|Agent // The type that `self` or `myself` could be at any time

    _self:    undefined # SelfType
    _myself:  undefined # SelfType
    _selfBit: undefined # Int

    # () => SelfManager
    constructor: ->
      @_self    = 0
      @_myself  = 0
      @_selfBit = AgentKinds.Observer

    # () => SelfType
    self: =>
      @_self

    # () => Int
    selfBit: =>
      @_selfBit

    # () => SelfType
    myself: ->
      if @_myself isnt 0
        @_myself
      else
        throw exceptions.runtime("There is no agent for MYSELF to refer to.", "myself")

    # Desktop runs plot code as a fresh job over `world.observers` (`Evaluator.ProcedureRunner.run`), so the observer
    # runs it no matter who called `update-plots`.  `myself` goes away with it, the way it would in any new job.
    # -Jeremy B August 2026
    # [T] @ (() => T) => T
    askObserver: (f) =>
      oldMyself = @_myself
      oldAgent  = @_self
      oldBit    = @_selfBit

      @_myself  = 0
      @_self    = 0
      @_selfBit = AgentKinds.Observer

      try f()
      finally
        @_self    = oldAgent
        @_myself  = oldMyself
        @_selfBit = oldBit

    # Switch from letting CoffeeScript bind "this" to handling it manually to avoid creating extra anonymous functions
    # They add GC pressure, causing runtime slowdown - JMB 07/2017
    # [T] @ (() => T) => (Agent) => T
    askAgent: (f) =>
      at = this
      (agent) ->
        oldMyself = at._myself
        oldAgent  = at._self
        oldBit    = at._selfBit

        at._myself  = at._self
        at._self    = agent
        # The observer is the number 0 rather than an agent, so it has no bit of its own to read.  -Jeremy B August 2026
        at._selfBit = if agent is 0 then AgentKinds.Observer else agent.agentBit

        try f()
        finally
          at._self    = oldAgent
          at._myself  = oldMyself
          at._selfBit = oldBit
