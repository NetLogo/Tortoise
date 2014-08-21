# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports =
  class SelfPrims

    # (() => Agent) => Prims
    constructor: (@_getSelf) ->

    # (Number) => Unit
    fd: (n) ->
      @_getSelf().fd(n)
      return

    # (Number) => Unit
    bk: (n) ->
      @_getSelf().fd(-n)
      return

    # (Number) => Unit
    jump: (n) ->
      @_getSelf().jumpIfAble(n)

    # (Number) => Unit
    right: (n) ->
      @_getSelf().right(n)
      return

    # (Number) => Unit
    left: (n) ->
      @_getSelf().right(-n)
      return

    # (Number, Number) => Unit
    setXY: (x, y) ->
      @_getSelf().setXY(x, y)
      return

    # () => PatchSet
    getNeighbors: ->
      @_getSelf().getNeighbors()

    # () => PatchSet
    getNeighbors4: ->
      @_getSelf().getNeighbors4()

    # (Number, String) => TurtleSet
    sprout: (n, breedName) ->
      @_getSelf().sprout(n, breedName)

    # (Number, String) => TurtleSet
    hatch: (n, breedName) ->
      @_getSelf().hatch(n, breedName)

    # () => Unit
    die: ->
      @_getSelf().die()
      return

    # [T] @ (AbstractAgentSet[T]) => AbstractAgentSet[T]
    other: (agentSet) ->
      self = @_getSelf()
      agentSet.filter((agent) => agent isnt self)

    # (String) => Any
    getVariable: (varName) ->
      @_getSelf().getVariable(varName)

    # (String, Any) => Unit
    setVariable: (varName, value) ->
      @_getSelf().setVariable(varName, value)
      return

    # (String) => Any
    getPatchVariable: (varName) ->
      @_getSelf().getPatchVariable(varName)

    # (String, Any) => Unit
    setPatchVariable: (varName, value) ->
      @_getSelf().setPatchVariable(varName, value)
      return
