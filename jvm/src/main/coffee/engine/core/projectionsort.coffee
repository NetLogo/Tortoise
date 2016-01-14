# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

_          = require('lodash')
NLType     = require('./typechecker')
Comparator = require('util/comparator')
stableSort = require('util/stablesort')

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
  _(keys).foldl(f, {})

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

          type = NLType(value)
          key  =
            if type.isNumber()
              NumberKey
            else if type.isString()
              StringKey
            else if type.isAgent()
              AgentKey
            else
              OtherKey

          acc[key].push(pair)
          acc

      baseAcc            = initializeDictionary([NumberKey, StringKey, AgentKey, OtherKey], -> [])
      typeNameToPairsMap = _(agents).foldl(mapBuildFunc, baseAcc)

      typesInMap = _(typeNameToPairsMap).omit(_.isEmpty).keys().value()

      [typeName, sortingFunc] =
        switch typesInMap.join(" ")
          when NumberKey then [NumberKey, ([[], n1], [[], n2]) -> Comparator.numericCompare(n1, n2).toInt]
          when StringKey then [StringKey, ([[], s1], [[], s2]) -> Comparator.stringCompare(s1, s2).toInt]
          when AgentKey  then [AgentKey,  ([[], a1], [[], a2]) -> a1.compare(a2).toInt]
          else                throw new Error("SORT-ON works on numbers, strings, or agents of the same type.")

      pairs = typeNameToPairsMap[typeName]

      stableSort(pairs)(sortingFunc).map(([x, []]) -> x)
