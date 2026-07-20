# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks } = require('../engine/core/typechecker')

{ exceptionFactory: exceptions } = require('util/exception')

# Desktop renders weights in these messages with Java's `Double.toString`, which always shows a decimal
# point.  JS drops it for whole numbers, so the messages would otherwise drift from desktop's.
# (Number) => String
dumpWeight = (n) ->
  if Number.isInteger(n) then "#{n}.0" else "#{n}"

# (Number, String) => String
pluralize = (count, word) ->
  "#{count} #{word}#{if count isnt 1 then "s" else ""}"

# Keith Schwarz's implementation of Vose's alias method (http://www.keithschwarz.com/darts-dice-coins/):
# O(n) to build the tables, O(1) per sample after that.
# (Array[Number], RNG) => (() => Number)
makeAliasSampler = (probabilities, rng) ->
  size        = probabilities.length
  average     = 1 / size
  probability = new Array(size)
  alias       = new Array(size)

  # The pairing loop below mutates the probabilities, so work on a copy.
  ps = probabilities.slice()

  small = []
  large = []
  for p, i in ps
    if p >= average then large.push(i) else small.push(i)

  # Mathematically `small` always empties first, but floating point error means it may not, so the loop
  # guards both and the leftovers of either are drained afterwards.
  while small.length > 0 and large.length > 0
    less = small.pop()
    more = large.pop()

    probability[less] = ps[less] * size
    alias[less]       = more
    ps[more]          = (ps[more] + ps[less]) - average

    if ps[more] >= average then large.push(more) else small.push(more)

  while small.length > 0
    probability[small.pop()] = 1
  while large.length > 0
    probability[large.pop()] = 1

  ->
    column = rng.nextInt(size)
    if rng.nextDouble() < probability[column] then column else alias[column]

# Samples from `unselectedIndices` only.  When everything left weighs 0 they're all equally likely.
# (Array[Number], Array[Number], RNG) => (() => Number)
newPickFunction = (allWeights, unselectedIndices, rng) ->
  unselectedWeights = unselectedIndices.map( (i) -> allWeights[i] )
  sum               = unselectedWeights.reduce(((acc, w) -> acc + w), 0)

  pick =
    if sum is 0
      -> rng.nextInt(unselectedIndices.length)
    else
      makeAliasSampler(unselectedWeights.map( (w) -> w / sum ), rng)

  -> unselectedIndices[pick()]

# (Number, Array[Number], RNG) => Array[Number]
pickIndicesWithRepeats = (n, weights, rng) ->
  pick    = newPickFunction(weights, weights.map( (w, i) -> i ), rng)
  indices = []
  while indices.length < n
    indices.push(pick())
  indices.sort( (a, b) -> a - b )

# How many already-taken picks to tolerate before rebuilding the sampler.
maxDuplicates = 64

# (Number, Array[Number], RNG) => Array[Number]
pickIndicesWithoutRepeats = (n, weights, rng) ->
  unselected = new Set(weights.map( (w, i) -> i ))
  selected   = new Set()
  pick       = newPickFunction(weights, Array.from(unselected), rng)
  duplicates = 0

  while selected.size < n
    i = pick()
    if selected.has(i)
      # Lopsided weights make a stale sampler keep landing on taken indices.  Once that happens often
      # enough, rebuilding over what's left is cheaper than going on rejecting draws.
      if duplicates is maxDuplicates
        pick       = newPickFunction(weights, Array.from(unselected), rng)
        duplicates = 0
      else
        duplicates += 1
    else
      unselected.delete(i)
      selected.add(i)
      duplicates = 0

  Array.from(selected).sort( (a, b) -> a - b )

# (String, Number) => Number
checkNonNegative = (name, n) ->
  count = Math.trunc(n)
  if count < 0
    throw exceptions.extension("First input to #{name} can't be negative.")
  count

# (Number, Array[Any]) => Array[Any]
checkEnoughCandidates = (minSize, candidates) ->
  if candidates.length < minSize
    throw exceptions.extension(
      "Requested #{pluralize(minSize, "random item")} from #{pluralize(candidates.length, "candidate")}.")
  candidates

module.exports = {

  # (Workspace) => Extension
  init: (workspace) ->

    # (Array[Any], (Any) => Any) => Array[Number]
    getWeights = (candidates, weightOf) ->
      candidates.map( (candidate) ->
        weight = weightOf(candidate)
        if not checks.isNumber(weight)
          throw exceptions.extension(
            "Got #{workspace.dump(weight)} as a weight but all weights must be numbers.")
        if weight < 0
          throw exceptions.extension(
            "Got #{dumpWeight(weight)} as a weight but all weights must be >= 0.0.")
        weight
      )

    # (Reporter) => ((Any) => Any)
    listReporter = (reporter) ->
      if reporter.minArgCount > 1
        throw exceptions.extension("Task expected only 1 input but got #{reporter.minArgCount}.")
      (item) -> reporter(item)

    # (Reporter) => ((Agent) => Any)
    agentReporter = (reporter) ->
      (agent) -> workspace.world.selfManager.askAgent(reporter)(agent)

    # Candidates come out of the agentset in shuffled order, matching desktop, so that agents sharing a
    # weight aren't biased by their position in the set.
    # (AgentSet) => Array[Agent]
    agentsetCandidates = (agentset) ->
      agentset.shufflerator().toArray()

    # (Array[Any], Reporter) => Any
    weightedOneOfList = (list, reporter) ->
      candidates = checkEnoughCandidates(1, list)
      weights    = getWeights(candidates, listReporter(reporter))
      candidates[pickIndicesWithRepeats(1, weights, workspace.world.rng)[0]]

    # (AgentSet, Reporter) => Agent | Nobody
    weightedOneOf = (agentset, reporter) ->
      if agentset.isEmpty()
        Nobody
      else
        candidates = agentsetCandidates(agentset)
        weights    = getWeights(candidates, agentReporter(reporter))
        candidates[pickIndicesWithRepeats(1, weights, workspace.world.rng)[0]]

    # (Number, Array[Any], Reporter) => Array[Any]
    weightedNOfList = (n, list, reporter) ->
      count      = checkNonNegative("WEIGHTED-N-OF-LIST", n)
      candidates = checkEnoughCandidates(count, list)
      weights    = getWeights(candidates, listReporter(reporter))
      indices    = pickIndicesWithoutRepeats(count, weights, workspace.world.rng)
      indices.map( (i) -> candidates[i] )

    # (Number, Array[Any], Reporter) => Array[Any]
    weightedNOfListWithRepeats = (n, list, reporter) ->
      count      = checkNonNegative("WEIGHTED-N-OF-LIST-WITH-REPEATS", n)
      candidates = checkEnoughCandidates(Math.min(count, 1), list)
      weights    = getWeights(candidates, listReporter(reporter))
      indices    = pickIndicesWithRepeats(count, weights, workspace.world.rng)
      indices.map( (i) -> candidates[i] )

    # (Number, AgentSet, Reporter) => AgentSet
    weightedNOf = (n, agentset, reporter) ->
      count      = checkNonNegative("WEIGHTED-N-OF", n)
      candidates = checkEnoughCandidates(count, agentsetCandidates(agentset))
      weights    = getWeights(candidates, agentReporter(reporter))
      indices    = pickIndicesWithoutRepeats(count, weights, workspace.world.rng)
      agentset.copyWithNewAgents(indices.map( (i) -> candidates[i] ))

    # (Number, AgentSet, Reporter) => Array[Agent]
    weightedNOfWithRepeats = (n, agentset, reporter) ->
      count      = checkNonNegative("WEIGHTED-N-OF-WITH-REPEATS", n)
      candidates = checkEnoughCandidates(Math.min(count, 1), agentsetCandidates(agentset))
      weights    = getWeights(candidates, agentReporter(reporter))
      indices    = pickIndicesWithRepeats(count, weights, workspace.world.rng)
      indices.map( (i) -> candidates[i] )

    {
      name: "rnd"
    , prims: {
                        "WEIGHTED-ONE-OF": weightedOneOf
      ,            "WEIGHTED-ONE-OF-LIST": weightedOneOfList
      ,                   "WEIGHTED-N-OF": weightedNOf
      ,              "WEIGHTED-N-OF-LIST": weightedNOfList
      ,      "WEIGHTED-N-OF-WITH-REPEATS": weightedNOfWithRepeats
      , "WEIGHTED-N-OF-LIST-WITH-REPEATS": weightedNOfListWithRepeats
      }
    }

}
