# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

extensionPaths = ['array', 'codap', 'csv', 'encode', 'dialog', 'export-the', 'fetch', 'http-req', 'import-a', 'logging', 'matrix', 'nlmap', 'nt', 'send-to', 'sound', 'store', 'table']

dumpers = extensionPaths.map((path) -> require("extensions/#{path}").dumper).filter((x) -> x?)

module.exports = {

  initialize: (workspace) ->
    extObj = {}
    extensionPaths.forEach((path) -> e = require("extensions/#{path}").init(workspace); extObj[e.name.toUpperCase()] = e)
    extObj

  dumpers: -> dumpers

}
