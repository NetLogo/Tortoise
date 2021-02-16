# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks, types } = require('engine/core/typechecker')

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
  makeCheckedFForWith: (f) ->
    () =>
      result = f()
      if not checks.isBoolean(result)
        @validator.error('_ expected a true/false value from _, but got _ instead.', "WITH", @getSelf(), @dumper(result))
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
    @validator.commonArgChecks.agentSet("ANY", arguments)
    not agentset.isEmpty()

  # (AgentSet[T], () => Boolean) => Boolean
  anyOtherWith: (agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", arguments)
    agentset._optimalAnyOtherWith(@makeCheckedFForWith(f))

  # (AgentSet[T], () => Boolean) => Boolean
  anyWith: (agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", arguments)
    agentset._optimalAnyWith(@makeCheckedFForWith(f))

  # (AgentSet[T], (T) => Boolean) => Boolean
  all: (agentset, f) ->
    @validator.commonArgChecks.agentSet("ALL", arguments)
    agentset.agentAll(f)

  # (AgentSet[T], Array[Array[Number]]) => AgentSet
  atPoints: (agentset, coords) ->
    @validator.commonArgChecks.agentSet_list("AT-POINTS", arguments)
    if not AgentSetChecks.isListOfPoints(coords)
      @validator.error('Invalid list of points: _', @dumper(coords))

    agentset.atPoints(coords)

  # (AgentSet[T]) => Number
  count: (agentset) ->
    @validator.commonArgChecks.agentSet("COUNT", arguments)
    agentset.size()

  # (AgentSet[T], () => Boolean) => Number
  countOtherWith: (agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", arguments)
    agentset._optimalCountOtherWith(@makeCheckedFForWith(f))

  # (AgentSet[T], () => Boolean) => Number
  countWith: (agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", arguments)
    agentset._optimalCountWith(@makeCheckedFForWith(f))

  # [T <: (Array[Link]|Link|AbstractAgentSet[Link])] @ (T*) => LinkSet
  linkSet: (values...) ->
    @setCreationArgsCheck(types.Link, types.LinkSet, values)
    @prims.linkSet(values)

  # (AgentSet[T], Number, (T) => Number) => AgentSet[T]
  maxNOf: (agentset, n, f) ->
    @validator.commonArgChecks.agentSet_number("MAX-N-OF", arguments)
    if n > agentset.size()
      @validator.error('Requested _ random agents from a set of only _ agents.', n, agentset.size())
    if n < 0
      @validator.error('First input to _ can_t be negative.', "MAX-N-OF")

    agentset.maxNOf(n, f)

  # (AgentSet[T], (T) => Number) => AgentSet
  maxOneOf: (agentset, f) ->
    @validator.commonArgChecks.agentSet("MAX-ONE-OF", arguments)
    agentset.maxOneOf(f)

  # (AgentSet[T], Number, (T) => Number) => AgentSet[T]
  minNOf: (agentset, n, f) ->
    @validator.commonArgChecks.agentSet_number("MIN-N-OF", arguments)
    if n > agentset.size()
      @validator.error('Requested _ random agents from a set of only _ agents.', n, agentset.size())
    if n < 0
      @validator.error('First input to _ can_t be negative.', "MIN-N-OF")

    agentset.minNOf(n, f)

  # (AgentSet[T], (T) => Number) => AgentSet
  minOneOf: (agentset, f) ->
    @validator.commonArgChecks.agentSet("MIN-ONE-OF", arguments)
    agentset.minOneOf(f)

  # (T | AgentSet[T], (T) => U) => U | List[U]
  of: (agentOrAgentset, f) ->
    @validator.commonArgChecks.agentOrAgentSet("OF", arguments)
    agentOrAgentset.projectionBy(f)

  # (AgentSet[T], () => Boolean) => T
  oneOfWith: (agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", arguments)
    agentset._optimalOneOfWith(@makeCheckedFForWith(f))

  # (AgentSet[T], Number, (Number, Number) => Boolean) => Boolean
  optimizeCount: (agentset, n, operator) ->
    @validator.commonArgChecks.agentSet("COUNT", arguments)
    agentset._optimalCheckCount(n, operator)

  # (AgentSet[T], () => Boolean) => AgentSet[T]
  otherWith: (agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", arguments)
    agentset._optimalOtherWith(@makeCheckedFForWith(f))

  # [T <: (Array[Patch]|Patch|AbstractAgentSet[Patch])] @ (T*) => PatchSet
  patchSet: (values...) ->
    @setCreationArgsCheck(types.Patch, types.PatchSet, values)
    @prims.patchSet(values)

  # (AgentSet[T], () => Number) => AgentSet[T]
  sortOn: (agentset, f) ->
    @validator.commonArgChecks.agentSet("SORT-ON", arguments)
    agentset.sortOn(f)

  # [T <: (Array[Turtle]|Turtle|AbstractAgentSet[Turtle])] @ (T*) => TurtleSet
  turtleSet: (values...) ->
    @setCreationArgsCheck(types.Turtle, types.TurtleSet, values)
    @prims.turtleSet(values)

  # (AgentSet[T], () => Boolean) => AgentSet[T]
  with: (agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", arguments)
    agentset.agentFilter(@makeCheckedFForWith(f))

  # (AgentSet[T], () => Number) => AgentSet[T]
  withMax: (agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH-MAX", arguments)
    agentset.maxesBy(f)

  # (AgentSet[T], () => Number) => AgentSet[T]
  withMin: (agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH-MIN", arguments)
    agentset.minsBy(f)

module.exports = AgentSetChecks
