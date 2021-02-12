# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ types } = require('engine/core/typechecker')

class AgentSetChecks

  constructor: (@validator, @dumper) ->

  # (Any) => Boolean
  @isPoint: (point) ->
    point.length is 2 and types.Number.isOfType(point[0]) and types.Number.isOfType(point[1])

  # (Any) => Boolean
  @isListOfPoints: (points) ->
    points.every( (point) -> types.List.isOfType(point) and AgentSetChecks.isPoint(point) )

  # (AgentSet[T]) => Boolean
  any: (agentset) ->
    @validator.commonArgChecks.agentSet("ANY", arguments)
    not agentset.isEmpty()

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

  # (AgentSet[T], () => Number) => AgentSet[T]
  sortOn: (agentset, f) ->
    @validator.commonArgChecks.agentSet("SORT-ON", arguments)
    agentset.sortOn(f)

  # (AgentSet[T], () => Boolean) => AgentSet[T]
  with: (agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH", arguments)
    agentset.agentFilter(f)

  # (AgentSet[T], () => Number) => AgentSet[T]
  withMax: (agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH-MAX", arguments)
    agentset.maxesBy(f)

  # (AgentSet[T], () => Number) => AgentSet[T]
  withMin: (agentset, f) ->
    @validator.commonArgChecks.agentSet("WITH-MIN", arguments)
    agentset.minsBy(f)

module.exports = AgentSetChecks
