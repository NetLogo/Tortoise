# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

class TypeSet

  # (Boolean, Boolean, Boolean, Boolean) => TypeSet
  constructor: (@link, @observer, @patch, @turtle) ->

  # (TypeSet) => TypeSet
  mergeWith: ({ link, observer, patch, turtle }) ->
    new TypeSet(@link or link, @observer or observer, @patch or patch, @turtle or turtle)

  # (TypeSet) => TypeSet
  mappend: (ts) ->
    @mergeWith(ts)

mempty = new TypeSet(false, false, false, false)

linkType     = new TypeSet(true,  false, false, false)
observerType = new TypeSet(false, true,  false, false)
patchType    = new TypeSet(false, false, true,  false)
turtleType   = new TypeSet(false, false, false, true)


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

    # () => Number
    linkHeading: ->
      @_getSelfSafe(linkType).getHeading()

    # () => Number
    linkLength: ->
      @_getSelfSafe(linkType).getSize()

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

    # (TypeSet) => Agent
    _getSelfSafe: (typeSet) ->
      { link: allowsL, patch: allowsP, turtle: allowsT } = typeSet
      self = @_getSelf()
      type = NLType(self)
      if (type.isTurtle() and allowsT) or (type.isPatch() and allowsP) or (type.isLink() and allowsL)
        self
      else
        typeStr  = @_nlTypeToString(type)
        part1    = "this code can't be run by #{typeStr}"
        agentStr = @_typeSetToAgentString(typeSet)
        part2    = if agentStr.length isnt 0 then ", only #{agentStr}" else ""
        throw new Error(part1 + part2)

    # (NLType) => String
    _nlTypeToString: (nlType) ->
      if nlType.isTurtle()
        "a turtle"
      else if nlType.isPatch()
        "a patch"
      else if nlType.isLink()
        "a link"
      else
        ""

    # (TypeSet) => String
    _typeSetToAgentString: (typeSet) ->
      if typeSet.turtle
        "a turtle"
      else if typeSet.patch
        "a patch"
      else if typeSet.link
        "a link"
      else
        ""
