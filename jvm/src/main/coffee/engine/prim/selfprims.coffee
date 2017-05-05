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

    # [T] @ (AbstractAgentSet[T]) => AbstractAgentSet[T]
    other: (agentSet) ->
      self = @_getSelf()
      agentSet.filter((agent) => agent isnt self)

    # [T] @ (AbstractAgentSet[T]) => Boolean
    _optimalAnyOther: (agentSet) ->
      self = @_getSelf()
      agentSet.exists((agent) -> agent isnt self)

    # () => Number
    linkHeading: ->
      @_getSelfSafe(linkType).getHeading()

    # () => Number
    linkLength: ->
      @_getSelfSafe(linkType).getSize()

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
