define(->

  class LinkPrims

    constructor: (@world) ->
      @self    = @world.agentSet.self
      @shuffle = @world.agentSet.shuffle

    createLinkFrom: (other) -> @world.createDirectedLink(other, @self())
    createLinksFrom: (others) -> @world.createReverseDirectedLinks(@self(), @shuffle(others))
    createLinkTo: (other) -> @world.createDirectedLink(@self(), other)
    createLinksTo: (others) -> @world.createDirectedLinks(@self(), @shuffle(others))
    createLinkWith: (other) -> @world.createUndirectedLink(@self(), other)
    createLinksWith: (others) -> @world.createUndirectedLinks(@self(), @shuffle(others))

    # (Boolean, Boolean) => Array[Link]
    connectedLinks: (directed, isSource) -> @self().connectedLinks(directed, isSource)

    # (Boolean, Boolean) => Array[Turtle]
    linkNeighbors: (directed, isSource) -> @self().linkNeighbors(directed, isSource)

    # (Boolean, Boolean) => (Turtle) => Boolean
    isLinkNeighbor: (directed, isSource) -> ((other) => @self().isLinkNeighbor(directed, isSource, other))

    # (Boolean, Boolean) => (Turtle) => Link
    findLinkViaNeighbor: (directed, isSource) -> ((other) => @self().findLinkViaNeighbor(directed, isSource, other))

)
