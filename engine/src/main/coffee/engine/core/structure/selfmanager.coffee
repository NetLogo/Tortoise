# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')

module.exports =
  class SelfManager

    # type SelfType = Number|Agent // The type that `self` or `myself` could be at any time

    _self:   undefined # SelfType
    _myself: undefined # SelfType

    # () => SelfManager
    constructor: ->
      @_self   = 0
      @_myself = 0

    # () => SelfType
    self: =>
      @_self

    # () => SelfType
    myself: ->
      if @_myself isnt 0
        @_myself
      else
        throw exceptions.runtime("There is no agent for MYSELF to refer to.")

    # Switch from letting CoffeeScript bind "this" to handling it manually to avoid creating extra anonymous functions
    # They add GC pressure, causing runtime slowdown - JMB 07/2017
    # [T] @ (() => T) => (Agent) => T
    askAgent: (f) =>
      at = this
      (agent) ->
        oldMyself = at._myself
        oldAgent  = at._self

        at._myself = at._self
        at._self   = agent

        try f()
        finally
          at._self   = oldAgent
          at._myself = oldMyself
