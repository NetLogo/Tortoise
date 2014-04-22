define(['integration/mori'], (Mori) ->

  class WorldLinks

    constructor: (@_compareFunc) ->
      @_links = Mori.sorted_set_by(@_compareFunc)

    # Side-effecting ops
    insert: (l)    -> @_links = Mori.conj(@_links, l); this
    remove: (link) -> @_links = Mori.disj(@_links, link); this

    # Pure ops
    find:   (pred) -> Mori.first(Mori.filter(pred, @_links)) # Mori's `filter` is lazy, so it's all cool --JAB (3/26/14)
    isEmpty:       -> Mori.is_empty(@_links)
    toArray:       -> Mori.clj_to_js(@_links)

)
