# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
goog.provide('engine.core.structure.selfmanager')

goog.require('util.exception')

engine.core.structure.selfmanager = class SelfManager

  # type SelfType = Number|Agent // The type that `self` or `myself` could be at any time

  _self:   undefined # SelfType #@# Lame
  _myself: undefined # SelfType #@# Lame

  # () => SelfManager
  constructor: ->
    @_self   = 0
    @_myself = 0

  # () => SelfType
  self: =>
    @_self

  # () => SelfType
  myself: -> #@# I wouldn't be surprised if this is entirely avoidable
    if @_myself isnt 0
      @_myself
    else
      throw new Exception.NetLogoException("There is no agent for MYSELF to refer to.")

  # [T] @ (() => T) => (Agent) => T
  askAgent: (f) => (agent) =>
    oldMyself = @_myself #@# All of this contextual swapping can be handled more clearly; couldn't `f` just take `self` and `myself` as arguments?
    oldAgent  = @_self

    @_myself = @_self
    @_self   = agent

    res =
      try f()
      catch error
        throw error if not (error instanceof Exception.DeathInterrupt or error instanceof Exception.StopInterrupt)

    @_self   = oldAgent
    @_myself = oldMyself

    res

