define(->

  class LinkPrims

    constructor: (@world) ->

    createLinkFrom: (other) -> @world.createDirectedLink(other, @_self)
    createLinksFrom: (others) -> @world.createReverseDirectedLinks(@_self, @shuffle(others))
    createLinkTo: (other) -> @world.createDirectedLink(@_self, other)
    createLinksTo: (others) -> @world.createDirectedLinks(@_self, @shuffle(others))
    createLinkWith: (other) -> @world.createUndirectedLink(@_self, other)
    createLinksWith: (others) -> @world.createUndirectedLinks(@_self, @shuffle(others))

)
