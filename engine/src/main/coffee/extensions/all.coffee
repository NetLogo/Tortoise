# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

extensionPaths = ['codap', 'encode', 'dialog', 'export-the', 'fetch', 'http-req', 'import-a', 'logging', 'mini-csv', 'nlmap', 'send-to', 'store']

dumpers = extensionPaths.map((path) -> require("extensions/#{path}").dumper).filter((x) -> x?)

module.exports = {

  initialize: (workspace) ->
    extObj = {}
    extensionPaths.forEach((path) -> e = require("extensions/#{path}").init(workspace); extObj[e.name.toUpperCase()] = e)
    extObj

  dumpers: -> dumpers

}
