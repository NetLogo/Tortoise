# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks, getTypeOf, types } = require('engine/core/typechecker')
Comparator                   = require('util/comparator')

class AgentSetChecks

  # `getSelf()` is necessary because the predicates used for `with` and its optimized relatives
  # do not actually take in the agents they check, they assume the `selfManager` on the world
  # will be kept up-to-date for them.  As such this was the best way I could find to get
  # the proper agent to use when those predicates return incorrect values.
  # -Jeremy B February 2021

  constructor: (@validator, @dumper, @prims, @getSelf) ->

  # (Any) => Boolean
  @isPoint: (point) ->
    point.length is 2 and checks.isNumber(point[0]) and checks.isNumber(point[1])

  # (Any) => Boolean
  @isListOfPoints: (points) ->
    points.every( (point) -> checks.isList(point) and AgentSetChecks.isPoint(point) )

  # (String, Int, Int, () => Boolean) => (T) => Boolean
  makeCheckedF: (prim, sourceStart, sourceEnd, f) ->
    () =>
      result = f()
      if not checks.isBoolean(result)
        @validator.error(prim, sourceStart, sourceEnd, '_ expected a true/false value from _, but got _ instead.', prim, @getSelf(), @dumper(result))
      result

  # I think it's a little strange that there are three different error messages for the `*-set` agentset creation prims having bad arguments,
  # but at the moment it doesn't seem worth changing desktop to unify them.  -Jeremy B February 2021

  # (String, Int, Int, PatchType | TurtleType | LinkType, PatchSetType | TurtleSetType | LinkSetType, Array[Any]) => Unit
  setCreationListCheck: (prim, sourceStart, sourceEnd, agentType, agentSetType, list) ->
    list.forEach( (value) =>
      if checks.isList(value)
        @setCreationListCheck(prim, sourceStart, sourceEnd, agentType, agentSetType, value)

      else if not agentType.isOfType(value) and not agentSetType.isOfType(value) and not checks.isNobody(value)
        if checks.isAgentSet(value)
          @validator.error(prim, sourceStart, sourceEnd, 'List inputs to _ must only contain _, _ agentset, or list elements.  The list _ contained a different type agentset: _.', prim.toUpperCase(), agentType.niceName(), @dumper(list), @dumper(value))
        else
          @validator.error(prim, sourceStart, sourceEnd, 'List inputs to _ must only contain _, _ agentset, or list elements.  The list _ contained _ which is NOT a _ or _ agentset.', prim.toUpperCase(), agentType.niceName(), @dumper(list), @dumper(value))

    )

  # (String, Int, Int, PatchType | TurtleType | LinkType, PatchSetType | TurtleSetType | LinkSetType, Array[Any]) => Unit
  setCreationArgsCheck: (prim, sourceStart, sourceEnd, agentType, agentSetType, values) ->
    values.forEach( (value) =>
      if checks.isList(value)
        @setCreationListCheck(prim, sourceStart, sourceEnd, agentType, agentSetType, value)

      else if not agentType.isOfType(value) and not agentSetType.isOfType(value) and not checks.isNobody(value)
        @validator.error(prim, sourceStart, sourceEnd, '_ expected input to be a _ agentset or _ but got _ instead.', prim.toUpperCase(), agentType.niceName(), @validator.valueToString(value))
    )

  # (AgentSet[T]) => Boolean
  any: (agentset) ->
    not agentset.isEmpty()

  # (Int, Int, AgentSet[T], () => Boolean) => Boolean
  anyOtherWith: (sourceStart, sourceEnd, agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", sourceStart, sourceEnd, Array.from(arguments).slice(2))
    agentset._optimalAnyOtherWith(@makeCheckedF("WITH", sourceStart, sourceEnd, f))

  # (Int, Int, AgentSet[T], () => Boolean) => Boolean
  anyWith: (sourceStart, sourceEnd, agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", sourceStart, sourceEnd, Array.from(arguments).slice(2))
    agentset._optimalAnyWith(@makeCheckedF("WITH", sourceStart, sourceEnd, f))

  # (Int, Int, AgentSet[T], (T) => Boolean) => Boolean
  all: (sourceStart, sourceEnd, agentset, f) ->
    agentset.agentAll(@makeCheckedF("ALL?", sourceStart, sourceEnd, f))

  # (Int, Int, AgentSet[T], Array[Array[Number]]) => AgentSet
  atPoints: (sourceStart, sourceEnd, agentset, coords) ->
    if not AgentSetChecks.isListOfPoints(coords)
      @validator.error('at-points', sourceStart, sourceEnd, 'Invalid list of points: _', @dumper(coords))

    agentset.atPoints(coords)

  # (String, Patch | Turtle | PatchSet | TurtleSet) => AgentSet
  breedOn: (breedName, target) ->
    if checks.isAgentSet(target)
      @prims.breedOnAgentSet(breedName, target)
    else
      @prims.breedOnAgent(breedName, target)

  # (AgentSet[T]) => Number
  count: (agentset) ->
    agentset.size()

  # (Int, Int, AgentSet[T], () => Boolean) => Number
  countOtherWith: (sourceStart, sourceEnd, agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", sourceStart, sourceEnd, Array.from(arguments).slice(2))
    agentset._optimalCountOtherWith(@makeCheckedF("WITH", sourceStart, sourceEnd, f))

  # (Int, Int, AgentSet[T], () => Boolean) => Number
  countWith: (sourceStart, sourceEnd, agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", sourceStart, sourceEnd, Array.from(arguments).slice(2))
    agentset._optimalCountWith(@makeCheckedF("WITH", sourceStart, sourceEnd, f))

  # [T <: (Array[Link]|Link|AbstractAgentSet[Link])] @ (Int, Int, T*) => LinkSet
  linkSet: (sourceStart, sourceEnd, values...) ->
    @setCreationArgsCheck('link-set', sourceStart, sourceEnd, types.Link, types.LinkSet, values)
    @prims.linkSet(values)

  # (Int, Int, AgentSet[T], Number, (T) => Number) => AgentSet[T]
  maxNOf: (sourceStart, sourceEnd, agentset, n, f) ->
    if n > agentset.size()
      @validator.error('max-n-of', sourceStart, sourceEnd, 'Requested _ random agents from a set of only _ agents.', n, agentset.size())
    if n < 0
      @validator.error('max-n-of', sourceStart, sourceEnd, 'First input to _ can_t be negative.', "MAX-N-OF")

    agentset.maxNOf(n, f)

  # (AgentSet[T], (T) => Number) => AgentSet
  maxOneOf: (agentset, f) ->
    agentset.maxOneOf(f)

  # (Int, Int, AgentSet[T], Number, (T) => Number) => AgentSet[T]
  minNOf: (sourceStart, sourceEnd, agentset, n, f) ->
    if n > agentset.size()
      @validator.error('min-n-of', sourceStart, sourceEnd, 'Requested _ random agents from a set of only _ agents.', n, agentset.size())
    if n < 0
      @validator.error('min-n-of', sourceStart, sourceEnd, 'First input to _ can_t be negative.', "MIN-N-OF")

    agentset.minNOf(n, f)

  # (AgentSet[T], (T) => Number) => AgentSet
  minOneOf: (agentset, f) ->
    agentset.minOneOf(f)

  # (T | AgentSet[T], (T) => U) => U | List[U]
  of: (agentOrAgentset, f) ->
    agentOrAgentset.projectionBy(f)

  # (Int, Int, AgentSet[T], () => Boolean) => T
  oneOfWith: (sourceStart, sourceEnd, agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", sourceStart, sourceEnd, Array.from(arguments).slice(2))
    agentset._optimalOneOfWith(@makeCheckedF("WITH", sourceStart, sourceEnd, f))

  # (Int, Int, AgentSet[T], Number, (Number, Number) => Boolean) => Boolean
  optimizeCount: (sourceStart, sourceEnd, agentset, n, operator) ->
    @validator.commonArgChecks.agentSet("COUNT", sourceStart, sourceEnd, Array.from(arguments).slice(2))
    agentset._optimalCheckCount(n, operator)

  # (Int, Int, AgentSet[T], () => Boolean) => AgentSet[T]
  otherWith: (sourceStart, sourceEnd, agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", sourceStart, sourceEnd, Array.from(arguments).slice(2))
    agentset._optimalOtherWith(@makeCheckedF("WITH", sourceStart, sourceEnd, f))

  # [T <: (Array[Patch]|Patch|AbstractAgentSet[Patch])] @ (Int, Int, T*) => PatchSet
  patchSet: (sourceStart, sourceEnd, values...) ->
    @setCreationArgsCheck('patch-set',sourceStart, sourceEnd, types.Patch, types.PatchSet, values)
    @prims.patchSet(values)

  # (Int, Int, AgentSet[T], () => Number | String | Agent) => AgentSet[T]
  sortOn: (sourceStart, sourceEnd, agentset, f) ->
    compare      = null
    badFirstType = false
    sortingFunc = ([[], o1], [[], o2]) =>
      # Picking out the compare functions is a little more logic than I'd like in this error checking layer.
      # But it does move some type checks here, which is good, and it's the easiest way to get the error
      # checks to match up with desktop/headless.  -Jeremy B Fabruary 2021
      if compare is null
        compare = if checks.isNumber(o1)
          (n1, n2) -> Comparator.numericCompare(n1, n2).toInt
        else if checks.isString(o1)
          (s1, s2) -> Comparator.stringCompare(s1, s2).toInt
        else if checks.isAgent(o1)
          (a1, a2) -> a1.compare(a2).toInt
        else
          badFirstType = true
          null

      type1 = getTypeOf(o1)
      type2 = getTypeOf(o2)
      if type1 isnt type2 or badFirstType
        name1 = @validator.addIndefiniteArticle(type1.niceName())
        name2 = @validator.addIndefiniteArticle(type2.niceName())
        # The order swap of `name1` and `name2` is intentional to get identical errors to desktop. -Jeremy B February 2021
        @validator.error('sort-on', sourceStart, sourceEnd, 'SORT-ON works on numbers, strings, or agents of the same type, but not on _ and _', name2, name1)

      compare(o1, o2)

    agentset.sortOn(f, sortingFunc)

  # (Agent | AgentSet) => TurtleSet
  turtlesOn: (agentOrAgentset) ->
    if checks.isAgentSet(agentOrAgentset)
      @prims.turtlesOnAgentSet(agentOrAgentset)
    else
      @prims.turtlesOnAgent(agentOrAgentset)

  # (Agent | AgentSet) => Boolean
  anyTurtlesOn: (agentOrAgentset) ->
    if checks.isAgentSet(agentOrAgentset)
      @prims.anyTurtlesOnAgentSet(agentOrAgentset)
    else
      @prims.anyTurtlesOnAgent(agentOrAgentset)

  # [T <: (Array[Turtle]|Turtle|AbstractAgentSet[Turtle])] @ (Int, Int, T*) => TurtleSet
  turtleSet: (sourceStart, sourceEnd, values...) ->
    @setCreationArgsCheck('turtle-set', sourceStart, sourceEnd, types.Turtle, types.TurtleSet, values)
    @prims.turtleSet(values)

  # (Int, Int, AgentSet[T], Agent | AgentSet[U]) => AgentSet[T]
  whoAreNot: (sourceStart, sourceEnd, source, remove) ->
    if checks.isAgentSet(remove)
      source.removeAll(remove)
    else
      source.remove(remove)

  # (Int, Int, AgentSet[T], () => Boolean) => AgentSet[T]
  with: (sourceStart, sourceEnd, agentset, f) ->
    agentset.agentFilter(@makeCheckedF("WITH", sourceStart, sourceEnd, f))

  # (AgentSet[T], () => Number) => AgentSet[T]
  withMax: (agentset, f) ->
    agentset.maxesBy(f)

  # (AgentSet[T], () => Number) => AgentSet[T]
  withMin: (agentset, f) ->
    agentset.minsBy(f)

module.exports = AgentSetChecks
