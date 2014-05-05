define(['engine/agentkind', 'engine/exception'], (AgentKind, Exception) ->
  class Agents
    constructor: (@items, @breed, @kind) ->
    toString: ->
      "(agentset, #{@items.length} #{@breed.name.toLowerCase()})"
    sort: ->
      if @items.length is 0 #@# Lodash
        @items
      else if @kind is AgentKind.Turtle or @kind is AgentKind.Patch #@# Unify
        @items[..].sort((x, y) -> x.compare(y).toInt)
      else if @kind is AgentKind.Link
        @items[..].sort((x, y) -> x.world.linkCompare(x, y)) #@# Kind of obfuscated
      else
        throw new Exception.NetLogoException("We don't know how to sort your kind here!")
)
