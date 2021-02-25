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

  # (() => Boolean) => (T) => Boolean
  makeCheckedF: (prim, f) ->
    () =>
      result = f()
      if not checks.isBoolean(result)
        @validator.error('_ expected a true/false value from _, but got _ instead.', prim, @getSelf(), @dumper(result))
      result

  # I think it's a little strange that there are three different error messages for the `*-set` agentset creation prims having bad arguments,
  # but at the moment it doesn't seem worth changing desktop to unify them.  -Jeremy B February 2021

  # (PatchType | TurtleType | LinkType, PatchSetType | TurtleSetType | LinkSetType, Array[Any]) => Unit
  setCreationListCheck: (agentType, agentSetType, list) ->
    list.forEach( (value) =>
      if checks.isList(value)
        @setCreationListCheck(agentType, agentSetType, value)

      else if not agentType.isOfType(value) and not agentSetType.isOfType(value) and not checks.isNobody(value)
        if checks.isAgentSet(value)
          @validator.error('List inputs to _-SET must only contain _, _ agentset, or list elements.  The list _ contained a different type agentset: _.', agentType.niceName().toUpperCase(), agentType.niceName(), @dumper(list), @dumper(value))
        else
          @validator.error('List inputs to _-SET must only contain _, _ agentset, or list elements.  The list _ contained _ which is NOT a _ or _ agentset.', agentType.niceName().toUpperCase(), agentType.niceName(), @dumper(list), @dumper(value))

    )

  # (PatchType | TurtleType | LinkType, PatchSetType | TurtleSetType | LinkSetType, Array[Any]) => Unit
  setCreationArgsCheck: (agentType, agentSetType, values) ->
    values.forEach( (value) =>
      if checks.isList(value)
        @setCreationListCheck(agentType, agentSetType, value)

      else if not agentType.isOfType(value) and not agentSetType.isOfType(value) and not checks.isNobody(value)
        @validator.error('_-SET expected input to be a _ agentset or _ but got _ instead.', agentType.niceName().toUpperCase(), agentType.niceName(), @validator.valueToString(value))
    )

  # (AgentSet[T]) => Boolean
  any: (agentset) ->
    not agentset.isEmpty()

  # (AgentSet[T], () => Boolean) => Boolean
  anyOtherWith: (agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", arguments)
    agentset._optimalAnyOtherWith(@makeCheckedF("WITH", f))

  # (AgentSet[T], () => Boolean) => Boolean
  anyWith: (agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", arguments)
    agentset._optimalAnyWith(@makeCheckedF("WITH", f))

  # (AgentSet[T], (T) => Boolean) => Boolean
  all: (agentset, f) ->
    agentset.agentAll(@makeCheckedF("ALL?", f))

  # (AgentSet[T], Array[Array[Number]]) => AgentSet
  atPoints: (agentset, coords) ->
    if not AgentSetChecks.isListOfPoints(coords)
      @validator.error('Invalid list of points: _', @dumper(coords))

    agentset.atPoints(coords)

  # (String, Patch | Turtle | PatchSet | TurtleSet) => AgentSet
  breedOn: (breedName, target) ->
    if checks.isPatch(target)
      @prims.breedOnPatch(breedName, target)
    else if checks.isTurtle(target)
      @prims.breedOnTurtle(breedName, target)
    else if checks.isPatchSet(target)
      @prims.breedOnPatchSet(breedName, target)
    else if checks.isTurtleSet(target)
      @prims.breedOnTurtleSet(breedName, target)

  # (AgentSet[T]) => Number
  count: (agentset) ->
    agentset.size()

  # (AgentSet[T], () => Boolean) => Number
  countOtherWith: (agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", arguments)
    agentset._optimalCountOtherWith(@makeCheckedF("WITH", f))

  # (AgentSet[T], () => Boolean) => Number
  countWith: (agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", arguments)
    agentset._optimalCountWith(@makeCheckedF("WITH", f))

  # [T <: (Array[Link]|Link|AbstractAgentSet[Link])] @ (T*) => LinkSet
  linkSet: (values...) ->
    @setCreationArgsCheck(types.Link, types.LinkSet, values)
    @prims.linkSet(values)

  # (AgentSet[T], Number, (T) => Number) => AgentSet[T]
  maxNOf: (agentset, n, f) ->
    if n > agentset.size()
      @validator.error('Requested _ random agents from a set of only _ agents.', n, agentset.size())
    if n < 0
      @validator.error('First input to _ can_t be negative.', "MAX-N-OF")

    agentset.maxNOf(n, f)

  # (AgentSet[T], (T) => Number) => AgentSet
  maxOneOf: (agentset, f) ->
    agentset.maxOneOf(f)

  # (AgentSet[T], Number, (T) => Number) => AgentSet[T]
  minNOf: (agentset, n, f) ->
    if n > agentset.size()
      @validator.error('Requested _ random agents from a set of only _ agents.', n, agentset.size())
    if n < 0
      @validator.error('First input to _ can_t be negative.', "MIN-N-OF")

    agentset.minNOf(n, f)

  # (AgentSet[T], (T) => Number) => AgentSet
  minOneOf: (agentset, f) ->
    agentset.minOneOf(f)

  # (T | AgentSet[T], (T) => U) => U | List[U]
  of: (agentOrAgentset, f) ->
    agentOrAgentset.projectionBy(f)

  # (AgentSet[T], () => Boolean) => T
  oneOfWith: (agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", arguments)
    agentset._optimalOneOfWith(@makeCheckedF("WITH", f))

  # (AgentSet[T], Number, (Number, Number) => Boolean) => Boolean
  optimizeCount: (agentset, n, operator) ->
    @validator.commonArgChecks.agentSet("COUNT", arguments)
    agentset._optimalCheckCount(n, operator)

  # (AgentSet[T], () => Boolean) => AgentSet[T]
  otherWith: (agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", arguments)
    agentset._optimalOtherWith(@makeCheckedF("WITH", f))

  # [T <: (Array[Patch]|Patch|AbstractAgentSet[Patch])] @ (T*) => PatchSet
  patchSet: (values...) ->
    @setCreationArgsCheck(types.Patch, types.PatchSet, values)
    @prims.patchSet(values)

  # (AgentSet[T], () => Number | String | Agent) => AgentSet[T]
  sortOn: (agentset, f) ->
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
        @validator.error('SORT-ON works on numbers, strings, or agents of the same type, but not on _ and _', name2, name1)

      compare(o1, o2)

    agentset.sortOn(f, sortingFunc)

  # (Agent | AgentSet) => TurtleSet
  turtlesOn: (agentOrAgentset) ->
    if checks.isAgentSet(agentOrAgentset)
      @prims.turtlesOnAgentSet(agentOrAgentset)
    else
      @prims.turtlesOnAgent(agentOrAgentset)

  # [T <: (Array[Turtle]|Turtle|AbstractAgentSet[Turtle])] @ (T*) => TurtleSet
  turtleSet: (values...) ->
    @setCreationArgsCheck(types.Turtle, types.TurtleSet, values)
    @prims.turtleSet(values)

  # (AgentSet[T], () => Boolean) => AgentSet[T]
  with: (agentset, f) ->
    agentset.agentFilter(@makeCheckedF("WITH", f))

  # (AgentSet[T], () => Number) => AgentSet[T]
  withMax: (agentset, f) ->
    agentset.maxesBy(f)

  # (AgentSet[T], () => Number) => AgentSet[T]
  withMin: (agentset, f) ->
    agentset.minsBy(f)

module.exports = AgentSetChecks
