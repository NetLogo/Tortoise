# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# As far as dependencies and private access go, I'm treating this as if it's a part of `World` --JAB (8/5/14)

_           = require('lodash')
Link        = require('../link')
LinkSet     = require('../linkset')
Nobody      = require('../nobody')
Builtins    = require('../structure/builtins')
IDManager   = require('./idmanager')
SortedLinks = require('./sortedlinks')
stableSort  = require('util/stablesort')

module.exports =

  class LinkManager

    _linkArrCache: undefined # Array[Link]

    _links:     undefined # SortedLinks
    _linksFrom: undefined # Object[String, Object[Number, Number]]
    _idManager: undefined # IDManager
    _linksTo:   undefined # Object[String, Object[Number, Number]]

    # (World, BreedManager, Updater, () => Unit, () => Unit) => LinkManager
    constructor: (@_world, @_breedManager, @_updater, @_notifyIsDirected, @_notifyIsUndirected) ->
      @clear()

    # () => Unit
    clear: ->
      @_linkArrCache = undefined
      @_links        = new SortedLinks
      @_linksFrom    = {}
      @_idManager    = new IDManager
      @_linksTo      = {}

    # (Turtle, Turtle, String) => Link
    createDirectedLink: (from, to, breedName) ->
      if (breedName.toUpperCase() is "LINKS") then @_notifyIsDirected()
      @_createLink(true, from, to, breedName)

    # (Turtle, TurtleSet, String) => LinkSet
    createDirectedLinks: (source, others, breedName) ->
      if (breedName.toUpperCase() is "LINKS") then @_notifyIsDirected()
      @_createLinksBy((turtle) => @_createLink(true, source, turtle, breedName))(others)

    # (Turtle, TurtleSet, String) => LinkSet
    createReverseDirectedLinks: (source, others, breedName) ->
      if (breedName.toUpperCase() is "LINKS") then @_notifyIsDirected()
      @_createLinksBy((turtle) => @_createLink(true, turtle, source, breedName))(others)

    # (Turtle, Turtle, String) => Link
    createUndirectedLink: (source, other, breedName) ->
      @_createLink(false, source, other, breedName)

    # (Turtle, TurtleSet, String) => LinkSet
    createUndirectedLinks: (source, others, breedName) ->
      @_createLinksBy((turtle) => @_createLink(false, source, turtle, breedName))(others)

    # (Number, Number, String) => Agent
    getLink: (fromId, toId, breedName = "LINKS") ->

      isDirected = @_breedManager.get(breedName).isDirected()

      findFunc =
        (link) ->
          link.getBreedName().toLowerCase() is breedName.toLowerCase() and
            (link.end1.id is fromId and link.end2.id is toId) or
            (not isDirected and link.end1.id is toId and link.end2.id is fromId)

      @_links.find(findFunc) ? Nobody

    # () => LinkSet
    links: ->
      thunk = (=> @_linkArray())
      new LinkSet(thunk, "LINKS", "links")

    # (String) => LinkSet
    linksOfBreed: (breedName) =>
      thunk = (=> stableSort(@_breedManager.get(breedName).members)((x, y) -> x.compare(y).toInt))
      new LinkSet(thunk, breedName, breedName)

    # () => Array[Link]
    _linkArray: ->
      if not @_linkArrCache?
        @_linkArrCache = @_links.toArray()
      @_linkArrCache

    # (Link) => Unit
    _removeLink: (link) =>
      l = @_links.find(({id}) -> id is link.id)
      @_links = @_links.remove(l)
      @_linkArrCache = undefined
      if @_links.isEmpty() then @_notifyIsUndirected()

      remove = (set, id1, id2) -> if set? then set[id1] = _(set[id1]).without(id2).value()
      remove(@_linksFrom[link.getBreedName()], link.end1.id, link.end2.id)
      if not link.isDirected then remove(@_linksTo[link.getBreedName()], link.end2.id, link.end1.id)

      return

    # (Boolean, Turtle, Turtle, String) => Link
    _createLink: (isDirected, from, to, breedName) ->
      [end1, end2] =
        if from.id < to.id or isDirected
          [from, to]
        else
          [to, from]

      if not @_linkExists(end1.id, end2.id, isDirected, breedName)
        breed = @_breedManager.get(breedName)
        link  = new Link(@_idManager.next(), isDirected, end1, end2, @_world, @_updater.updated, @_updater.registerDeadLink, @_removeLink, @_updater.registerLinkStamp, @linksOfBreed, breed)
        @_updater.updated(link)(Builtins.linkBuiltins...)
        @_updater.updated(link)(Builtins.linkExtras...)
        @_links.insert(link)
        @_linkArrCache = undefined
        @_insertIntoSets(end1.id, end2.id, isDirected, breedName)
        link
      else
        Nobody

    # ((Turtle) => Link) => (TurtleSet) => LinkSet
    _createLinksBy: (mkLink) -> (turtles) ->
      isLink = (other) -> other isnt Nobody
      links  = turtles.toArray().map(mkLink).filter(isLink)
      new LinkSet(links)

    # (Number, Number, Boolean, String) => Unit
    _insertIntoSets: (fromID, toID, isDirected, breedName) ->
      insertIntoSet =
        (set, id1, id2) ->
          if not set[breedName]?
            set[breedName] = {}

          neighbors = set[breedName][id1]

          if neighbors?
            neighbors.push(id2)
          else
            set[breedName][id1] = [id2]

      insertIntoSet(@_linksFrom, fromID, toID)
      if not isDirected then insertIntoSet(@_linksTo, toID, fromID)
      return

    # (Number, Number, Boolean, String) => Boolean
    _linkExists: (id1, id2, isDirected, breedName) ->
      _(@_linksFrom[breedName]?[id1]).contains(id2) or (not isDirected and _(@_linksTo[breedName]?[id1]).contains(id2))
