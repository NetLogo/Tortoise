# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

{ exceptionFactory: exceptions } = require('util/exception')
{ checks } = require('../engine/core/typechecker')
{ Setters: TurtleSetters } = require('../engine/core/turtle/turtlevariables')
{ determineDirectedness } = require('extensions/nw-core')

notImplemented = (name) ->
  -> throw exceptions.extension("nw:#{name} is not yet implemented")

# The file-based import/export primitives cannot work in NetLogo Web, which has no user-visible file system.  Point
# users at the string-based counterparts (nw:save-to-string / nw:load-from-string) that move the same data through an
# in-memory string instead of a file.  -Jeremy B
notSupportedOnWeb = (name, replacement) ->
  -> throw exceptions.extension("nw:#{name} is not supported by NetLogo Web. Use nw:#{replacement} instead.")

module.exports = {

  init: (workspace) ->

    TurtleSet = require('../engine/core/turtleset')
    LinkSet   = require('../engine/core/linkset')

    # type Context = {
    #   turtles: TurtleSet
    #   links: LinkSet
    #   isDirected: Boolean
    # }
    contextStack = []
    currentContext = null

    getCurrentContext = ->
      if currentContext?
        currentContext
      else
        allLinks = workspace.world.links()
        {
          turtles:    workspace.world.turtles()
          links:      allLinks
          isDirected: determineDirectedness(allLinks)
        }

    clearContext = ->
      currentContext = null
      contextStack = []
      return

    setContext = (turtleset, linkset) ->
      if not checks.isTurtleSet(turtleset)
        throw exceptions.extension("First argument to nw:set-context must be a turtle agentset")

      if not checks.isLinkSet(linkset)
        throw exceptions.extension("Second argument to nw:set-context must be a link agentset")

      currentContext = {
        turtles:    turtleset
        links:      linkset
        isDirected: determineDirectedness(linkset)
      }
      return

    getContext = ->
      ctx = getCurrentContext()
      [ctx.turtles, ctx.links]

    withContext = (turtleset, linkset, commandThunk) ->
      previousContext = currentContext
      setContext(turtleset, linkset)
      contextStack.push(previousContext)

      try
        result = commandThunk()
      finally
        contextStack.pop()
        currentContext = previousContext

      result

    # Feature groups live in their own modules.  Static helpers they require directly from nw-core; only the runtime
    # bits (the workspace and the stateful current-context accessor) are passed in.
    runtime      = { workspace, getCurrentContext }
    genPrims     = require('extensions/nw-generators')({ workspace })
    ioPrims      = require('extensions/nw-io')(runtime)
    pathsPrims   = require('extensions/nw-paths')(runtime)
    metricsPrims = require('extensions/nw-metrics')(runtime)

    {
      name: "nw"
    , clearAll: clearContext
    , prims: {
        "SET-CONTEXT":                      setContext
      , "GET-CONTEXT":                      getContext
      , "WITH-CONTEXT":                     withContext
      , "TURTLES-IN-RADIUS":                pathsPrims["TURTLES-IN-RADIUS"]
      , "TURTLES-IN-OUT-RADIUS":            pathsPrims["TURTLES-IN-OUT-RADIUS"]
      , "TURTLES-IN-IN-RADIUS":             pathsPrims["TURTLES-IN-IN-RADIUS"]
      , "TURTLES-IN-REVERSE-RADIUS":        pathsPrims["TURTLES-IN-REVERSE-RADIUS"]
      , "DISTANCE-TO":                      pathsPrims["DISTANCE-TO"]
      , "PATH-TO":                          pathsPrims["PATH-TO"]
      , "TURTLES-ON-PATH-TO":               pathsPrims["TURTLES-ON-PATH-TO"]
      , "WEIGHTED-DISTANCE-TO":             pathsPrims["WEIGHTED-DISTANCE-TO"]
      , "WEIGHTED-PATH-TO":                 pathsPrims["WEIGHTED-PATH-TO"]
      , "TURTLES-ON-WEIGHTED-PATH-TO":      pathsPrims["TURTLES-ON-WEIGHTED-PATH-TO"]
      , "MEAN-PATH-LENGTH":                 pathsPrims["MEAN-PATH-LENGTH"]
      , "MEAN-WEIGHTED-PATH-LENGTH":        pathsPrims["MEAN-WEIGHTED-PATH-LENGTH"]
      , "BETWEENNESS-CENTRALITY":           metricsPrims["BETWEENNESS-CENTRALITY"]
      , "CLOSENESS-CENTRALITY":             metricsPrims["CLOSENESS-CENTRALITY"]
      , "WEIGHTED-CLOSENESS-CENTRALITY":    metricsPrims["WEIGHTED-CLOSENESS-CENTRALITY"]
      , "EIGENVECTOR-CENTRALITY":           metricsPrims["EIGENVECTOR-CENTRALITY"]
      , "PAGE-RANK":                        metricsPrims["PAGE-RANK"]
      , "CLUSTERING-COEFFICIENT":           metricsPrims["CLUSTERING-COEFFICIENT"]
      , "WEAK-COMPONENT-CLUSTERS":          metricsPrims["WEAK-COMPONENT-CLUSTERS"]
      , "LOUVAIN-COMMUNITIES":              metricsPrims["LOUVAIN-COMMUNITIES"]
      , "MODULARITY":                       metricsPrims["MODULARITY"]
      , "MAXIMAL-CLIQUES":                  metricsPrims["MAXIMAL-CLIQUES"]
      , "BIGGEST-MAXIMAL-CLIQUES":          metricsPrims["BIGGEST-MAXIMAL-CLIQUES"]
      , "GENERATE-PREFERENTIAL-ATTACHMENT": genPrims["GENERATE-PREFERENTIAL-ATTACHMENT"]
      , "GENERATE-RANDOM":                  genPrims["GENERATE-RANDOM"]
      , "GENERATE-WATTS-STROGATZ":          genPrims["GENERATE-WATTS-STROGATZ"]
      , "SAVE-GRAPHML":                     notSupportedOnWeb("save-graphml", "save-to-string")
      , "LOAD-GRAPHML":                     notSupportedOnWeb("load-graphml", "load-from-string")
      , "SAVE-MATRIX":                      notSupportedOnWeb("save-matrix",  "save-to-string")
      , "LOAD-MATRIX":                      notSupportedOnWeb("load-matrix",  "load-from-string")
      , "SAVE-DL":                          notSupportedOnWeb("save-dl",      "save-to-string")
      , "LOAD-DL":                          notSupportedOnWeb("load-dl",      "load-from-string")
      , "SAVE-GDF":                         notSupportedOnWeb("save-gdf",     "save-to-string")
      , "LOAD-GDF":                         notSupportedOnWeb("load-gdf",     "load-from-string")
      , "SAVE-GEXF":                        notSupportedOnWeb("save-gexf",    "save-to-string")
      , "LOAD-GEXF":                        notSupportedOnWeb("load-gexf",    "load-from-string")
      , "SAVE-GML":                         notSupportedOnWeb("save-gml",     "save-to-string")
      , "LOAD-GML":                         notSupportedOnWeb("load-gml",     "load-from-string")
      , "SAVE-VNA":                         notSupportedOnWeb("save-vna",     "save-to-string")
      , "LOAD-VNA":                         notSupportedOnWeb("load-vna",     "load-from-string")
      , "SAVE":                             notSupportedOnWeb("save",         "save-to-string")
      , "LOAD":                             notSupportedOnWeb("load",         "load-from-string")
      , "SAVE-TO-STRING":                   ioPrims["SAVE-TO-STRING"]
      , "LOAD-FROM-STRING":                 ioPrims["LOAD-FROM-STRING"]
      }
    }

}
