# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

extensionPaths = ['codap', 'logging', 'nlmap', 'http-req']

dumpers = extensionPaths.map((path) -> require("extensions/#{path}").dumper).filter((x) -> x?)

module.exports = {

  initialize: (workspace) ->
    extObj = {}
    extensionPaths.forEach((path) -> e = require("extensions/#{path}").init(workspace); extObj[e.name.toUpperCase()] = e)
    extObj

  dumpers: -> dumpers

}
