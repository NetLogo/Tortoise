# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

extensionPaths = ['array', 'codap', 'encode', 'dialog', 'export-the', 'fetch', 'http-req', 'import-a', 'logging', 'matrix', 'mini-csv', 'nlmap', 'nt', 'send-to', 'store']

dumpers = extensionPaths.map((path) -> require("extensions/#{path}").dumper).filter((x) -> x?)

module.exports = {

  initialize: (workspace) ->
    extObj = {}
    extensionPaths.forEach((path) -> e = require("extensions/#{path}").init(workspace); extObj[e.name.toUpperCase()] = e)
    extObj

  dumpers: -> dumpers

}
