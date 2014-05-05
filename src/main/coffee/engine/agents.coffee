define(['integration/lodash', 'engine/agentkind'], (_, AgentKind) ->
  class Agents
    constructor: (@items, @breed, @kind) ->
    toString: ->
      "(agentset, #{@items.length} #{@breed.name.toLowerCase()})"
    sort: ->
      if _(@items).isEmpty()
        @items
      else if @kind is AgentKind.Turtle or @kind is AgentKind.Patch #@# Unify
        _(@items).clone().sort((x, y) -> x.compare(y).toInt)
      else if @kind is AgentKind.Link
        _(@items).clone().sort((x, y) -> x.world.linkCompare(x, y)) #@# Kind of obfuscated
      else
        throw new Error("We don't know how to sort your kind here!")
)
