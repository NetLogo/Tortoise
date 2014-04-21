#@# I hate this class's name and insist that it changes, hopefully getting rolled in with `AgentSet`
define(['engine/agentkind', 'engine/link'], (AgentKind, Link) ->
  class Agents
    constructor: (@items, @breed, @kind) ->
    toString: ->
      "(agentset, #{@items.length} #{@breed.name.toLowerCase()})"
    sort: ->
      if(@items.length == 0) #@# Lodash
        @items
      else if @kind is AgentKind.Turtle or @kind is AgentKind.Patch #@# Unify
        @items[..].sort((x, y) -> x.compare(y).toInt)
      else if @kind is AgentKind.Link
        @items[..].sort(Link.Companion.compare)
      else
        throw new Error("We don't know how to sort your kind here!") #@# I'm a bad dude
)
