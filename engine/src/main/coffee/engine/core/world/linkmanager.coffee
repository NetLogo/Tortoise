# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# As far as dependencies and private access go, I'm treating this as if it's a part of `World` --JAB (8/5/14)

Link        = require('../link')
LinkSet     = require('../linkset')
Builtins    = require('../structure/builtins')
IDManager   = require('./idmanager')
SortedLinks = require('./sortedlinks')
stableSort  = require('util/stablesort')

{ contains, exists, filter, isEmpty, map } = require('brazierjs/array')
{ pipeline }                               = require('brazierjs/function')
{ pairs, values }                          = require('brazierjs/object')

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
            ((link.end1.id is fromId and link.end2.id is toId) or
             (not isDirected and link.end1.id is toId and link.end2.id is fromId))

      @_links.find(findFunc) ? Nobody

    # (Object[Any]) => Unit
    importState: (linkState) ->
      linkState.forEach(
        ({ breed, end1, end2, color, isHidden, labelColor, shape, thickness, tieMode }) =>
          newLink = @_createLink(breed.isDirected(), end1, end2, breed.name)
          newLink.setVariable(      'color', color)
          newLink.setVariable(    'hidden?', isHidden)
          newLink.setVariable('label-color', labelColor)
          newLink.setVariable(      'shape', shape)
          newLink.setVariable(  'thickness', thickness)
          newLink.setVariable(   'tie-mode', tieMode)
          return
      )
      return

    # () => LinkSet
    links: ->
      thunk = (=> @_linkArray())
      new LinkSet(thunk, @_world, "links")

    # (String) => LinkSet
    linksOfBreed: (breedName) =>
      thunk = (=> stableSort(@_breedManager.get(breedName).members)((x, y) -> x.compare(y).toInt))
      new LinkSet(thunk, @_world, breedName)

    # () => Array[Link]
    _linkArray: ->
      if not @_linkArrCache?
        @_linkArrCache = @_links.toArray()
      @_linkArrCache

    # Link -> Breed -> String -> Unit
    trackBreedChange: (link, breed, oldBreedName) ->
      { end1, end2, isDirected } = link
      @_errorIfBreedIsIncompatible(breed.name)
      existingLink = @getLink(end1.id, end2.id, breed.name)
      if existingLink isnt link and existingLink isnt Nobody
        throw new Error("there is already a #{breed.singular.toUpperCase()} \
                         with endpoints #{end1.getName()} and #{end2.getName()}")
      else
        @_removeFromSets(end1.id, end2.id, isDirected, oldBreedName)
        @_insertIntoSets(end1.id, end2.id, isDirected, breed.name)
      return

    # (Link) => Unit
    _removeLink: (link) =>
      l = @_links.find(({id}) -> id is link.id)
      @_links = @_links.remove(l)
      @_linkArrCache = undefined
      if @_links.isEmpty() then @_notifyIsUndirected()

      @_removeFromSets(link.end1.id, link.end2.id, link.isDirected, link.getBreedName())

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
        link
      else
        Nobody

    # ((Turtle) => Link) => (TurtleSet) => LinkSet
    _createLinksBy: (mkLink) => (turtles) =>
      isLink = (other) -> other isnt Nobody
      links  = pipeline(map(mkLink), filter(isLink))(turtles.toArray())
      new LinkSet(links, @_world)

    # String -> Unit
    _errorIfBreedIsIncompatible: (breedName) ->
      if (breedName is   "LINKS" and @_hasBreededs()) or
         (breedName isnt "LINKS" and @_hasUnbreededs())
        throw new Error("You cannot have both breeded and unbreeded links in the same world.")
      return

    # Unit -> Boolean
    _hasBreededs: ->
      allPairs = pairs(@_linksTo).concat(pairs(@_linksFrom))
      exists(
        ([key, value]) ->
          key isnt "LINKS" and exists((x) -> not isEmpty(x))(values(value))
      )(allPairs)

    # Unit -> Boolean
    _hasUnbreededs: ->
      hasUnbreededs = (bin) -> exists((x) -> not isEmpty(x))(values(bin["LINKS"] ? {}))
      hasUnbreededs(@_linksFrom) or hasUnbreededs(@_linksTo)

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
      weCanHaz = pipeline(values, contains(id2))
      weCanHaz(@_linksFrom[breedName]?[id1] ? {}) or (not isDirected and weCanHaz(@_linksTo[breedName]?[id1] ? {}))

    # Number -> Number -> Boolean -> String -> Unit
    _removeFromSets: (fromID, toID, isDirected, breedName) ->
      remove = (set, id1, id2) -> if set?[id1]? then set[id1] = filter((x) -> x isnt id2)(set[id1])
      remove(@_linksFrom[breedName], fromID, toID)
      if not isDirected then remove(@_linksTo[breedName], toID, fromID)
      return
