# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

linkCompare = require('../structure/linkcompare')
Mori        = require('mori')

module.exports =
  class SortedLinks

    @_links: undefined # Mori.SortedSet[Link]

    # () => SortedLinks
    constructor: ->
      @_links = Mori.sorted_set_by(linkCompare)

    # Side-effecting ops
    insert: (link) -> @_links = Mori.conj(@_links, link); this # (Link) => SortedLinks
    remove: (link) -> @_links = Mori.disj(@_links, link); this # (Link) => SortedLinks

    # Pure ops
    find:   (pred) -> Mori.first(Mori.filter(pred, @_links)) # Mori's `filter` is lazy, so it's all cool --JAB (3/26/14) # ((Link) => Boolean) => Link
    isEmpty:       -> Mori.is_empty(@_links)  # () => Boolean
    toArray:       -> Mori.clj_to_js(@_links) # () => Array[Link]
