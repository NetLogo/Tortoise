# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ DeathInterrupt, ignoring } = require('util/exception')

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
        throw new Error("There is no agent for MYSELF to refer to.")

    # [T] @ (() => T) => (Agent) => T
    askAgent: (f) => (agent) =>
      oldMyself = @_myself
      oldAgent  = @_self

      @_myself = @_self
      @_self   = agent

      res = ignoring(DeathInterrupt)(f)

      @_self   = oldAgent
      @_myself = oldMyself

      res
