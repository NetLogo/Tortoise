# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise
goog.provide('engine.core.structure.worldlinks')

goog.require('engine.core.structure.linkcompare')
goog.require('shim.mori')

  class WorldLinks

    @_links: undefined # Mori.SortedSet[Link]

    # () => WorldLinks
    constructor: ->
      @_links = Mori.sorted_set_by(linkCompare)

    # Side-effecting ops
    insert: (link) -> @_links = Mori.conj(@_links, link); this # (Link) => WorldLinks
    remove: (link) -> @_links = Mori.disj(@_links, link); this # (Link) => WorldLinks

    # Pure ops
    find:   (pred) -> Mori.first(Mori.filter(pred, @_links)) # Mori's `filter` is lazy, so it's all cool --JAB (3/26/14) # ((Link) => Boolean) => Link
    isEmpty:       -> Mori.is_empty(@_links)  # () => Boolean
    toArray:       -> Mori.clj_to_js(@_links) # () => Array[Link]

