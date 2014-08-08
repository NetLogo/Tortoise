# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# As far as dependencies and private access go, I'm treating this as if it's a part of `World` --JAB (8/5/14)

define(['engine/core/link', 'engine/core/linkset', 'engine/core/nobody', 'engine/core/structure/builtins'
      , 'engine/core/world/idmanager', 'engine/core/world/sortedlinks']
     , ( Link,               LinkSet,               Nobody,               Builtins
      ,  IDManager,                     SortedLinks) ->

  _links:         undefined # SortedLinks
  _linkIDManager: undefined # IDManager

  class LinkManager

    # (World, BreedManager, Updater, () => Unit, () => Unit) => LinkManager
    constructor: (@_world, @_breedManager, @_updater, @_notifyIsDirected, @_notifyIsUndirected) ->
      @_links         = new SortedLinks
      @_linkIDManager = new IDManager

    # (Turtle, Turtle) => Link
    createDirectedLink: (from, to) ->
      @_notifyIsDirected()
      @_createLink(true, from, to)

    # (Turtle, TurtleSet) => LinkSet
    createDirectedLinks: (source, others) ->
      @_notifyIsDirected()
      @_createLinksBy((turtle) => @_createLink(true, source, turtle))(others)

    # (Turtle, TurtleSet) => LinkSet
    createReverseDirectedLinks: (source, others) ->
      @_notifyIsDirected()
      @_createLinksBy((turtle) => @_createLink(true, turtle, source))(others)

    # (Turtle, Turtle) => Link
    createUndirectedLink: (source, other) ->
      @_createLink(false, source, other)

    # (Turtle, TurtleSet) => LinkSet
    createUndirectedLinks: (source, others) ->
      @_createLinksBy((turtle) => @_createLink(false, source, turtle))(others)

    # (Number, Number) => Agent
    getLink: (fromId, toId) ->
      link = @_links.find((link) -> link.end1.id is fromId and link.end2.id is toId)
      if link?
        link
      else
        Nobody

    # () => LinkSet
    links: ->
      new LinkSet(@_links.toArray())

    # (String) => LinkSet
    _linksOfBreed: (breedName) =>
      breed = @_breedManager.get(breedName)
      new LinkSet(breed.members, breedName)

    # (Number) => Unit
    _removeLink: (id) =>
      link = @_links.find((link) -> link.id is id)
      @_links = @_links.remove(link)
      if @_links.isEmpty() then @_notifyIsUndirected()
      return

    # () => Unit
    _resetIDs: ->
      @_linkIDManager.reset()

    ###
    #@# We shouldn't be looking up links in the tree everytime we create a link; JVM NL uses 2 `LinkedHashMap[Turtle, Buffer[Link]]`s (to, from) --JAB (2/7/14)
    ###
    # (Boolean, Turtle, Turtle) => Link
    _createLink: (isDirected, from, to) ->
      [end1, end2] =
      if from.id < to.id or isDirected
        [from, to]
      else
        [to, from]

      if @getLink(end1.id, end2.id) is Nobody
        link = new Link(@_linkIDManager.next(), isDirected, end1, end2, @_world, @_updater.updated, @_updater.registerDeadLink, @_removeLink, @_linksOfBreed)
        @_updater.updated(link)(Builtins.linkBuiltins...)
        @_updater.updated(link)(Builtins.linkExtras...)
        @_links.insert(link)
        link
      else
        Nobody

    # ((Turtle) => Link) => (TurtleSet) => LinkSet
    _createLinksBy: (mkLink) -> (turtles) ->
      isLink = (other) -> other isnt Nobody
      links  = turtles.toArray().map(mkLink).filter(isLink)
      new LinkSet(links)

)
