# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports =
  class SelfPrims

    # (() => Agent) => Prims
    constructor: (@_getSelf) ->

    # [T] @ (AbstractAgentSet[T]) => AbstractAgentSet[T]
    other: (agentSet) ->
      self = @_getSelf()
      agentSet.filter((agent) => agent isnt self)

    # [T] @ (AbstractAgentSet[T]) => Boolean
    _optimalAnyOther: (agentSet) ->
      self = @_getSelf()
      agentSet.exists((agent) -> agent isnt self)

    # [T] @ (AbstractAgentSet[T]) => Number
    _optimalCountOther: (agentSet) ->
      self = @_getSelf()
      (agentSet.filter((agent) -> agent isnt self)).size()

    # () => Number | TowardsInterrupt
    linkHeading: ->
      @_getSelf().getHeading()

    # () => Number
    linkLength: ->
      @_getSelf().getSize()
