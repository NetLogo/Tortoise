# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ checks } = require('./typechecker')
Comparator = require('util/comparator')
stableSort = require('util/stablesort')

{ filter, foldl, isEmpty, map } = require('brazierjs/array')
{ pipeline }                    = require('brazierjs/function')
{ pairs }                       = require('brazierjs/object')

NumberKey = "number"
StringKey = "string"
AgentKey  = "agent"
OtherKey  = "other"

# [T] @ (Array[String], (String) => T) => Object[String, T]
initializeDictionary = (keys, generator) ->
  f =
    (acc, key) ->
      acc[key] = generator(key)
      acc
  foldl(f)({})(keys)

# [T <: Agent, U] @ (Array[T]) => ((T) => U) => Array[T]
module.exports =
  (agents) -> (f) ->
    if (agents.length < 2)
      agents
    else

      mapBuildFunc =
        (acc, agent) ->

          value = agent.projectionBy(f)
          pair  = [agent, value]

          key  =
            if checks.isNumber(value)
              NumberKey
            else if checks.isString(value)
              StringKey
            else if checks.isAgent(value)
              AgentKey
            else
              OtherKey

          acc[key].push(pair)
          acc

      first              = ([x, _]) -> x
      baseAcc            = initializeDictionary([NumberKey, StringKey, AgentKey, OtherKey], -> [])
      typeNameToPairsMap = foldl(mapBuildFunc)(baseAcc)(agents)
      typesInMap         = pipeline(pairs, filter(([_, x]) -> not isEmpty(x)), map(first))(typeNameToPairsMap)

      [typeName, sortingFunc] =
        switch typesInMap.join(" ")
          when NumberKey then [NumberKey, ([[], n1], [[], n2]) -> Comparator.numericCompare(n1, n2).toInt]
          when StringKey then [StringKey, ([[], s1], [[], s2]) -> Comparator.stringCompare(s1, s2).toInt]
          when AgentKey  then [AgentKey,  ([[], a1], [[], a2]) -> a1.compare(a2).toInt]
          else                throw new Error("SORT-ON works on numbers, strings, or agents of the same type.")

      agentValuePairs = typeNameToPairsMap[typeName]

      map(first)(stableSort(agentValuePairs)(sortingFunc))
